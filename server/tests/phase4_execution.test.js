const { describe, it } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const express = require('express');
const { CodeRunner, RemoteCodeRunner, LocalSpawnCodeRunner, executionQueue } = require('../services/codeRunner');
const { _testExports } = require('../controllers/submissionController');
const submissionRoutes = require('../routes/submissionRoutes');
const Challenge = require('../models/Challenge');

describe('PHASE 4 / PHASE B - Code Execution Hardening & Live CodeRunner', () => {
  it('anonymous POST /:id/run returns 401 Unauthorized', (t, done) => {
    const app = express();
    app.use(express.json());
    app.use('/api/challenges', submissionRoutes);

    const srv = app.listen(0, () => {
      const port = srv.address().port;
      const req = http.request(
        {
          hostname: '127.0.0.1',
          port,
          path: '/api/challenges/507f1f77bcf86cd799439011/run',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        },
        (res) => {
          assert.strictEqual(res.statusCode, 401, 'Anonymous /run must be rejected with 401');
          srv.close(done);
        }
      );
      req.write(JSON.stringify({ code: 'function solution() {}', language: 'javascript' }));
      req.end();
    });
  });

  it('hidden test fields never leak for pass, fail, error, and timeout cases (JS and Python)', async () => {
    const secretInput = 'secret_super_secure_input_xyz';
    const secretExpected = 'secret_super_secure_output_42';

    const testCases = [
      { input: '1, 2', expectedOutput: '3', isHidden: false },
      { input: secretInput, expectedOutput: secretExpected, isHidden: true },
    ];

    const checkHiddenMasking = (results, label) => {
      const hidden = results.find((r) => r.isHidden);
      assert.ok(hidden, `${label}: hidden test result must exist`);
      assert.strictEqual(hidden.input, '[Hidden]', `${label}: input must be [Hidden]`);
      assert.strictEqual(hidden.expectedOutput, '[Hidden]', `${label}: expectedOutput must be [Hidden]`);
      assert.strictEqual(hidden.actualOutput, '[Hidden]', `${label}: actualOutput must be [Hidden]`);
      assert.strictEqual(hidden.output.includes(secretInput), false, `${label}: output must not leak secret input`);
      assert.strictEqual(hidden.output.includes(secretExpected), false, `${label}: output must not leak secret expected output`);
      assert.strictEqual(hidden.error, undefined, `${label}: error field must not leak on hidden tests`);
    };

    // 1. JS Pass
    const jsPass = await CodeRunner.run(
      'function solve(a, b) { return a === "secret_super_secure_input_xyz" ? "secret_super_secure_output_42" : a + b; }',
      'javascript',
      testCases,
      { starterCode: 'function solve(a, b) {}' }
    );
    checkHiddenMasking(jsPass, 'JS Pass');
    assert.strictEqual(jsPass[1].passed, true);
    assert.strictEqual(jsPass[1].output, '✓ Passed (Hidden Test Case)');

    // 2. JS Fail
    const jsFail = await CodeRunner.run(
      'function solve(a, b) { return "wrong_result"; }',
      'javascript',
      testCases,
      { starterCode: 'function solve(a, b) {}' }
    );
    checkHiddenMasking(jsFail, 'JS Fail');
    assert.strictEqual(jsFail[1].passed, false);
    assert.strictEqual(jsFail[1].output, '✗ Failed (Hidden Test Case)');

    // 3. JS Error
    const jsError = await CodeRunner.run(
      'function solve(a, b) { throw new Error("bad error with " + a); }',
      'javascript',
      testCases,
      { starterCode: 'function solve(a, b) {}' }
    );
    checkHiddenMasking(jsError, 'JS Error');
    assert.strictEqual(jsError[1].passed, false);
    assert.strictEqual(jsError[1].output, '✗ Execution Error (Hidden Test Case)');

    // 4. JS Timeout
    const jsTimeout = await CodeRunner.run(
      'while(true) {}',
      'javascript',
      testCases,
      { timeout: 800 }
    );
    checkHiddenMasking(jsTimeout, 'JS Timeout');
    assert.strictEqual(jsTimeout[1].passed, false);

    // 5. Python Pass
    const pyPass = await CodeRunner.run(
      'def solve(*args):\n    if args and args[0] == "secret_super_secure_input_xyz":\n        return "secret_super_secure_output_42"\n    return sum(args)',
      'python',
      testCases,
      { starterCode: 'def solve(*args):' }
    );
    checkHiddenMasking(pyPass, 'Python Pass');
    assert.strictEqual(pyPass[1].passed, true);
    assert.strictEqual(pyPass[1].output, '✓ Passed (Hidden Test Case)');

    // 6. Python Fail
    const pyFail = await CodeRunner.run(
      'def solve(*args):\n    return "wrong_result"',
      'python',
      testCases,
      { starterCode: 'def solve(*args):' }
    );
    checkHiddenMasking(pyFail, 'Python Fail');
    assert.strictEqual(pyFail[1].passed, false);
    assert.strictEqual(pyFail[1].output, '✗ Failed (Hidden Test Case)');

    // 7. Python Error
    const pyError = await CodeRunner.run(
      'def solve(*args):\n    raise ValueError("fatal failure with " + str(args))',
      'python',
      testCases,
      { starterCode: 'def solve(*args):' }
    );
    checkHiddenMasking(pyError, 'Python Error');
    assert.strictEqual(pyError[1].passed, false);
    assert.strictEqual(pyError[1].output, '✗ Execution Error (Hidden Test Case)');

    // 8. Python Timeout
    const pyTimeout = await CodeRunner.run(
      'while True:\n    pass',
      'python',
      testCases,
      { timeout: 800 }
    );
    checkHiddenMasking(pyTimeout, 'Python Timeout');
    assert.strictEqual(pyTimeout[1].passed, false);
  });

  it('ordinary Python solutions using ord() and chr() pass static checks and execute correctly', async () => {
    const code = `
def caesar_cipher(s, shift):
    res = []
    for char in s:
        shifted = chr((ord(char) - ord('a') + shift) % 26 + ord('a'))
        res.append(shifted)
    return "".join(res)
`;
    // Verify static analysis allows ord and chr
    const check = _testExports.detectPyBannedImports(code);
    assert.strictEqual(check, null, 'detectPyBannedImports must allow ord() and chr()');

    // Verify live execution via CodeRunner.run
    const testCases = [
      { input: '"abc", 3', expectedOutput: '"def"', isHidden: false },
    ];
    const results = await CodeRunner.run(code, 'python', testCases, { starterCode: 'def caesar_cipher(s, shift):' });
    assert.strictEqual(results[0].passed, true, `Expected caesar_cipher to pass: ${results[0].output}`);
  });

  it('Python: syntax error returns clean error (no shell/ulimit text, no /tmp paths)', async () => {
    const brokenCode = `
def broken(a, b:
    return a +
`;
    const testCases = [{ input: '1, 2', expectedOutput: '3', isHidden: false }];
    const results = await CodeRunner.run(brokenCode, 'python', testCases);
    assert.strictEqual(results[0].passed, false);
    const errText = results[0].output || '';
    assert.strictEqual(/ulimit/i.test(errText), false, 'Error must not contain ulimit text');
    assert.strictEqual(/\/tmp/i.test(errText), false, 'Error must not contain /tmp paths');
    assert.strictEqual(/devarena_py/i.test(errText), false, 'Error must not contain temp file names');
    assert.ok(errText.includes('SyntaxError') || errText.includes('solution.py'), 'Must indicate Python syntax issue');
  });

  it('Python: infinite loop is killed within timeout and does not block concurrent executions', async () => {
    const infiniteCode = `
while True:
    pass
`;
    const simpleCode = `
def solve(a, b):
    return a + b
`;
    const tc1 = [{ input: '', expectedOutput: '1', isHidden: false }];
    const tc2 = [{ input: '2, 3', expectedOutput: '5', isHidden: false }];

    // Run both concurrently
    const [loopResult, quickResult] = await Promise.all([
      CodeRunner.run(infiniteCode, 'python', tc1, { timeout: 1200 }),
      CodeRunner.run(simpleCode, 'python', tc2, { starterCode: 'def solve(a, b):' }),
    ]);

    assert.strictEqual(loopResult[0].passed, false);
    assert.ok(loopResult[0].output.includes('timed out'), 'Loop must time out');

    assert.strictEqual(quickResult[0].passed, true);
    assert.strictEqual(quickResult[0].actualOutput, '5');
  });

  it('JavaScript: simple solve passes and infinite loop times out', async () => {
    // 1. Simple solve
    const jsCode = `
function add(a, b) {
  return a + b;
}
`;
    const passResult = await CodeRunner.run(jsCode, 'javascript', [{ input: '4, 6', expectedOutput: '10' }], { starterCode: 'function add(a, b) {}' });
    assert.strictEqual(passResult[0].passed, true);
    assert.strictEqual(passResult[0].actualOutput, '10');

    // 2. Infinite loop
    const loopResult = await CodeRunner.run('while(true) {}', 'javascript', [{ input: '', expectedOutput: '1' }], { timeout: 800 });
    assert.strictEqual(loopResult[0].passed, false);
    assert.ok(loopResult[0].output.includes('timed out'));
  });

  it('Concurrency: with CODE_EXECUTION_MAX_CONCURRENT=1 and MAX_QUEUE=1, the third simultaneous run is rejected with status 503', async () => {
    const origMaxConcurrent = process.env.CODE_EXECUTION_MAX_CONCURRENT;
    const origMaxQueue = process.env.CODE_EXECUTION_MAX_QUEUE;

    process.env.CODE_EXECUTION_MAX_CONCURRENT = '1';
    process.env.CODE_EXECUTION_MAX_QUEUE = '1';

    executionQueue.reset();

    try {
      const slowCode = 'const start = Date.now(); while (Date.now() - start < 1000) {}';
      const tc = [{ input: '', expectedOutput: '1' }];

      // Fire 3 simultaneous executions
      const p1 = CodeRunner.run(slowCode, 'javascript', tc, { timeout: 2000 });
      const p2 = CodeRunner.run(slowCode, 'javascript', tc, { timeout: 2000 });

      let rejectedError = null;
      try {
        await CodeRunner.run(slowCode, 'javascript', tc, { timeout: 2000 });
      } catch (err) {
        rejectedError = err;
      }

      assert.ok(rejectedError, 'Third concurrent execution must be rejected');
      assert.strictEqual(rejectedError.status || rejectedError.statusCode, 503, 'Must reject with HTTP 503');
      assert.ok(rejectedError.message.includes('concurrency limit reached'), 'Must inform about concurrency limit');

      // Await pending runs so they clear the queue
      await Promise.allSettled([p1, p2]);
    } finally {
      if (origMaxConcurrent) process.env.CODE_EXECUTION_MAX_CONCURRENT = origMaxConcurrent;
      else delete process.env.CODE_EXECUTION_MAX_CONCURRENT;

      if (origMaxQueue) process.env.CODE_EXECUTION_MAX_QUEUE = origMaxQueue;
      else delete process.env.CODE_EXECUTION_MAX_QUEUE;

      executionQueue.reset();
    }
  });

  it('CodeRunner interface selects RemoteCodeRunner when RUNNER_URL is configured', () => {
    const origRunnerUrl = process.env.RUNNER_URL;
    try {
      process.env.RUNNER_URL = 'https://judge0.example.com';
      const runner = CodeRunner.getRunner();
      assert.ok(runner instanceof RemoteCodeRunner, 'Must use RemoteCodeRunner when RUNNER_URL is set');
      assert.strictEqual(runner.runnerUrl, 'https://judge0.example.com');
    } finally {
      if (origRunnerUrl) {
        process.env.RUNNER_URL = origRunnerUrl;
      } else {
        delete process.env.RUNNER_URL;
      }
    }
  });

  it('LocalSpawnCodeRunner executes JS asynchronously off the main thread without blocking event loop', async () => {
    const runner = new LocalSpawnCodeRunner();
    const testCases = [{ input: '2, 3', expectedOutput: '5', isHidden: false }];
    const code = `
function add(a, b) {
  return a + b;
}
`;
    const results = await runner.run(code, 'javascript', testCases, { starterCode: 'function add(a, b) {}' });
    assert.strictEqual(results[0].passed, true);
  });
});
