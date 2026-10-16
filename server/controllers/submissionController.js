const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const SolvedChallenge = require('../models/SolvedChallenge');
const xpService = require('../services/xpService');
const { emitChallengeCompleted } = require('../services/socketService');
const { success, error } = require('../utils/responseHelper');
const { CodeRunner, detectJSBannedPatterns, detectPyBannedImports } = require('../services/codeRunner');
const logger = require('../utils/logger');

// ─── Security Constants ──────────────────────────────────────────────────────
const MAX_CODE_LENGTH = 50000; // 50KB max code size
const ALLOWED_LANGUAGES = ['javascript', 'python', 'html'];

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

// ─── Main Evaluator ───────────────────────────────────────────────────────────
const evaluateCode = async (code, testCases, language, category, starterCode = '') => {
  return await CodeRunner.run(code, language, testCases, { starterCode, category });
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
    const testResults = await evaluateCode(code, visibleTests, language, challenge.category, challenge.starterCode?.[language] || '');
    if (!Array.isArray(testResults) || testResults.length !== visibleTests.length) {
      return res.status(502).json({ success: false, error: 'Code execution failed: incomplete test case results from runner.' });
    }

    const allPassed = testResults.every(r => r.passed);
    const passedCount = testResults.filter(r => r.passed).length;
    const totalCount = testResults.length;

    success(res, {
      testResults,
      results: testResults,
      passedCount,
      totalCount,
      allPassed,
      isRun: true
    });
  } catch (err) {
    if (err.status === 503 || err.statusCode === 503 || err.code === 'CONCURRENCY_LIMIT_REACHED') {
      return res.status(503).json({ success: false, error: err.message });
    }
    if (err.status === 502 || err.statusCode === 502) {
      return res.status(502).json({ success: false, error: err.message });
    }
    if (err.status === 504 || err.statusCode === 504) {
      return res.status(504).json({ success: false, error: err.message });
    }
    next(err);
  }
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

    let isFirstSolve = false;
    let solvedChallengeDoc = null;
    const testResults = await evaluateCode(code, challenge.testCases, language, challenge.category, challenge.starterCode?.[language] || '');
    if (!Array.isArray(testResults) || testResults.length !== challenge.testCases.length) {
      return res.status(502).json({ success: false, error: 'Code execution failed: incomplete test case results from runner.' });
    }

    const allPassed = testResults.every(r => r.passed);
    const passedCount = testResults.filter(r => r.passed).length;
    const totalCount = testResults.length;
    const status = allPassed ? 'passed' : 'failed';

    if (allPassed) {
      const existingSubmission = await Submission.findOne({ userId: req.userId, challengeId, status: 'passed' });
      if (!existingSubmission) {
        try {
          solvedChallengeDoc = await SolvedChallenge.create({ userId: req.userId, challengeId });
          isFirstSolve = true;
        } catch (err) {
          if (err.code === 11000) {
            isFirstSolve = false;
          } else {
            throw err;
          }
        }
      }
    }

    const xpEarned = isFirstSolve ? challenge.xpReward : 0;

    const submission = await Submission.create({
      userId: req.userId,
      challengeId,
      code,
      language,
      status,
      testResults,
      xpEarned,
    });

    let xpResult = null;
    if (isFirstSolve) {
      try {
        xpResult = await xpService.awardXP(req.userId, challenge.xpReward, 'challenge', challengeId, `Solved: ${challenge.title}`);
        await Challenge.findByIdAndUpdate(challengeId, { $inc: { completionCount: 1, attemptCount: 1 } });
        await User.findByIdAndUpdate(req.userId, { $inc: { challengesSolved: 1 } });
        emitChallengeCompleted(req.userId, challengeId, challenge.xpReward);
      } catch (awardError) {
        logger.error({ err: awardError, userId: req.userId, challengeId }, 'Failed to award XP on first solve; rolling back SolvedChallenge');
        if (solvedChallengeDoc) {
          await SolvedChallenge.deleteOne({ _id: solvedChallengeDoc._id }).catch((e) => {
            logger.error({ err: e }, 'Failed to rollback SolvedChallenge record');
          });
        }
        throw awardError;
      }
    } else {
      await Challenge.findByIdAndUpdate(challengeId, { $inc: { attemptCount: 1 } });
    }

    success(res, {
      submission,
      testResults,
      results: testResults,
      passedCount,
      totalCount,
      xpResult,
      allPassed
    });
  } catch (err) {
    if (err.status === 503 || err.statusCode === 503 || err.code === 'CONCURRENCY_LIMIT_REACHED') {
      return res.status(503).json({ success: false, error: err.message });
    }
    if (err.status === 502 || err.statusCode === 502) {
      return res.status(502).json({ success: false, error: err.message });
    }
    if (err.status === 504 || err.statusCode === 504) {
      return res.status(504).json({ success: false, error: err.message });
    }
    next(err);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({
      userId: req.userId,
      challengeId: req.params.id,
    }).sort({ submittedAt: -1 }).limit(10).lean();
    success(res, { submissions });
  } catch (err) { next(err); }
};

// Internal exports for regression testing
exports._testExports = {
  detectPyBannedImports,
  detectJSBannedPatterns,
};

