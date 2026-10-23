/**
 * ══════════════════════════════════════════════════════════════════════════════
 * CodeRunner: Multi-language Asynchronous Execution Engine & Sandboxing Interface
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * ⚠️  CRITICAL SECURITY ARCHITECTURE NOTE:
 * In-process or host-level execution (even with child processes, ulimit, and AST/regex
 * pattern analysis) is NOT a complete security boundary against sophisticated sandbox
 * escapes or local denial-of-service.
 *
 * FOR PRODUCTION DEPLOYMENTS:
 * An isolated microservice execution environment (such as Judge0, Piston, or AWS Lambda
 * with network isolation, gVisor / Firecracker microVMs, and seccomp filters) is REQUIRED.
 *
 * Set the RUNNER_URL environment variable in production (e.g. RUNNER_URL=https://judge0.internal)
 * to automatically route all code execution through the RemoteCodeRunner adapter.
 * ══════════════════════════════════════════════════════════════════════════════
 */

const { spawn } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { parse: parseHTML } = require('node-html-parser');

// Concurrency Cap & Queue for Worker Execution
class ConcurrencyQueue {
  constructor(maxConcurrent = 4, maxQueue = 20) {
    this.maxConcurrent = maxConcurrent;
    this.maxQueue = maxQueue;
    this.running = 0;
    this.queue = [];
  }

  async acquire() {
    const maxConcurrent = process.env.CODE_EXECUTION_MAX_CONCURRENT
      ? parseInt(process.env.CODE_EXECUTION_MAX_CONCURRENT, 10)
      : this.maxConcurrent;
    const maxQueue = process.env.CODE_EXECUTION_MAX_QUEUE
      ? parseInt(process.env.CODE_EXECUTION_MAX_QUEUE, 10)
      : this.maxQueue;

    if (this.running < maxConcurrent) {
      this.running++;
      return () => this.release();
    }

    if (this.queue.length >= maxQueue) {
      const err = new Error('Execution concurrency limit reached. Server is busy, please retry shortly.');
      err.status = 503;
      err.statusCode = 503;
      throw err;
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject });
    });
  }

  release() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next.resolve(() => this.release());
    } else {
      this.running = Math.max(0, this.running - 1);
    }
  }

  reset() {
    this.running = 0;
    this.queue = [];
  }
}

const executionQueue = new ConcurrencyQueue(
  parseInt(process.env.CODE_EXECUTION_MAX_CONCURRENT || '4', 10),
  parseInt(process.env.CODE_EXECUTION_MAX_QUEUE || '20', 10)
);

// ─── Static Security Validators ───────────────────────────────────────────────
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

const PY_BANNED_IMPORTS = [
  'os', 'subprocess', 'shutil', 'socket', 'http', 'urllib',
  'requests', 'ctypes', 'signal', 'multiprocessing', 'threading',
  'importlib', 'builtins', '__builtin__', 'code', 'codeop',
  'compile', 'compileall', 'py_compile', 'runpy', 'pkgutil',
  'pty', 'tty', 'termios', 'fcntl', 'mmap', 'gc', 'inspect',
  'ast', 'dis', 'tokenize', 'traceback', 'warnings', 'zipimport',
];

