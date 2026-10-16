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

// Concurrency Cap & Queue for Worker Execution
class ConcurrencyQueue {
  constructor(maxConcurrent = 4, maxQueue = 20) {
    this.maxConcurrent = maxConcurrent;
    this.maxQueue = maxQueue;
    this.running = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.running < this.maxConcurrent) {
      this.running++;
      return () => this.release();
    }

    if (this.queue.length >= this.maxQueue) {
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
}

const executionQueue = new ConcurrencyQueue(
  parseInt(process.env.CODE_EXECUTION_MAX_CONCURRENT || '4', 10),
  parseInt(process.env.CODE_EXECUTION_MAX_QUEUE || '20', 10)
);

// ─── Remote Code Runner (Judge0 / Piston Adapter Stub) ─────────────────────────
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

    const response = await fetch(`${this.runnerUrl}/api/v1/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = new Error(`Remote runner responded with status ${response.status}`);
      err.status = response.status >= 500 ? 502 : response.status;
      throw err;
    }

    const data = await response.json();
    // Ensure hidden test masking on remote responses as well
    return (data.results || []).map((r, idx) => {
      const tc = testCases[idx] || {};
      if (tc.isHidden) {
        return {
          testCaseIndex: idx,
          passed: Boolean(r.passed),
          isHidden: true,
          input: '[Hidden]',
          expectedOutput: '[Hidden]',
          actualOutput: '[Hidden]',
          output: r.passed ? '✓ Passed (Hidden Test Case)' : '✗ Failed (Hidden Test Case)',
          executionTime: r.executionTime || 1,
        };
      }
      return r;
    });
  }
}

// ─── Local Spawn Code Runner ───────────────────────────────────────────────────
class LocalSpawnCodeRunner {
  async run(code, language, testCases, options = {}) {
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
    return testCases.map((tc, index) => {
      const startTime = Date.now();
      const cleanCode = code.replace(/\s+/g, ' ').trim().toLowerCase();
      const cleanExpected = (tc.expectedOutput || '').trim().toLowerCase();
      let passed = false;

      if (['true', 'passed', 'pass'].includes(cleanExpected)) {
        passed = cleanCode.length > 20 && !cleanCode.includes('<!-- write your');
      } else if (cleanExpected.length > 0) {
        const expectedParts = cleanExpected.split(/[,;|]+/).map((p) => p.trim()).filter(Boolean);
        if (expectedParts.length > 1) {
          passed = expectedParts.every((part) => cleanCode.includes(part));
        } else {
          passed = cleanCode.includes(cleanExpected) || code.toLowerCase().includes(cleanExpected);
        }
      } else {
        passed = cleanCode.length > 30;
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
        actualOutput: passed ? tc.expectedOutput : 'Structure mismatch',
        output: passed ? '✅ HTML structure matches expected output' : '❌ HTML does not contain expected structure',
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

        let stdout = '';
        let stderr = '';
        let timer = setTimeout(() => {
          child.kill('SIGKILL');
        }, 4000);

        child.stdout.on('data', (d) => { stdout += d; });
        child.stderr.on('data', (d) => { stderr += d; });

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
                output: 'Execution timed out (3000ms limit).',
                error: tc.isHidden ? undefined : 'Execution timed out (3000ms limit).',
                executionTime: 3000,
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

_test_cases = ${_json.dumps(testCases)}
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
          const ulimitCmd = 'ulimit -v 262144; ulimit -u 64; ulimit -n 32; ulimit -f 0; exec python -S -I -W ignore "$1"';
          child = spawn('sh', ['-c', ulimitCmd, 'sh', filePath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: cleanEnv,
          });
        } else {
          child = spawn('python', ['-S', '-I', '-W', 'ignore', filePath], {
            stdio: ['pipe', 'pipe', 'pipe'],
            env: cleanEnv,
          });
        }

        let stdout = '';
        let stderr = '';
        let timer = setTimeout(() => {
          child.kill('SIGKILL');
        }, 5500);

        child.stdout.on('data', (d) => { stdout += d; });
        child.stderr.on('data', (d) => { stderr += d; });

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
                output: 'Execution timed out (5000ms limit).',
                error: tc.isHidden ? undefined : 'Execution timed out (5000ms limit).',
                executionTime: 5000,
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

          // Strip shell and ulimit diagnostics from user-facing error
          let cleanErr = (stderr || stdout || 'Execution failed')
            .replace(/^sh:\s*\d*:\s*ulimit:.*$/gmi, '')
            .replace(/ulimit:.*$/gmi, '')
            .replace(new RegExp(filePath.replace(/\\/g, '\\\\'), 'g'), 'solution.py')
            .replace(/\/tmp\S*/g, 'solution.py')
            .trim();

          resolve(
            testCases.map((tc, index) => ({
              testCaseIndex: index,
              passed: false,
              isHidden: Boolean(tc.isHidden),
              input: tc.isHidden ? '[Hidden]' : tc.input,
              expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
              actualOutput: '[Hidden]',
              output: tc.isHidden ? '✗ Execution Error (Hidden Test Case)' : (cleanErr || 'Execution error'),
              error: tc.isHidden ? undefined : (cleanErr || 'Execution error'),
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
  executionQueue,
};
