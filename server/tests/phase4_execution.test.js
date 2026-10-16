const { describe, it } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const express = require('express');
const { CodeRunner, RemoteCodeRunner, LocalSpawnCodeRunner } = require('../services/codeRunner');
const { _testExports } = require('../controllers/submissionController');
const { evaluateJS, evaluatePython } = _testExports;
const submissionRoutes = require('../routes/submissionRoutes');
const Challenge = require('../models/Challenge');

describe('PHASE 4 - Code Execution Hardening & Sandboxing', () => {
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

  it('hidden test expectations never appear in output, error, actualOutput, or input (JS, Python, HTML)', async () => {
    const secretInput = 'super_secret_payload_input';
    const secretExpected = 'secret_target_42';

    const testCases = [
      {
        input: '1, 2',
        expectedOutput: '3',
        isHidden: false,
      },
      {
        input: secretInput,
        expectedOutput: secretExpected,
        isHidden: true,
      },
    ];

    // 1. Test in evaluateJS
    const jsCode = `function testMe(x) { return "wrong_output"; }`;
    const jsResults = evaluateJS(jsCode, testCases, 'algorithms', 'function testMe()');
    const jsHidden = jsResults.find((r) => r.isHidden);

    assert.strictEqual(jsHidden.input, '[Hidden]');
    assert.strictEqual(jsHidden.expectedOutput, '[Hidden]');
    assert.strictEqual(jsHidden.actualOutput, '[Hidden]');
    assert.strictEqual(jsHidden.output.includes(secretInput), false, 'Output must not leak secret input');
    assert.strictEqual(jsHidden.output.includes(secretExpected), false, 'Output must not leak secret expected output');
    assert.strictEqual(jsHidden.output.includes('wrong_output'), false, 'Output must not leak actual output');
    assert.strictEqual(jsHidden.error, undefined);

    // 2. Test in evaluatePython
    const pyCode = `def testMe(x):\n    return "wrong_output"`;
    const pyResults = evaluatePython(pyCode, testCases, 'algorithms', 'def testMe(x):');
    const pyHidden = pyResults.find((r) => r.isHidden);

    assert.strictEqual(pyHidden.input, '[Hidden]');
    assert.strictEqual(pyHidden.expectedOutput, '[Hidden]');
    assert.strictEqual(pyHidden.actualOutput, '[Hidden]');
    assert.strictEqual(pyHidden.output.includes(secretInput), false);
    assert.strictEqual(pyHidden.output.includes(secretExpected), false);
    assert.strictEqual(pyHidden.output.includes('wrong_output'), false);
    assert.strictEqual(pyHidden.error, undefined);

    // 3. Test in CodeRunner.run
    const runnerResults = await CodeRunner.run(jsCode, 'javascript', testCases, { starterCode: 'function testMe()' });
    const runnerHidden = runnerResults.find((r) => r.isHidden);
    assert.strictEqual(runnerHidden.input, '[Hidden]');
    assert.strictEqual(runnerHidden.expectedOutput, '[Hidden]');
    assert.strictEqual(runnerHidden.actualOutput, '[Hidden]');
    assert.strictEqual(runnerHidden.output.includes(secretInput), false);
    assert.strictEqual(runnerHidden.output.includes(secretExpected), false);
  });

  it('ordinary Python solutions using ord() and chr() pass static checks and execute correctly', () => {
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

    // Verify execution
    const testCases = [
      { input: '"abc", 3', expectedOutput: '"def"', isHidden: false },
    ];
    const results = evaluatePython(code, testCases, 'algorithms', 'def caesar_cipher(s, shift):');
    assert.strictEqual(results[0].passed, true, `Expected caesar_cipher to pass: ${results[0].output}`);
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
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].passed, true);
  });
});
