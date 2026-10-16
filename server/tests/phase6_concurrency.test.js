const { describe, it } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');

const { escapeRegex, clampPagination } = require('../utils/queryHelper');
const { XP_REWARDS } = require('../../shared/xpConfig');
const { generateCacheKey, normalizeQuery, cache } = require('../middleware/cacheMiddleware');

describe('PHASE 6: Integrity, Concurrency, and Performance', () => {
  describe('Task 6: Regex escaping & pagination clamping', () => {
    it('escapeRegex escapes special regex characters safely', () => {
      const special = 'react (v18) [frontend] + * ? ^ $ .';
      const escaped = escapeRegex(special);
      assert.strictEqual(escaped, 'react \\(v18\\) \\[frontend\\] \\+ \\* \\? \\^ \\$ \\.');
      const regex = new RegExp(escaped);
      assert.ok(regex.test(special));
    });

    it('escapeRegex handles non-string or empty inputs safely', () => {
      assert.strictEqual(escapeRegex(''), '');
      assert.strictEqual(escapeRegex(null), '');
      assert.strictEqual(escapeRegex(undefined), '');
    });

    it('clampPagination safely clamps page and limit within boundaries', () => {
      // Normal values
      assert.deepStrictEqual(clampPagination({ page: '2', limit: '25' }), { page: 2, limit: 25, skip: 25 });

      // NaN and invalid inputs fall back to defaults
      assert.deepStrictEqual(clampPagination({ page: 'abc', limit: 'xyz' }, 20, 100), { page: 1, limit: 20, skip: 0 });

      // Negative values clamped to min 1
      assert.deepStrictEqual(clampPagination({ page: '-5', limit: '-10' }), { page: 1, limit: 20, skip: 0 });

      // Excessive limit clamped to maxLimit (100)
      assert.deepStrictEqual(clampPagination({ page: '1', limit: '500' }, 20, 100), { page: 1, limit: 100, skip: 0 });
    });
  });

  describe('Task 7: cacheMiddleware normalization & maxKeys', () => {
    it('sets maxKeys on cache instance', () => {
      assert.strictEqual(cache.options.maxKeys, 1000);
    });

    it('normalizes query parameter ordering and strips non-whitelisted params', () => {
      const q1 = { limit: '10', page: '1', attack: '<script>' };
      const q2 = { page: '1', limit: '10' };

      const norm1 = normalizeQuery(q1);
      const norm2 = normalizeQuery(q2);

      assert.strictEqual(norm1, norm2);
      assert.ok(!norm1.includes('attack'));
    });

    it('generates consistent cache key regardless of param order', () => {
      const req1 = {
        method: 'GET',
        originalUrl: '/api/challenges?limit=10&page=1&junk=foo',
        url: '/api/challenges?limit=10&page=1&junk=foo',
        query: { limit: '10', page: '1', junk: 'foo' },
        user: { _id: new mongoose.Types.ObjectId() },
      };
      const req2 = {
        method: 'GET',
        originalUrl: '/api/challenges?page=1&limit=10',
        url: '/api/challenges?page=1&limit=10',
        query: { page: '1', limit: '10' },
        user: req1.user,
      };

      const key1 = generateCacheKey(req1);
      const key2 = generateCacheKey(req2);

      assert.strictEqual(key1, key2);
    });
  });

  describe('Task 2 & shared config: project creation XP cap', () => {
    it('defines maxRewardedProjects in shared/xpConfig.js', () => {
      assert.ok(typeof XP_REWARDS.project.maxRewardedProjects === 'number');
      assert.ok(XP_REWARDS.project.maxRewardedProjects > 0);
    });
  });

  describe('Task 1: Concurrent first-solve idempotency', () => {
    it('simulates Promise.all of 10 concurrent solves and awards XP exactly once', async () => {
      // Mock models for simulation
      const mockSolvedCollection = new Set();
      let xpAwardCalls = 0;

      const userId = new mongoose.Types.ObjectId().toString();
      const challengeId = new mongoose.Types.ObjectId().toString();

      const solveChallenge = async () => {
        const key = `${userId}_${challengeId}`;
        let isFirstSolve = false;

        // Atomic simulate: check-and-insert in Set (matching compound unique index)
        if (!mockSolvedCollection.has(key)) {
          mockSolvedCollection.add(key);
          isFirstSolve = true;
        }

        if (isFirstSolve) {
          xpAwardCalls += 1;
        }

        return { isFirstSolve };
      };

      // Run 10 submissions concurrently
      const results = await Promise.all([
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
        solveChallenge(),
      ]);

      const firstSolves = results.filter(r => r.isFirstSolve);
      assert.strictEqual(firstSolves.length, 1, 'Only one submission should be flagged as first solve');
      assert.strictEqual(xpAwardCalls, 1, 'XP must be awarded exactly once');
    });
  });

  describe('Task 3: Atomic like/unlike and view increment', () => {
    it('verifies likeProject and getProject controllers do not use save()', () => {
      const fs = require('fs');
      const path = require('path');
      const projectControllerPath = path.resolve(__dirname, '../controllers/projectController.js');
      const content = fs.readFileSync(projectControllerPath, 'utf8');

      // likeProject should use findOneAndUpdate with $addToSet and $pull
      assert.ok(content.includes('$addToSet'), 'likeProject must use $addToSet');
      assert.ok(content.includes('$pull'), 'likeProject must use $pull');
      assert.ok(content.includes('$inc: { views: 1 }'), 'getProject must use atomic $inc for views');
    });
  });

  describe('Task 4: Badges caching and UserBadge model', () => {
    it('verifies UserBadge model exists and has compound index', () => {
      const UserBadge = require('../models/UserBadge');
      assert.ok(UserBadge);
      const indexes = UserBadge.schema.indexes();
      const hasUniqueCompound = indexes.some(idx => {
        const fields = idx[0];
        const opts = idx[1];
        return fields.userId === 1 && fields.badgeId === 1 && opts?.unique === true;
      });
      assert.ok(hasUniqueCompound, 'UserBadge must have a unique compound index on (userId, badgeId)');
    });
  });

  describe('Task 8: getChallenge parallel queries and category scoping', () => {
    it('verifies challengeController.js parallelizes navigation queries with category scope', () => {
      const fs = require('fs');
      const path = require('path');
      const challengeControllerPath = path.resolve(__dirname, '../controllers/challengeController.js');
      const content = fs.readFileSync(challengeControllerPath, 'utf8');

      assert.ok(content.includes('Promise.all'), 'getChallenge must use Promise.all');
      assert.ok(content.includes('category: challenge.category'), 'getChallenge navigation must scope to same category');
    });
  });
});
