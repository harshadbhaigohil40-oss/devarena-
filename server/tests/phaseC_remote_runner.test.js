const { describe, it } = require('node:test');
const assert = require('node:assert');
const { RemoteCodeRunner, CodeRunner } = require('../services/codeRunner');
const { submitSolution, runCode } = require('../controllers/submissionController');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const xpService = require('../services/xpService');

describe('PHASE C - RemoteCodeRunner Fail-Closed & Validation', () => {
  const runner = new RemoteCodeRunner('https://runner.internal');
  const sampleTestCases = [
    { input: '1, 2', expectedOutput: '3', isHidden: false },
    { input: '5, 5', expectedOutput: '10', isHidden: true },
  ];

  it('rejects with 502 when remote runner returns empty results: [] (prevents free-solve)', async () => {
    const origFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    });

    try {
      await assert.rejects(
        async () => {
          await runner.run('function solve() {}', 'javascript', sampleTestCases);
        },
        (err) => {
          assert.strictEqual(err.status || err.statusCode, 502);
          assert.ok(err.message.includes('expected 2'));
          return true;
        }
      );
    } finally {
      global.fetch = origFetch;
    }
  });

  it('rejects with 502 when remote runner returns wrong-length array', async () => {
    const origFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        results: [{ passed: true, executionTime: 12 }],
      }),
    });

    try {
      await assert.rejects(
        async () => {
          await runner.run('function solve() {}', 'javascript', sampleTestCases);
        },
        (err) => {
          assert.strictEqual(err.status || err.statusCode, 502);
          assert.ok(err.message.includes('expected 2'));
          return true;
        }
      );
    } finally {
      global.fetch = origFetch;
    }
  });

  it('rejects with 502 when remote runner responds with non-200 HTTP status', async () => {
    const origFetch = global.fetch;
    global.fetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Runner Cluster Error' }),
    });

    try {
      await assert.rejects(
        async () => {
          await runner.run('function solve() {}', 'javascript', sampleTestCases);
        },
        (err) => {
          assert.strictEqual(err.status || err.statusCode, 502);
          return true;
        }
      );
    } finally {
      global.fetch = origFetch;
    }
  });

  it('rejects with 504 when remote runner fetch times out or aborts', async () => {
    const origFetch = global.fetch;
    global.fetch = async () => {
      const abortErr = new Error('The operation was aborted');
      abortErr.name = 'AbortError';
      throw abortErr;
    };

    try {
      await assert.rejects(
        async () => {
          await runner.run('function solve() {}', 'javascript', sampleTestCases);
        },
        (err) => {
          assert.strictEqual(err.status || err.statusCode, 504);
          assert.ok(err.message.includes('timed out'));
          return true;
        }
      );
    } finally {
      global.fetch = origFetch;
    }
  });

  it('sends Authorization: Bearer when RUNNER_API_KEY is configured', async () => {
    const origFetch = global.fetch;
    const origKey = process.env.RUNNER_API_KEY;
    process.env.RUNNER_API_KEY = 'secret-production-runner-token';

    let capturedHeaders = null;
    global.fetch = async (url, options) => {
      capturedHeaders = options.headers;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          results: [
            { passed: true, executionTime: 10 },
            { passed: true, executionTime: 12 },
          ],
        }),
      };
    };

    try {
      const results = await runner.run('function solve() {}', 'javascript', sampleTestCases);
      assert.strictEqual(results.length, 2);
      assert.ok(capturedHeaders);
      assert.strictEqual(capturedHeaders['Authorization'], 'Bearer secret-production-runner-token');
    } finally {
      global.fetch = origFetch;
      if (origKey) process.env.RUNNER_API_KEY = origKey;
      else delete process.env.RUNNER_API_KEY;
    }
  });

  it('truncates output strings longer than 5000 characters and masks hidden test fields', async () => {
    const origFetch = global.fetch;
    const hugeString = 'X'.repeat(7000);

    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        results: [
          { passed: true, executionTime: 15, output: hugeString, input: '1, 2', expectedOutput: '3' },
          { passed: true, executionTime: 20, output: 'secret_leak', input: 'secret_leak', expectedOutput: 'secret_leak' },
        ],
      }),
    });

    try {
      const results = await runner.run('function solve() {}', 'javascript', sampleTestCases);
      assert.strictEqual(results.length, 2);

      // Visible test case: truncated
      assert.strictEqual(results[0].output.length, 5000);
      assert.strictEqual(results[0].isHidden, false);

      // Hidden test case: rebuilt and masked
      assert.strictEqual(results[1].isHidden, true);
      assert.strictEqual(results[1].input, '[Hidden]');
      assert.strictEqual(results[1].expectedOutput, '[Hidden]');
      assert.strictEqual(results[1].actualOutput, '[Hidden]');
      assert.strictEqual(results[1].output.includes('secret_leak'), false);
    } finally {
      global.fetch = origFetch;
    }
  });

  it('submitSolution returns 502 and awards NO XP when runner returns malformed or wrong-count results', async () => {
    const origFindById = Challenge.findById;
    const origAwardXP = xpService.awardXP;
    const origRunnerUrl = process.env.RUNNER_URL;
    const origFetch = global.fetch;

    process.env.RUNNER_URL = 'https://runner.internal';

    let awardXPCalled = false;
    xpService.awardXP = async () => {
      awardXPCalled = true;
    };

    Challenge.findById = async () => ({
      _id: '507f1f77bcf86cd799439011',
      title: 'Mock Challenge',
      xpReward: 100,
      category: 'algorithms',
      testCases: sampleTestCases,
      starterCode: { javascript: 'function solve() {}' },
    });

    // Remote runner returns empty results
    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    });

    let resStatus = 0;
    let resJson = null;
    const mockRes = {
      status: (code) => {
        resStatus = code;
        return mockRes;
      },
      json: (data) => {
        resJson = data;
        return mockRes;
      },
    };

    const mockReq = {
      params: { id: '507f1f77bcf86cd799439011' },
      body: { code: 'function solve() { return 42; }', language: 'javascript' },
      userId: '507f1f77bcf86cd799439022',
    };

    try {
      await submitSolution(mockReq, mockRes, (err) => {
        if (err) {
          resStatus = err.status || err.statusCode || 500;
          resJson = { error: err.message };
        }
      });

      assert.strictEqual(resStatus, 502, 'Must return HTTP 502 on runner failure');
      assert.strictEqual(awardXPCalled, false, 'awardXP must NEVER be called on 502');
      assert.strictEqual(resJson.success, false);
    } finally {
      Challenge.findById = origFindById;
      xpService.awardXP = origAwardXP;
      global.fetch = origFetch;
      if (origRunnerUrl) process.env.RUNNER_URL = origRunnerUrl;
      else delete process.env.RUNNER_URL;
    }
  });
});
