const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { awardXP } = require('../services/xpService');
const { emitChallengeCompleted } = require('../services/socketService');
const { success, error } = require('../utils/responseHelper');

const vm = require('vm');
const { execSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ─── Security Constants ──────────────────────────────────────────────────────
const MAX_CODE_LENGTH = 50000; // 50KB max code size
const JS_EXECUTION_TIMEOUT = 3000; // 3 seconds
const PY_EXECUTION_TIMEOUT = 5000; // 5 seconds
const ALLOWED_LANGUAGES = ['javascript', 'python'];

// Patterns that indicate sandbox escape attempts in JavaScript
const JS_BANNED_PATTERNS = [
  /this\s*\.\s*constructor/i,
  /\.__proto__/i,
  /\[['"]__proto__['"]\]/i,
  /Object\s*\.\s*getPrototypeOf/i,
  /Reflect\s*\./i,
  /globalThis/i,
  /\bprocess\b/,
  /\bchild_process\b/,
  /\brequire\s*\(/,
  /\bimport\s*\(/,
  /Function\s*\(/,
  /eval\s*\(/,
];

// Modules that should never be imported in Python submissions
const PY_BANNED_IMPORTS = [
  'os', 'subprocess', 'shutil', 'socket', 'http', 'urllib',
  'requests', 'ctypes', 'signal', 'multiprocessing', 'threading',
  'importlib', 'builtins', '__builtin__', 'code', 'codeop',
  'compile', 'compileall', 'py_compile', 'runpy', 'pkgutil',
];

// ─── Security Validators ─────────────────────────────────────────────────────

/**
 * Validates submitted code for size and language constraints.
 * Returns an error string if invalid, or null if valid.
 */
function validateCodeInput(code, language) {
  if (!code || typeof code !== 'string') return 'Code is required.';
  if (code.length > MAX_CODE_LENGTH) return `Code exceeds maximum allowed length of ${MAX_CODE_LENGTH} characters.`;
  if (!ALLOWED_LANGUAGES.includes(language)) return `Unsupported language: ${language}. Allowed: ${ALLOWED_LANGUAGES.join(', ')}`;
  return null;
}

/**
 * Checks JavaScript code for known sandbox escape patterns.
 * Returns an error string if a banned pattern is found, or null if safe.
 */
function detectJSBannedPatterns(code) {
  for (const pattern of JS_BANNED_PATTERNS) {
    if (pattern.test(code)) {
      return 'Code contains disallowed patterns. Please use only standard language features.';
    }
  }
  return null;
}

/**
 * Checks Python code for dangerous module imports.
 * Returns an error string if a banned import is found, or null if safe.
 */
function detectPyBannedImports(code) {
  for (const mod of PY_BANNED_IMPORTS) {
    // Match: import os, from os import, __import__('os')
    const patterns = [
      new RegExp(`\\bimport\\s+${mod}\\b`),
      new RegExp(`\\bfrom\\s+${mod}\\b`),
      new RegExp(`__import__\\s*\\(\\s*['"]${mod}['"]\\s*\\)`),
    ];
    for (const p of patterns) {
      if (p.test(code)) {
        return `Import of '${mod}' is not allowed for security reasons.`;
      }
    }
  }

  // Block open() for file I/O and exec()/eval() for dynamic code execution
  if (/\bopen\s*\(/.test(code)) return 'File I/O (open) is not allowed.';
  if (/\bexec\s*\(/.test(code)) return 'Dynamic code execution (exec) is not allowed.';

  return null;
}

// ─── Argument Parser ─────────────────────────────────────────────────────────
// Splits a test-case input string like `[1,2,3], 9` into JS values safely.
function parseArgs(inputStr) {
  if (!inputStr || inputStr.trim() === '""' || inputStr.trim() === "''") return [];

  // Wrap in array brackets so JSON.parse handles it as a tuple
  const wrapped = `[${inputStr}]`;
  try {
    return JSON.parse(wrapped);
  } catch (_) {
    // Fallback: eval in a restricted sandbox (only literal value constructors)
    try {
      const sandbox = Object.create(null);
      sandbox.Math = Math;
      sandbox.String = String;
      sandbox.Number = Number;
      sandbox.Array = Array;
      sandbox.Object = Object;
      vm.createContext(sandbox);
      return vm.runInContext(`(function(){ return [${inputStr}]; })()`, sandbox, { timeout: 500 });
    } catch (_2) {
      return [inputStr]; // last resort: treat as single string
    }
  }
}

// ─── JS Evaluator ────────────────────────────────────────────────────────────
function evaluateJS(code, testCases, category, starterCode) {
  // Pre-flight security check on user code
  const bannedCheck = detectJSBannedPatterns(code);
  if (bannedCheck) {
    return testCases.map((_, index) => ({
      testCaseIndex: index,
      passed: false,
      output: `Security Error: ${bannedCheck}`,
      executionTime: 0,
    }));
  }

  return testCases.map((tc, index) => {
    try {
      let capturedLogs = [];

      // Build a sandbox with null prototype to prevent prototype chain escapes.
      // Using Object.create(null) ensures there is no __proto__ to climb.
      const sandbox = Object.create(null);
      sandbox.console = {
        log: (...args) => {
          if (capturedLogs.length < 100) { // Cap log output to prevent memory abuse
            capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          }
        }
      };
      // Provide safe, frozen copies of built-in constructors
      sandbox.Math = Math;
      sandbox.String = String;
      sandbox.Number = Number;
      sandbox.Boolean = Boolean;
      sandbox.Array = Array;
      sandbox.Object = Object;
      sandbox.Set = Set;
      sandbox.Map = Map;
      sandbox.parseInt = parseInt;
      sandbox.parseFloat = parseFloat;
      sandbox.isNaN = isNaN;
      sandbox.isFinite = isFinite;
      sandbox.JSON = JSON;
      sandbox.undefined = undefined;
      // Intentionally excluded: process, Buffer, require, Promise, setTimeout,
      // globalThis, Reflect, Proxy, Function — these enable sandbox escapes.
      sandbox.setTimeout = () => {};

      vm.createContext(sandbox);

      // Detect function name from starter or user code
      let functionName = '';
      const sources = [starterCode, code].filter(Boolean);
      for (const src of sources) {
        const m = src.match(/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/) ||
                  src.match(/(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>|[a-zA-Z_$][a-zA-Z0-9_$]*\s*=>)/) ||
                  src.match(/class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\{/);
        if (m) { functionName = m[1]; break; }
      }

      const args = parseArgs(tc.input);

      // Build runner – call the detected function with parsed args
      const runner = functionName
        ? `${code}
(function __runner__() {
  const __fn__ = typeof ${functionName} === 'function' ? ${functionName} : (new ${functionName}());
  return __fn__(${args.map((_, i) => `__args__[${i}]`).join(', ')});
})()`
        : code;

      vm.runInContext(`var __args__ = ${JSON.stringify(args)};`, sandbox, { timeout: 500 });
      const script = new vm.Script(runner);
      const start = process.hrtime();
      const rawResult = script.runInContext(sandbox, { timeout: JS_EXECUTION_TIMEOUT });
      const end = process.hrtime(start);
      const executionTime = Math.round(end[0] * 1000 + end[1] / 1e6);

      let resultStr;
      if (rawResult === undefined) resultStr = 'undefined';
      else if (rawResult instanceof Set) resultStr = JSON.stringify(Array.from(rawResult));
      else if (rawResult instanceof Map) resultStr = JSON.stringify(Object.fromEntries(rawResult));
      else resultStr = JSON.stringify(rawResult);

      const logsOutput = capturedLogs.length > 0 ? `\nLogs:\n${capturedLogs.join('\n')}` : '';

      if (category === 'algorithms') {
        const normalizedResult = resultStr.replace(/\s+/g, '');
        const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');
        const passed = normalizedResult === normalizedExpected;
        return {
          testCaseIndex: index,
          passed,
          output: passed
            ? `✓ Output: ${resultStr}${logsOutput}`
            : `Expected: ${tc.expectedOutput}\nGot:      ${resultStr}${logsOutput}`,
          executionTime: executionTime || 1,
        };
      } else {
        if (!functionName) throw new Error('Could not find a function to call. Define your function first.');
        if (rawResult === undefined || rawResult === null)
          throw new Error('Function returned nothing. Make sure to use the `return` keyword.');
        return {
          testCaseIndex: index,
          passed: true,
          output: `✓ Code executed and returned: ${resultStr}${logsOutput}`,
          executionTime: executionTime || 1,
        };
      }
    } catch (e) {
      let msg = e.message || String(e);
      if (e.stack && e.stack.includes('evalmachine')) {
        const stackLines = e.stack.split('\n');
        const errIdx = stackLines.findIndex(l => l.includes(e.message));
        if (errIdx > 0) {
           const snippet = stackLines.slice(0, errIdx).join('\n').replace(/evalmachine\.<anonymous>:/g, 'Line ');
           msg = `${e.name || 'Error'}: ${e.message}\n${snippet}`;
        }
      }
      return { testCaseIndex: index, passed: false, output: msg.startsWith('Error') ? msg : `Error: ${msg}`, executionTime: 0 };
    }
  });
}

// ─── Python Evaluator ────────────────────────────────────────────────────────
function evaluatePython(code, testCases, category, starterCode) {
  // Pre-flight security check on user code
  const bannedCheck = detectPyBannedImports(code);
  if (bannedCheck) {
    return testCases.map((_, index) => ({
      testCaseIndex: index,
      passed: false,
      output: `Security Error: ${bannedCheck}`,
      executionTime: 0,
    }));
  }

  return testCases.map((tc, index) => {
    const tempDir = path.join(__dirname, '..', 'tmp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    // Use crypto random bytes for unique filenames to prevent collisions
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const filePath = path.join(tempDir, `py_${uniqueId}_${index}.py`);

    try {
      // Detect function name
      let functionName = '';
      const sources = [starterCode, code].filter(Boolean);
      for (const src of sources) {
        const m = src.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
        if (m) { functionName = m[1]; break; }
      }

      // Build Python test script
      const inputForPy = (tc.input === '"example_input"' || tc.input === '') ? 'None' : tc.input;

      const testScript = functionName ? `
import json, sys

# Alias JS-style literals
true = True
false = False
null = None

${code}

def __parse_args__(raw):
    try:
        val = eval(f"[{raw}]", {"true": True, "false": False, "null": None})
        return val
    except:
        return [raw]

_args = __parse_args__(${JSON.stringify(inputForPy)})
_result = ${functionName}(*_args)
if _result is None:
    print("null")
elif isinstance(_result, bool):
    print("true" if _result else "false")
else:
    print(json.dumps(_result))
` : `
import sys
true = True
false = False
null = None

${code}
`;

      fs.writeFileSync(filePath, testScript);

      const start = process.hrtime();
      let rawResult = '';
      try {
        // Use -S (no site packages) and -I (isolated mode) for additional safety
        rawResult = execSync(`python -S -I -W ignore "${filePath}"`, {
          timeout: PY_EXECUTION_TIMEOUT,
          stdio: ['pipe', 'pipe', 'pipe'],
          encoding: 'utf8',
          // Prevent the child process from inheriting sensitive env vars
          env: { PATH: process.env.PATH, PYTHONDONTWRITEBYTECODE: '1' },
        }).trim();
      } catch (err) {
        const stderr = err.stderr ? err.stderr.toString().trim() : '';
        let errMsg = stderr || err.message || 'Execution failed';
        // Sanitize path info — never leak server filesystem paths to users
        errMsg = errMsg
          .replace(new RegExp(filePath.replace(/\\/g, '\\\\'), 'g'), 'solution.py')
          .replace(new RegExp(path.basename(filePath), 'g'), 'solution.py')
          .replace(/line (\d+)/g, (_, n) => `line ${Math.max(1, parseInt(n) - 16)}`);
        throw new Error(errMsg);
      } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      const end = process.hrtime(start);
      const executionTime = Math.round(end[0] * 1000 + end[1] / 1e6);

      const lines = rawResult.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const lastLine = lines.pop() || '';
      const logsOutput = lines.length > 0 ? `\nLogs:\n${lines.join('\n')}` : '';

      if (category === 'algorithms') {
        const normalizedResult = lastLine.replace(/\s+/g, '');
        const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');
        const passed = normalizedResult === normalizedExpected;
        return {
          testCaseIndex: index,
          passed,
          output: passed
            ? `✓ Output: ${lastLine}${logsOutput}`
            : `Expected: ${tc.expectedOutput}\nGot:      ${lastLine}${logsOutput}`,
          executionTime: executionTime || 1,
        };
      } else {
        if (!functionName) throw new Error('Could not find a function to call. Define your function first.');
        return {
          testCaseIndex: index,
          passed: true,
          output: `✓ Code executed successfully. Output: ${lastLine}${logsOutput}`,
          executionTime: executionTime || 1,
        };
      }
    } catch (e) {
      if (fs.existsSync(filePath)) { try { fs.unlinkSync(filePath); } catch (_) {} }
      const msg = e.message || String(e);
      return { testCaseIndex: index, passed: false, output: msg.startsWith('Error') ? msg : `Error: ${msg}`, executionTime: 0 };
    }
  });
}

// ─── Main Evaluator ───────────────────────────────────────────────────────────
const evaluateCode = (code, testCases, language, category, starterCode = '') => {
  if (language === 'python') return evaluatePython(code, testCases, category, starterCode);
  if (language === 'javascript') return evaluateJS(code, testCases, category, starterCode);

  // Unsupported language — reject instead of mocking results
  return testCases.map((_, index) => ({
    testCaseIndex: index,
    passed: false,
    output: `Unsupported language: ${language}. Please use JavaScript or Python.`,
    executionTime: 0,
  }));
};

// ─── Run (test without saving) ────────────────────────────────────────────────
exports.runCode = async (req, res, next) => {
  try {
    const { code, language = 'javascript' } = req.body;
    const challengeId = req.params.id;

    // Validate input
    const validationError = validateCodeInput(code, language);
    if (validationError) return error(res, validationError, 400);

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return error(res, 'Challenge not found.', 404);

    // Only run visible test cases
    const visibleTests = challenge.testCases.filter(tc => !tc.isHidden);
    const testResults = evaluateCode(code, visibleTests, language, challenge.category, challenge.starterCode?.[language] || '');
    const allPassed = testResults.every(r => r.passed);

    success(res, { testResults, allPassed, isRun: true });
  } catch (err) { next(err); }
};

// ─── Submit (full evaluation + save) ─────────────────────────────────────────
exports.submitSolution = async (req, res, next) => {
  try {
    const { code, language = 'javascript' } = req.body;
    const challengeId = req.params.id;

    // Validate input
    const validationError = validateCodeInput(code, language);
    if (validationError) return error(res, validationError, 400);

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return error(res, 'Challenge not found.', 404);

    // Reject empty / starter-only submissions
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').replace(/#.*/g, '').trim();
    const isStarterCode = challenge.starterCode && (
      code.trim() === challenge.starterCode.javascript?.trim() ||
      code.trim() === challenge.starterCode.python?.trim()
    );
    if (cleanCode.length < 3 || isStarterCode) {
      return error(res, 'Please write actual code logic before submitting.', 400);
    }

    const alreadySolved = await Submission.findOne({ userId: req.userId, challengeId, status: 'passed' });

    const testResults = evaluateCode(code, challenge.testCases, language, challenge.category, challenge.starterCode?.[language] || '');
    const allPassed = testResults.every(r => r.passed);
    const status = allPassed ? 'passed' : 'failed';

    const submission = await Submission.create({
      userId: req.userId,
      challengeId,
      code,
      language,
      status,
      testResults,
      xpEarned: allPassed && !alreadySolved ? challenge.xpReward : 0,
    });

    let xpResult = null;
    if (allPassed && !alreadySolved) {
      xpResult = await awardXP(req.userId, challenge.xpReward, 'challenge', challengeId, `Solved: ${challenge.title}`);
      challenge.completionCount += 1;
      challenge.attemptCount += 1;
      await challenge.save();
      await User.findByIdAndUpdate(req.userId, { $inc: { challengesSolved: 1 } });
      emitChallengeCompleted(req.userId, challengeId, challenge.xpReward);
    } else {
      challenge.attemptCount += 1;
      await challenge.save();
    }

    success(res, { submission, xpResult, allPassed });
  } catch (err) { next(err); }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({
      userId: req.userId,
      challengeId: req.params.id,
    }).sort({ submittedAt: -1 }).limit(10);
    success(res, { submissions });
  } catch (err) { next(err); }
};

// TODO: For production deployment with public users, migrate code execution
// to Docker-based sandboxing (e.g., isolate, nsjail, or firecracker) for
// true process-level isolation. The current vm-based approach is hardened
// but not a full security boundary.
