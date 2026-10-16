const { describe, it } = require('node:test');
const assert = require('node:assert');
const { CodeRunner } = require('../services/codeRunner');
const leaderboardService = require('../services/leaderboardService');
const SystemLock = require('../models/SystemLock');
const LeaderboardEntry = require('../models/LeaderboardEntry');
const SolvedChallenge = require('../models/SolvedChallenge');
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const xpService = require('../services/xpService');
const submissionController = require('../controllers/submissionController');

describe('PHASE G - Edge Cases, Concurrency Locks, and HTML Validation', () => {

  describe('1. Scheduled Resets & Distributed Idempotency Lock', () => {
    it('acquires lock for the first instance and rejects concurrent instances within the same period', async () => {
      let storedLock = null;
      const origCreate = SystemLock.create;
      const origFindOneAndUpdate = SystemLock.findOneAndUpdate;

      try {
        SystemLock.create = async (doc) => {
          if (storedLock) {
            const err = new Error('Duplicate key');
            err.code = 11000;
            throw err;
          }
          storedLock = { ...doc };
          return storedLock;
        };

        SystemLock.findOneAndUpdate = async (query, update) => {
          if (!storedLock) return null;
          // Check $or condition
          const now = new Date();
          const threshold = query.$or[0].lastResetAt.$lt;
          if (storedLock.lastResetAt < threshold || storedLock.lastResetAt === null) {
            storedLock.lastResetAt = update.$set.lastResetAt;
            return storedLock;
          }
          return null; // Condition not met: already reset within this period
        };

        const now = new Date('2026-10-18T10:00:00Z');
        const startOfWeek = new Date('2026-10-18T00:00:00Z');

        // Worker 1 attempts to acquire lock
        const worker1Acquired = await leaderboardService.acquireResetLock('weekly_xp_reset', startOfWeek, now);
        assert.strictEqual(worker1Acquired, true, 'Worker 1 must acquire the lock on initial run');

        // Worker 2 attempts to acquire lock in the same period
        const worker2Acquired = await leaderboardService.acquireResetLock('weekly_xp_reset', startOfWeek, now);
        assert.strictEqual(worker2Acquired, false, 'Worker 2 must be rejected by atomic period lock');

        // Next week comes around (now is 7 days later, startOfWeek is new week)
        const nextWeekNow = new Date('2026-10-25T10:00:00Z');
        const nextWeekStart = new Date('2026-10-25T00:00:00Z');

        const nextWeekAcquired = await leaderboardService.acquireResetLock('weekly_xp_reset', nextWeekStart, nextWeekNow);
        assert.strictEqual(nextWeekAcquired, true, 'Lock must be acquirable again in the next weekly window');

      } finally {
        SystemLock.create = origCreate;
        SystemLock.findOneAndUpdate = origFindOneAndUpdate;
      }
    });

    it('resetWeeklyXPWithLock skips execution when lock cannot be acquired', async () => {
      let resetCalled = false;
      const origResetWeeklyXP = leaderboardService.resetWeeklyXP;
      const origAcquireLock = leaderboardService.acquireResetLock;

      try {
        leaderboardService.resetWeeklyXP = async () => {
          resetCalled = true;
        };

        // When lock is rejected (held by another worker)
        leaderboardService.acquireResetLock = async () => false;
        const resultRejected = await leaderboardService.resetWeeklyXPWithLock();
        assert.strictEqual(resultRejected, false);
        assert.strictEqual(resetCalled, false, 'resetWeeklyXP must NOT be called when lock acquisition fails');

        // When lock is acquired
        leaderboardService.acquireResetLock = async () => true;
        const resultAcquired = await leaderboardService.resetWeeklyXPWithLock();
        assert.strictEqual(resultAcquired, true);
        assert.strictEqual(resetCalled, true, 'resetWeeklyXP must be called when lock is acquired');

      } finally {
        leaderboardService.resetWeeklyXP = origResetWeeklyXP;
        leaderboardService.acquireResetLock = origAcquireLock;
      }
    });
  });

  describe('2. First-Solve Award Resilience & Rollback', () => {
    it('rolls back SolvedChallenge marker if awardXP throws, allowing subsequent retry', async () => {
      const origChallengeFindById = Challenge.findById;
      const origSubmissionFindOne = Submission.findOne;
      const origSubmissionCreate = Submission.create;
      const origSolvedChallengeCreate = SolvedChallenge.create;
      const origSolvedChallengeDeleteOne = SolvedChallenge.deleteOne;
      const origAwardXP = xpService.awardXP;
      const origCodeRunnerRun = CodeRunner.run;

      let solvedChallengeDeleted = false;
      const mockSolvedId = 'solved_marker_123';

      try {
        Challenge.findById = async () => ({
          _id: 'challenge_123',
          title: 'Two Sum',
          xpReward: 50,
          category: 'algorithms',
          testCases: [{ input: '[1,2]', expectedOutput: '3', isHidden: false }],
          starterCode: { javascript: 'function solve() {}' },
        });

        Submission.findOne = async () => null; // No previous passed submission
        Submission.create = async (doc) => ({ _id: 'sub_123', ...doc });

        SolvedChallenge.create = async () => ({
          _id: mockSolvedId,
          userId: 'user_123',
          challengeId: 'challenge_123',
        });

        SolvedChallenge.deleteOne = async (query) => {
          if (query._id === mockSolvedId) {
            solvedChallengeDeleted = true;
          }
        };

        CodeRunner.run = async () => [
          { testCaseIndex: 0, passed: true, isHidden: false, input: '[1,2]', expectedOutput: '3', actualOutput: '3', output: 'Passed' },
        ];

        // Simulate awardXP failure (e.g. database error or network blip)
        xpService.awardXP = async () => {
          throw new Error('Database write failure during XP award');
        };

        const req = {
          userId: 'user_123',
          params: { id: 'challenge_123' },
          body: {
            code: 'function solve(a, b) { return a + b; }',
            language: 'javascript',
          },
        };

        let passedError = null;
        const res = {
          status: () => res,
          json: () => res,
        };

        await submissionController.submitSolution(req, res, (err) => {
          passedError = err;
        });

        assert.ok(passedError, 'Expected submitSolution to propagate the awardError');
        assert.ok(passedError.message.includes('Database write failure during XP award'));
        assert.strictEqual(solvedChallengeDeleted, true, 'SolvedChallenge marker must be rolled back on award failure');

      } finally {
        Challenge.findById = origChallengeFindById;
        Submission.findOne = origSubmissionFindOne;
        Submission.create = origSubmissionCreate;
        SolvedChallenge.create = origSolvedChallengeCreate;
        SolvedChallenge.deleteOne = origSolvedChallengeDeleteOne;
        xpService.awardXP = origAwardXP;
        CodeRunner.run = origCodeRunnerRun;
      }
    });
  });

  describe('3. Structured HTML Challenge Validation with node-html-parser', () => {
    it('passes for valid HTML matching structured DOM selectors and attributes', async () => {
      const code = `
        <div class="user-card" id="profile">
          <h1>John Doe</h1>
          <form action="/update" method="POST">
            <input type="email" name="user_email" required />
            <button type="submit">Save</button>
          </form>
        </div>
      `;

      const testCases = [
        {
          input: '',
          expectedOutput: 'div#profile.user-card, form[action="/update"][method="POST"]',
          isHidden: false,
        },
        {
          input: 'h1',
          expectedOutput: 'John Doe',
          isHidden: false,
        },
        {
          input: '',
          expectedOutput: 'input[type="email"][required], button[type="submit"]',
          isHidden: true,
        },
      ];

      const results = await CodeRunner.run(code, 'html', testCases);

      assert.strictEqual(results.length, 3);
      assert.strictEqual(results[0].passed, true, 'DOM element & attribute selector must pass');
      assert.strictEqual(results[1].passed, true, 'DOM element text content match must pass');
      assert.strictEqual(results[2].passed, true, 'Hidden test case must pass');

      // Verify hidden test case masking
      assert.strictEqual(results[2].input, '[Hidden]');
      assert.strictEqual(results[2].expectedOutput, '[Hidden]');
      assert.strictEqual(results[2].actualOutput, '[Hidden]');
      assert.ok(results[2].output.includes('Passed (Hidden Test Case)'));
    });

    it('rejects fake matches residing inside HTML comments', async () => {
      const code = `
        <!-- <div id="secret-element"><input type="password" /></div> -->
        <p>Only a regular paragraph here</p>
      `;

      const testCases = [
        {
          input: '',
          expectedOutput: 'div#secret-element',
          isHidden: false,
        },
      ];

      const results = await CodeRunner.run(code, 'html', testCases);
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].passed, false, 'Commented-out HTML must NOT match DOM selector queries');
    });
  });
});
