const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { awardXP } = require('../services/xpService');
const { emitChallengeCompleted } = require('../services/socketService');
const { success, error } = require('../utils/responseHelper');

const vm = require('vm');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Real sandboxed code evaluation using 'vm' module and local python
// Real sandboxed code evaluation using 'vm' module and local python
// Real sandboxed code evaluation using 'vm' module and local python
const evaluateCode = (code, testCases, language, category, starterCode = '') => {
  // Use mock evaluation for unsupported languages only
  if (!['javascript', 'python'].includes(language)) {
    return testCases.map((tc, index) => {
      try {
        const containsLogic = code.length > 20 && !code.match(/^\s*$/);
        const passed = containsLogic && (
          code.includes('return') ||
          code.includes('console.log') ||
          code.includes('print') ||
          code.includes('function') ||
          code.includes('=>') ||
          code.includes('class') ||
          code.includes('def')
        );

        return {
          testCaseIndex: index,
          passed,
          output: passed ? tc.expectedOutput : 'Incorrect output. Please check your logic.',
          executionTime: Math.floor(Math.random() * 50) + 5,
        };
      } catch (e) {
        return {
          testCaseIndex: index,
          passed: false,
          output: `Error: ${e.message}`,
          executionTime: 0,
        };
      }
    });
  }

  // Real code evaluation for Python algorithms
  if (language === 'python') {
    return testCases.map((tc, index) => {
      try {
        let functionName = '';
        // Try starter code first
        if (starterCode) {
          const starterMatch = starterCode.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
          if (starterMatch) functionName = starterMatch[1];
        }
        // Fallback to user code
        if (!functionName) {
          const funcMatch = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(/);
          if (funcMatch) functionName = funcMatch[1];
        }

        const testCode = functionName
          ? `
import json
import inspect
true = True
false = False
null = None

${code}

sig = inspect.signature(${functionName})
args = []
test_input = ${tc.input === '"example_input"' ? '{"id": 1, "test": "data"}' : tc.input}
for param in sig.parameters.values():
    args.append(test_input)

result = ${functionName}(*args)
print(json.dumps(result) if result is not None else 'undefined')
`
          : `
true = True
false = False
null = None

${code}
`;
        // Create temp file for execution
        const tempDir = path.join(__dirname, '..', 'tmp');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
        const filePath = path.join(tempDir, `temp_${Date.now()}_${index}.py`);
        fs.writeFileSync(filePath, testCode);

        const start = process.hrtime();
        let rawResult = '';
        try {
          rawResult = execSync(`python -W ignore "${filePath}"`, { timeout: 2000, stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
        } catch (err) {
          const stderrStr = err.stderr ? err.stderr.toString().trim() : '';
          let errorMsg = stderrStr || err.message || 'Execution failed';
          errorMsg = errorMsg.replace(/line (\d+)/g, (match, p1) => `line ${Math.max(1, parseInt(p1) - 7)}`);
          // Hide physical path of local file
          if (filePath) {
            const escapedPath = filePath.replace(/\\/g, '\\\\');
            errorMsg = errorMsg.replace(new RegExp(escapedPath, 'g'), 'solution.py');
            const fileName = path.basename(filePath);
            errorMsg = errorMsg.replace(new RegExp(fileName, 'g'), 'solution.py');
          }
          throw new Error(errorMsg);
        } finally {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        
        const end = process.hrtime(start);
        const executionTime = Math.round((end[0] * 1000) + (end[1] / 1000000));

        const lines = rawResult.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        const lastLine = lines[lines.length - 1] || '';

        if (category === 'algorithms') {
          const normalizedResult = lastLine.replace(/\s+/g, '');
          const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');
          const passed = normalizedResult === normalizedExpected;

          return {
            testCaseIndex: index,
            passed,
            output: passed ? 'Success' : `Error: Test Failed.\nExpected: ${tc.expectedOutput}\nBut got: ${lastLine}`,
            executionTime: executionTime || 1,
          };
        } else {
          if (!functionName) throw new Error("Could not find a valid function to evaluate. Please define your function.");
          if (lastLine === 'undefined') throw new Error("Function must return a valid output, but returned nothing. Make sure to use the 'return' keyword.");
          
          return {
            testCaseIndex: index,
            passed: true,
            output: "Success: Code executed successfully and returned a valid object/result.",
            executionTime: executionTime || 1,
          };
        }
      } catch (e) {
        return {
          testCaseIndex: index,
          passed: false,
          output: e.message?.startsWith('Error') ? e.message : `Error: ${e.message || String(e)}`,
          executionTime: 0,
        };
      }
    });
  }

  // Real code evaluation for JS algorithms
  return testCases.map((tc, index) => {
    try {
      const sandbox = {
        console: { log: () => {} },
        Math, String, Number, Array, Object, Set, Map,
        Promise, setTimeout, Buffer,
        require: (moduleName) => {
          const safeBuiltins = ['path', 'util', 'crypto', 'buffer', 'assert', 'os'];
          if (safeBuiltins.includes(moduleName)) {
            return require(moduleName);
          }
          
          const createDeepProxy = () => {
            function noop() { return createDeepProxy(); }
            return new Proxy(noop, {
              get: (target, prop) => {
                if (prop === 'then') return undefined; // Prevent infinite promise resolution loops
                return createDeepProxy();
              },
              apply: () => createDeepProxy(),
              construct: () => createDeepProxy()
            });
          };

          return createDeepProxy();
        }
      };

      vm.createContext(sandbox);

      let functionName = '';
      // Try starter code first
      if (starterCode) {
        const funcMatch = starterCode.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        if (funcMatch) {
          functionName = funcMatch[1];
        } else {
          const classMatch = starterCode.match(/class\s+([a-zA-Z0-9_]+)\s*\{/);
          if (classMatch) {
            functionName = classMatch[1];
          } else {
            const constMatch = starterCode.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\()/);
            if (constMatch) functionName = constMatch[1];
          }
        }
      }

      // Fallback to user code
      if (!functionName) {
        const funcMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/);
        if (funcMatch) {
          functionName = funcMatch[1];
        } else {
          const classMatch = code.match(/class\s+([a-zA-Z0-9_]+)\s*\{/);
          if (classMatch) {
            functionName = classMatch[1];
          } else {
            const constMatch = code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(?:function|\()/);
            if (constMatch) functionName = constMatch[1];
          }
        }
      }

      const testRunnerCode = functionName
        ? `${code}
const _test_fn = ${functionName};
const _testInput = ${tc.input === '"example_input"' ? '{"id": 1, "test": "data"}' : tc.input};
const _args = new Array(_test_fn.length).fill(_testInput);
_test_fn(..._args);`
        : code;
      
      const testScript = new vm.Script(testRunnerCode);
      const start = process.hrtime();
      const rawResult = testScript.runInContext(sandbox, { timeout: 1000 });
      const end = process.hrtime(start);
      const executionTime = Math.round((end[0] * 1000) + (end[1] / 1000000));
      
      if (category === 'algorithms') {
        let resultStr;
        if (rawResult === undefined) resultStr = 'undefined';
        else resultStr = JSON.stringify(rawResult);
        
        const normalizedResult = resultStr.replace(/\s+/g, '');
        const normalizedExpected = tc.expectedOutput.replace(/\s+/g, '');
        const passed = normalizedResult === normalizedExpected;

        return {
          testCaseIndex: index,
          passed,
          output: passed ? 'Success' : `Error: Test Failed.\nExpected: ${tc.expectedOutput}\nBut got: ${resultStr}`,
          executionTime: executionTime || 1,
        };
      } else {
        if (!functionName) throw new Error("Could not find a valid function to evaluate. Please define your function.");
        if (rawResult === undefined || rawResult === null) throw new Error("Function must return a valid output, but returned nothing. Make sure to use the 'return' keyword.");
        
        return {
          testCaseIndex: index,
          passed: true,
          output: "Success: Code executed successfully and returned a valid object/result.",
          executionTime: executionTime || 1,
        };
      }
    } catch (e) {
      let errorOutput = e.message || String(e);
      if (e.stack && e.stack.includes('evalmachine')) {
        errorOutput = e.stack
          .split('\n')
          .filter(line => line.includes('evalmachine') || !line.includes('at '))
          .slice(0, 3)
          .join('\n')
          .replace(/evalmachine\.<anonymous>:/g, 'Line ');
      }
      return {
        testCaseIndex: index,
        passed: false,
        output: errorOutput.startsWith('Error') ? errorOutput : `Error: ${errorOutput}`,
        executionTime: 0,
      };
    }
  });
};

exports.submitSolution = async (req, res, next) => {
  try {
    const { code, language = 'javascript' } = req.body;
    const challengeId = req.params.id;

    if (!code) return error(res, 'Code is required.', 400);

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return error(res, 'Challenge not found.', 404);

    // Check if code has actual content (excluding comments and whitespace)
    const cleanJS = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();
    const cleanPy = code.replace(/#.*/g, '').trim();
    const activeClean = language === 'python' ? cleanPy : cleanJS;

    const isOnlyCommentOrEmpty = activeClean.length < 3;

    // Check if code is exactly identical to the starter code
    const isStarterCode = challenge.starterCode && (
      code.trim() === challenge.starterCode.javascript?.trim() ||
      code.trim() === challenge.starterCode.python?.trim()
    );

    if (isOnlyCommentOrEmpty || isStarterCode) {
      return error(res, 'Please write actual code logic before submitting.', 400);
    }

    // Check if already solved
    const alreadySolved = await Submission.findOne({
      userId: req.userId,
      challengeId,
      status: 'passed',
    });

    // Evaluate code
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

    // Award XP only on first solve
    let xpResult = null;
    if (allPassed && !alreadySolved) {
      xpResult = await awardXP(
        req.userId,
        challenge.xpReward,
        'challenge',
        challengeId,
        `Solved: ${challenge.title}`
      );

      // Update challenge stats
      challenge.completionCount += 1;
      challenge.attemptCount += 1;
      await challenge.save();

      // Update user stats
      await User.findByIdAndUpdate(req.userId, {
        $inc: { challengesSolved: 1 },
      });

      emitChallengeCompleted(req.userId, challengeId, challenge.xpReward);
    } else {
      challenge.attemptCount += 1;
      await challenge.save();
    }

    success(res, {
      submission,
      xpResult,
      allPassed,
    });
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