const PY_ENCODING_BYPASS_PATTERNS = [
  /\\x[0-9a-fA-F]{2}/,
  /\\u[0-9a-fA-F]{4}/,
  /bytes\s*\(\s*\[/,
  /__import__/,
  /importlib/,
  /\.load_module/,
  /\.find_module/,
  /\.exec_module/,
];

function detectJSBannedPatterns(code) {
  if (!code || typeof code !== 'string') return null;
  for (const pattern of JS_BANNED_PATTERNS) {
    if (pattern.test(code)) {
      return 'Code contains disallowed patterns. Please use only standard language features.';
    }
  }
  return null;
}

function detectPyBannedImports(code) {
  if (!code || typeof code !== 'string') return null;
  for (const pattern of PY_ENCODING_BYPASS_PATTERNS) {
    if (pattern.test(code)) {
      return 'Code contains disallowed patterns. Please use only standard language features.';
    }
  }

  for (const mod of PY_BANNED_IMPORTS) {
    const patterns = [
      new RegExp(`\\bimport\\s+${mod}\\b`),
      new RegExp(`\\bfrom\\s+${mod}\\b`),
    ];
    for (const p of patterns) {
      if (p.test(code)) {
        return `Import of '${mod}' is not allowed for security reasons.`;
      }
    }
  }

  if (/\bopen\s*\(/.test(code)) return 'File I/O (open) is not allowed.';
  if (/\bexec\s*\(/.test(code)) return 'Dynamic code execution (exec) is not allowed.';
  if (/\beval\s*\(/.test(code)) return 'Dynamic code evaluation (eval) is not allowed.';
  if (/\bcompile\s*\(/.test(code)) return 'Dynamic code compilation (compile) is not allowed.';
  if (/\bglobals\s*\(/.test(code)) return 'Reflection (globals) is not allowed.';
  if (/\blocals\s*\(/.test(code)) return 'Reflection (locals) is not allowed.';
  if (/\bsetattr\s*\(/.test(code)) return 'Reflection (setattr) is not allowed.';
  if (/\bdelattr\s*\(/.test(code)) return 'Reflection (delattr) is not allowed.';

  return null;
}

// ─── Remote Code Runner (Judge0 / Piston Adapter Stub) ─────────────────────────
const { z } = require('zod');

const RemoteResultItemSchema = z.object({
  passed: z.boolean(),
  executionTime: z.number().optional(),
  testCaseIndex: z.number().optional(),
  input: z.any().optional(),
  expectedOutput: z.any().optional(),
  actualOutput: z.any().optional(),
  output: z.any().optional(),
  error: z.any().optional(),
}).passthrough();

const RemoteResponseSchema = z.object({
  results: z.array(RemoteResultItemSchema),
});

class RemoteCodeRunner {
  constructor(runnerUrl) {
    this.runnerUrl = runnerUrl.replace(/\/+$/, '');
  }

  async run(code, language, testCases, options = {}) {
    // Adapter stub for isolated production sandbox (Judge0 / Piston)
    // Production deployments set RUNNER_URL to invoke an isolated runner cluster.
    const payload = {
      code,
      language,
      testCases: testCases.map((tc, idx) => ({
        index: idx,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: Boolean(tc.isHidden),
      })),
      timeout: options.timeout || 5000,
    };

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.RUNNER_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.RUNNER_API_KEY}`;
    }

    const runnerTimeoutMs = parseInt(process.env.RUNNER_TIMEOUT_MS || '10000', 10);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), runnerTimeoutMs);

    let response;
    try {
      response = await fetch(`${this.runnerUrl}/api/v1/execute`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ABORT_ERR') {
        const timeoutErr = new Error(`Remote runner request timed out after ${runnerTimeoutMs}ms`);
        timeoutErr.status = 504;
        timeoutErr.statusCode = 504;
        throw timeoutErr;
      }
      const netErr = new Error(`Remote runner network failure: ${err.message}`);
      netErr.status = 502;
      netErr.statusCode = 502;
      throw netErr;
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      const err = new Error(`Remote runner responded with status ${response.status}`);
      err.status = response.status >= 500 ? 502 : response.status;
      err.statusCode = err.status;
      throw err;
    }

    let data;
    try {
      data = await response.json();
    } catch (_) {
      const err = new Error('Remote runner returned malformed JSON');
      err.status = 502;
      err.statusCode = 502;
      throw err;
    }

    let parsed;
    try {
      parsed = RemoteResponseSchema.parse(data);
    } catch (validationErr) {
      const err = new Error(`Remote runner response failed schema validation: ${validationErr.message}`);
      err.status = 502;
      err.statusCode = 502;
      throw err;
    }

    if (parsed.results.length !== testCases.length) {
      const err = new Error(
        `Remote runner returned ${parsed.results.length} results, expected ${testCases.length}`
      );
      err.status = 502;
      err.statusCode = 502;
      throw err;
    }

    const truncate = (val) => {
      if (typeof val === 'string' && val.length > 5000) {
        return val.slice(0, 5000);
      }
      return val;
    };

    // Build whitelisted test case results and ensure hidden tests are strictly masked
    return parsed.results.map((r, idx) => {
      const tc = testCases[idx] || {};
      const passed = Boolean(r.passed);
      const executionTime = typeof r.executionTime === 'number' ? r.executionTime : 1;

      if (tc.isHidden) {
        return {
          testCaseIndex: idx,
          passed,
          isHidden: true,
          input: '[Hidden]',
          expectedOutput: '[Hidden]',
          actualOutput: '[Hidden]',
          output: passed ? '✓ Passed (Hidden Test Case)' : '✗ Failed (Hidden Test Case)',
          executionTime,
        };
      }

      const res = {
        testCaseIndex: idx,
        passed,
        isHidden: false,
        input: truncate(r.input !== undefined ? String(r.input) : (tc.input || '')),
        expectedOutput: truncate(r.expectedOutput !== undefined ? String(r.expectedOutput) : (tc.expectedOutput || '')),
        actualOutput: truncate(r.actualOutput !== undefined ? String(r.actualOutput) : (passed ? (tc.expectedOutput || '') : 'Mismatch')),
        output: truncate(r.output !== undefined ? String(r.output) : (passed ? `✓ Output: ${r.actualOutput || ''}` : 'Failed')),
        executionTime,
      };

      if (r.error !== undefined) {
        res.error = truncate(String(r.error));
      }

      return res;
    });
  }
}

let cachedPythonBin = null;
function getPythonBinary() {
  if (cachedPythonBin) return cachedPythonBin;
  const { execSync } = require('child_process');
  for (const bin of ['python3', 'python']) {
    try {
      execSync(`${bin} --version`, { stdio: 'ignore' });
      cachedPythonBin = bin;
      return bin;
    } catch (_) {}
  }
  cachedPythonBin = 'python';
  return cachedPythonBin;
}

// ─── Local Spawn Code Runner ───────────────────────────────────────────────────
class LocalSpawnCodeRunner {
  async run(code, language, testCases, options = {}) {
    if (language === 'javascript') {
      const banned = detectJSBannedPatterns(code);
      if (banned) {
        return testCases.map((tc, index) => ({
          testCaseIndex: index,
          passed: false,
          isHidden: Boolean(tc.isHidden),
          input: tc.isHidden ? '[Hidden]' : tc.input,
          expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
          actualOutput: '[Hidden]',
          output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : `Security Error: ${banned}`,
          error: tc.isHidden ? undefined : `Security Error: ${banned}`,
          executionTime: 0,
        }));
      }
    }
    if (language === 'python') {
      const banned = detectPyBannedImports(code);
      if (banned) {
        return testCases.map((tc, index) => ({
          testCaseIndex: index,
          passed: false,
          isHidden: Boolean(tc.isHidden),
          input: tc.isHidden ? '[Hidden]' : tc.input,
          expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
          actualOutput: '[Hidden]',
          output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : `Security Error: ${banned}`,
          error: tc.isHidden ? undefined : `Security Error: ${banned}`,
          executionTime: 0,
        }));
      }
    }

    const release = await executionQueue.acquire();
    try {
      if (language === 'javascript') {
        return await this.runJavaScript(code, testCases, options);
      }
      if (language === 'python') {
        return await this.runPython(code, testCases, options);
      }
      if (language === 'html') {
        return this.runHTML(code, testCases);
      }
      return testCases.map((_, index) => ({
        testCaseIndex: index,
        passed: false,
        output: `Unsupported language: ${language}.`,
        executionTime: 0,
      }));
    } finally {
      release();
    }
  }

  runHTML(code, testCases) {
    if (!code || typeof code !== 'string') {
      return testCases.map((tc, index) => {
        if (tc.isHidden) {
          return {
            testCaseIndex: index,
            passed: false,
            isHidden: true,
            input: '[Hidden]',
            expectedOutput: '[Hidden]',
            actualOutput: '[Hidden]',
            output: '✗ Failed (Hidden Test Case)',
            executionTime: 0,
          };
        }
        return {
          testCaseIndex: index,
          passed: false,
          isHidden: false,
          input: tc.input || '',
          expectedOutput: tc.expectedOutput || '',
          actualOutput: 'Empty submission',
          output: '❌ HTML submission is empty',
          executionTime: 0,
        };
      });
    }

    let root;
    let parseError = null;
    try {
      root = parseHTML(code, {
        lowerCaseTagName: false,
        comment: false,
        blockTextElements: {
          script: true,
          noscript: true,
          style: true,
          pre: true,
        },
      });
    } catch (err) {
      parseError = err;
    }

    return testCases.map((tc, index) => {
      const startTime = Date.now();
      let passed = false;
      let actualOutput = 'Structure mismatch';

      if (parseError) {
        passed = false;
        actualOutput = 'HTML Parse Error';
      } else {
        const cleanExpected = (tc.expectedOutput != null ? String(tc.expectedOutput) : '').trim();
        const inputSelector = (tc.input != null ? String(tc.input) : '').trim();

        // Check if expected is boolean-like pass
        if (['true', 'passed', 'pass'].includes(cleanExpected.toLowerCase())) {
          // Verify DOM contains real elements and not just empty whitespace/comments
          const elementNodes = root.querySelectorAll('*');
          passed = elementNodes.length > 0;
          if (passed) {
            actualOutput = cleanExpected;
          }
        } else if (cleanExpected.length > 0) {
          // Split multi-part expected criteria (e.g. "form, input[type='email'], button")
          const expectedParts = cleanExpected.split(/[,;|]+/).map((p) => p.trim()).filter(Boolean);

          if (expectedParts.length > 1) {
            passed = expectedParts.every((part) => {
              try {
                return root.querySelector(part) !== null;
              } catch (e) {
                return root.text.toLowerCase().includes(part.toLowerCase());
              }
            });
            if (passed) actualOutput = cleanExpected;
          } else {
            // Single part expected
            try {
              const matchedEl = root.querySelector(cleanExpected);
              if (matchedEl) {
                passed = true;
                actualOutput = cleanExpected;
              } else {
                // Check if input was a selector and expectedOutput is expected text content or attribute
                if (inputSelector) {
                  try {
                    const target = root.querySelector(inputSelector);
                    if (target) {
                      const text = target.text.trim();
                      if (text.toLowerCase() === cleanExpected.toLowerCase() || text.toLowerCase().includes(cleanExpected.toLowerCase())) {
                        passed = true;
                        actualOutput = text;
                      }
                    }
                  } catch (e) { /* ignore */ }
                }

                if (!passed) {
                  passed = root.text.toLowerCase().includes(cleanExpected.toLowerCase());
                  if (passed) actualOutput = cleanExpected;
                }
              }
            } catch (selErr) {
              passed = root.text.toLowerCase().includes(cleanExpected.toLowerCase());
              if (passed) actualOutput = cleanExpected;
            }
          }
        } else {
          // No specific expectedOutput; check that document has at least one element node
          const elementNodes = root.querySelectorAll('*');
          passed = elementNodes.length > 0;
          if (passed) actualOutput = 'Valid DOM';
        }
      }

      const executionTime = Date.now() - startTime;
      if (tc.isHidden) {
        return {
          testCaseIndex: index,
          passed,
          isHidden: true,
          input: '[Hidden]',
          expectedOutput: '[Hidden]',
          actualOutput: '[Hidden]',
          output: passed ? '✓ Passed (Hidden Test Case)' : '✗ Failed (Hidden Test Case)',
          executionTime,
        };
      }

      return {
        testCaseIndex: index,
        passed,
        isHidden: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: passed ? tc.expectedOutput : actualOutput,
        output: passed
          ? '✅ HTML structure and attributes match expected criteria'
          : `❌ HTML does not match expected structure (${actualOutput})`,
        executionTime,
      };
    });
  }

  async runJavaScript(code, testCases, options = {}) {
    const starterCode = options.starterCode || '';
    const tempDir = os.tmpdir();
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const runnerPath = path.join(tempDir, `devarena_js_${uniqueId}.js`);

    const runnerScript = `
const vm = require('vm');

const code = ${JSON.stringify(code)};
const testCases = ${JSON.stringify(testCases)};
const starterCode = ${JSON.stringify(starterCode)};

function parseArgs(inputStr) {
  if (!inputStr || inputStr.trim() === '""' || inputStr.trim() === "''") return [];
  const wrapped = '[' + inputStr + ']';
  try {
    return JSON.parse(wrapped);
  } catch (_) {
    try {
      const sb = Object.create(null);
      sb.Math = Math; sb.String = String; sb.Number = Number; sb.Array = Array; sb.Object = Object;
      vm.createContext(sb);
      return vm.runInContext('(function(){ return [' + inputStr + ']; })()', sb, { timeout: 300 });
    } catch (_2) {
      return [inputStr];
    }
  }
}

// Function name detection
let functionName = '';
const sources = [starterCode, code].filter(Boolean);
for (const src of sources) {
  const m = src.match(/function\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\(/) ||
            src.match(/(?:const|let|var)\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*=\\s*(?:async\\s+)?(?:function|\\([^)]*\\)\\s*=>|[a-zA-Z_$][a-zA-Z0-9_$]*\\s*=>)/) ||
            src.match(/class\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\{/);
  if (m) { functionName = m[1]; break; }
}

const results = testCases.map((tc, index) => {
  try {
    let capturedLogs = [];
    const sandbox = Object.create(null);
    sandbox.console = {
      log: (...args) => {
        if (capturedLogs.length < 100) {
          capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        }
      }
    };
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
    sandbox.setTimeout = () => {};

    vm.createContext(sandbox);

    const args = parseArgs(tc.input);
    const runner = functionName
      ? code + '\\n(function __runner__() {\\n' +
        '  const __fn__ = typeof ' + functionName + ' === "function" ? ' + functionName + ' : (new ' + functionName + '());\\n' +
        '  return __fn__(' + args.map((_, i) => '__args__[' + i + ']').join(', ') + ');\\n' +
        '})()'
      : code;

    vm.runInContext('var __args__ = ' + JSON.stringify(args) + ';', sandbox, { timeout: 300 });
    const script = new vm.Script(runner);
    const t0 = process.hrtime();
    const rawResult = script.runInContext(sandbox, { timeout: 3000 });
    const t1 = process.hrtime(t0);
    const executionTime = Math.round(t1[0] * 1000 + t1[1] / 1e6);

    let resultStr;
    if (rawResult === undefined) resultStr = 'undefined';
    else if (rawResult instanceof Set) resultStr = JSON.stringify(Array.from(rawResult));
    else if (rawResult instanceof Map) resultStr = JSON.stringify(Object.fromEntries(rawResult));
    else resultStr = JSON.stringify(rawResult);

    const logsOutput = capturedLogs.length > 0 ? '\\nLogs:\\n' + capturedLogs.join('\\n') : '';

    if (!functionName) throw new Error('Could not find a function to call. Define your function first.');
    if (rawResult === undefined && tc.expectedOutput !== 'undefined') {
      throw new Error('Function returned nothing. Make sure to use the \`return\` keyword.');
    }

    let expectedStr;
    try { expectedStr = JSON.stringify(JSON.parse(tc.expectedOutput)); }
    catch (_) { expectedStr = JSON.stringify(tc.expectedOutput); }

    const passed = (resultStr || '').replace(/\\s+/g, '') === (expectedStr || '').replace(/\\s+/g, '');
    if (tc.isHidden) {
      return {
        testCaseIndex: index,
        passed,
        isHidden: true,
        input: '[Hidden]',
        expectedOutput: '[Hidden]',
        actualOutput: '[Hidden]',
        output: passed ? '✓ Passed (Hidden Test Case)' : '✗ Failed (Hidden Test Case)',
        executionTime: executionTime || 1,
      };
    }

    return {
      testCaseIndex: index,
      passed,
      isHidden: false,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: resultStr,
      output: passed ? '✓ Output: ' + resultStr + logsOutput : 'Expected: ' + tc.expectedOutput + '\\nGot:      ' + resultStr + logsOutput,
      executionTime: executionTime || 1,
    };
  } catch (e) {
    const msg = e.message || String(e);
    if (tc.isHidden) {
      return {
        testCaseIndex: index,
        passed: false,
        isHidden: true,
        input: '[Hidden]',
        expectedOutput: '[Hidden]',
        actualOutput: '[Hidden]',
        output: '✗ Execution Error (Hidden Test Case)',
        executionTime: 0,
      };
    }
    return {
      testCaseIndex: index,
      passed: false,
      isHidden: false,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: 'Error',
      error: msg.startsWith('Error') ? msg : 'Error: ' + msg,
      output: msg.startsWith('Error') ? msg : 'Error: ' + msg,
      executionTime: 0,
    };
  }
});

console.log('__RESULTS_START__' + JSON.stringify(results) + '__RESULTS_END__');
`;

    fs.writeFileSync(runnerPath, runnerScript, { mode: 0o600 });

    try {
      const results = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, ['--max-old-space-size=128', runnerPath], {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: {
            PATH: process.env.PATH || '',
            NODE_ENV: 'production',
          },
        });

        const timeout = options.timeout || 3000;
        let stdout = '';
        let stderr = '';
        let timer = setTimeout(() => {
          child.kill('SIGKILL');
        }, timeout);

        child.stdout.on('data', (d) => { stdout += d; });
        child.stderr.on('data', (d) => { stderr += d; });

        child.on('error', (err) => {
          clearTimeout(timer);
          resolve(
            testCases.map((tc, index) => ({
              testCaseIndex: index,
              passed: false,
              isHidden: Boolean(tc.isHidden),
              input: tc.isHidden ? '[Hidden]' : tc.input,
              expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
              actualOutput: '[Hidden]',
              output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : `Execution environment unavailable: ${err.message || 'spawn error'}`,
              error: tc.isHidden ? undefined : `Execution environment unavailable: ${err.message || 'spawn error'}`,
              executionTime: 0,
            }))
          );
        });

        child.on('close', (code, signal) => {
          clearTimeout(timer);
          if (signal === 'SIGKILL' || signal === 'SIGTERM') {
            resolve(
              testCases.map((tc, index) => ({
                testCaseIndex: index,
                passed: false,
                isHidden: Boolean(tc.isHidden),
                input: tc.isHidden ? '[Hidden]' : tc.input,
                expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
                actualOutput: '[Hidden]',
                output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : `Execution timed out (${timeout}ms limit).`,
                error: tc.isHidden ? undefined : `Execution timed out (${timeout}ms limit).`,
                executionTime: timeout,
              }))
            );
            return;
          }

          const match = stdout.match(/__RESULTS_START__([\s\S]*?)__RESULTS_END__/);
          if (match) {
            try {
              resolve(JSON.parse(match[1]));
              return;
            } catch (_) {}
          }

          const errorMsg = (stderr || stdout || 'Execution failed').replace(new RegExp(runnerPath.replace(/\\/g, '\\\\'), 'g'), 'solution.js');
          resolve(
            testCases.map((tc, index) => ({
              testCaseIndex: index,
              passed: false,
              isHidden: Boolean(tc.isHidden),
              input: tc.isHidden ? '[Hidden]' : tc.input,
              expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
              actualOutput: '[Hidden]',
              output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : errorMsg,
              error: tc.isHidden ? undefined : errorMsg,
              executionTime: 0,
            }))
          );
        });
      });

      return results;
    } finally {
      try { if (fs.existsSync(runnerPath)) fs.unlinkSync(runnerPath); } catch (_) {}
    }
  }

  async runPython(code, testCases, options = {}) {
    const starterCode = options.starterCode || '';
    const tempDir = os.tmpdir();
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const filePath = path.join(tempDir, `devarena_py_${uniqueId}.py`);

    let functionName = '';
    const sources = [starterCode, code].filter(Boolean);
    for (const src of sources) {
      const m = src.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
      if (m) { functionName = m[1]; break; }
    }

    const SAFE_BUILTINS_PY = `
import sys as _sys
_SAFE_BUILTINS = {
  'abs': abs, 'all': all, 'any': any, 'bin': bin, 'bool': bool,
  'chr': chr, 'ord': ord, 'getattr': getattr, 'vars': vars,
  'dict': dict, 'divmod': divmod, 'enumerate': enumerate,
  'filter': filter, 'float': float, 'format': format,
  'frozenset': frozenset, 'hasattr': hasattr, 'hash': hash,
  'hex': hex, 'int': int, 'isinstance': isinstance, 'issubclass': issubclass,
  'iter': iter, 'len': len, 'list': list, 'map': map, 'max': max,
  'min': min, 'next': next, 'oct': oct, 'pow': pow,
  'print': print, 'range': range, 'repr': repr, 'reversed': reversed,
  'round': round, 'set': set, 'slice': slice, 'sorted': sorted,
  'str': str, 'sum': sum, 'tuple': tuple, 'type': type, 'zip': zip,
  'True': True, 'False': False, 'None': None,
  'ValueError': ValueError, 'TypeError': TypeError, 'IndexError': IndexError,
  'KeyError': KeyError, 'AttributeError': AttributeError,
  'StopIteration': StopIteration, 'Exception': Exception,
  'RuntimeError': RuntimeError, 'OverflowError': OverflowError,
  'ZeroDivisionError': ZeroDivisionError, 'NotImplementedError': NotImplementedError,
}
__builtins__ = _SAFE_BUILTINS
`;

    const pythonScript = `
import json as _json
import sys as _sys

${SAFE_BUILTINS_PY}

true = True
false = False
null = None

${code}

_test_cases = _json.loads(${JSON.stringify(JSON.stringify(testCases))})
_fn_name = ${JSON.stringify(functionName)}

_results = []
for idx, tc in enumerate(_test_cases):
    try:
        raw_input = tc.get('input', '') or ''
        args = []
        if raw_input and raw_input != 'None' and raw_input != '""':
            try:
                args = _json.loads('[' + raw_input + ']')
            except Exception:
                args = [raw_input]
        
        if _fn_name:
            fn = _SAFE_BUILTINS.get(_fn_name) or locals().get(_fn_name) or globals().get(_fn_name)
            if not fn:
                raise Exception('Function ' + _fn_name + ' is not defined')
            result = fn(*args)
        else:
            result = None

        if result is None:
            res_str = 'null'
        elif isinstance(result, bool):
            res_str = 'true' if result else 'false'
        else:
            res_str = _json.dumps(result)

        exp_raw = tc.get('expectedOutput', '')
        try:
            exp_str = _json.dumps(_json.loads(exp_raw))
        except Exception:
            exp_str = _json.dumps(exp_raw)

        norm_res = "".join(str(res_str).split())
        norm_exp = "".join(str(exp_str).split())
        passed = (norm_res == norm_exp)

        if tc.get('isHidden'):
            _results.append({
                'testCaseIndex': idx,
                'passed': passed,
                'isHidden': True,
                'input': '[Hidden]',
                'expectedOutput': '[Hidden]',
                'actualOutput': '[Hidden]',
                'output': '✓ Passed (Hidden Test Case)' if passed else '✗ Failed (Hidden Test Case)',
                'executionTime': 1
            })
        else:
            _results.append({
                'testCaseIndex': idx,
                'passed': passed,
                'isHidden': False,
                'input': tc.get('input'),
                'expectedOutput': tc.get('expectedOutput'),
                'actualOutput': res_str,
                'output': ('✓ Output: ' + str(res_str)) if passed else ('Expected: ' + str(tc.get('expectedOutput')) + '\\nGot:      ' + str(res_str)),
                'executionTime': 1
            })
    except Exception as e:
        err_msg = str(e)
        if tc.get('isHidden'):
            _results.append({
                'testCaseIndex': idx,
                'passed': False,
                'isHidden': True,
                'input': '[Hidden]',
                'expectedOutput': '[Hidden]',
                'actualOutput': '[Hidden]',
                'output': '✗ Execution Error (Hidden Test Case)',
                'executionTime': 0
            })
        else:
            _results.append({
                'testCaseIndex': idx,
                'passed': False,
                'isHidden': False,
                'input': tc.get('input'),
                'expectedOutput': tc.get('expectedOutput'),
                'actualOutput': 'Error',
                'error': err_msg if err_msg.startswith('Error') else ('Error: ' + err_msg),
                'output': err_msg if err_msg.startswith('Error') else ('Error: ' + err_msg),
                'executionTime': 0
            })

print('__RESULTS_START__' + _json.dumps(_results) + '__RESULTS_END__')
`;

    fs.writeFileSync(filePath, pythonScript, { mode: 0o600 });

    try {
      const isLinux = process.platform === 'linux';
      const cleanEnv = {
        PATH: process.env.PATH || '/usr/bin:/bin',
        ...(process.platform === 'win32' ? { SystemRoot: process.env.SystemRoot || '' } : {}),
        PYTHONDONTWRITEBYTECODE: '1',
        PYTHONHASHSEED: 'random',
      };

      const results = await new Promise((resolve) => {
        let child;
        if (isLinux) {
          // Semicolon-separated ulimit sequence so /bin/sh (dash) parses without "too many arguments"
          const ulimitCmd = 'ulimit -v 262144; ulimit -u 64; ulimit -n 32; ulimit -f 0; exec python3 -S -I -W ignore "$1" || exec python -S -I -W ignore "$1"';
          child = spawn('sh', ['-c', ulimitCmd, 'sh', filePath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: cleanEnv,
          });
        } else {
          child = spawn(getPythonBinary(), ['-S', '-I', '-W', 'ignore', filePath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: cleanEnv,
          });
        }

        const timeout = options.timeout || 5000;
        let stdout = '';
        let stderr = '';
        let timer = setTimeout(() => {
          child.kill('SIGKILL');
        }, timeout);

        child.stdout.on('data', (d) => { stdout += d; });
        child.stderr.on('data', (d) => { stderr += d; });

        child.on('error', (err) => {
          clearTimeout(timer);
          resolve(
            testCases.map((tc, index) => ({
              testCaseIndex: index,
              passed: false,
              isHidden: Boolean(tc.isHidden),
              input: tc.isHidden ? '[Hidden]' : tc.input,
              expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
              actualOutput: '[Hidden]',
              output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : `Execution environment unavailable: ${err.message || 'spawn error'}`,
              error: tc.isHidden ? undefined : `Execution environment unavailable: ${err.message || 'spawn error'}`,
              executionTime: 0,
            }))
          );
        });

        child.on('close', (code, signal) => {
          clearTimeout(timer);
          if (signal === 'SIGKILL' || signal === 'SIGTERM') {
            resolve(
              testCases.map((tc, index) => ({
                testCaseIndex: index,
                passed: false,
                isHidden: Boolean(tc.isHidden),
                input: tc.isHidden ? '[Hidden]' : tc.input,
                expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
                actualOutput: '[Hidden]',
                output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : `Execution timed out (${timeout}ms limit).`,
                error: tc.isHidden ? undefined : `Execution timed out (${timeout}ms limit).`,
                executionTime: timeout,
              }))
            );
            return;
          }

          const match = stdout.match(/__RESULTS_START__([\s\S]*?)__RESULTS_END__/);
          if (match) {
            try {
              resolve(JSON.parse(match[1]));
              return;
            } catch (_) {}
          }

          // Strip shell and ulimit diagnostics from user-facing error and sanitize all paths
          let cleanErr = (stderr || stdout || 'Execution failed')
            .replace(/^sh:\s*\d*:\s*ulimit:.*$/gmi, '')
            .replace(/ulimit:.*$/gmi, '')
            .replace(new RegExp(filePath.replace(/\\/g, '\\\\'), 'g'), 'solution.py')
            .replace(new RegExp(path.basename(filePath), 'g'), 'solution.py')
            .replace(new RegExp(tempDir.replace(/\\/g, '\\\\') + '[^\\s"]*', 'gi'), 'solution.py')
            .replace(/\/tmp\S*/g, 'solution.py')
            .replace(/[a-zA-Z]:\\[^:\n"]*devarena\S*/gi, 'solution.py')
            .trim();

          resolve(
            testCases.map((tc, index) => ({
              testCaseIndex: index,
              passed: false,
              isHidden: Boolean(tc.isHidden),
              input: tc.isHidden ? '[Hidden]' : tc.input,
              expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
              actualOutput: '[Hidden]',
              output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : (cleanErr || 'Execution error in solution.py'),
              error: tc.isHidden ? undefined : (cleanErr || 'Execution error in solution.py'),
              executionTime: 0,
            }))
          );
        });
      });

      return results;
    } finally {
      try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (_) {}
    }
  }
}

const localSpawnRunner = new LocalSpawnCodeRunner();

// Unified CodeRunner Interface
class CodeRunner {
  static getRunner() {
    if (process.env.RUNNER_URL) {
      return new RemoteCodeRunner(process.env.RUNNER_URL);
    }
    return localSpawnRunner;
  }

  static async run(code, language, testCases, options = {}) {
    const runner = CodeRunner.getRunner();
    return await runner.run(code, language, testCases, options);
  }
}

module.exports = {
  CodeRunner,
  LocalSpawnCodeRunner,
  RemoteCodeRunner,
  ConcurrencyQueue,
  executionQueue,
  detectJSBannedPatterns,
  detectPyBannedImports,
};

