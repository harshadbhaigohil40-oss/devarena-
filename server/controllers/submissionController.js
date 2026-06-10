const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const { awardXP } = require('../services/xpService');
const { emitChallengeCompleted } = require('../services/socketService');
const { success, error } = require('../utils/responseHelper');

// Simple code evaluation (simulated for MVP)
const evaluateCode = (code, testCases, language) => {
  const results = testCases.map((tc, index) => {
    try {
      // Simple evaluation: check if the code contains expected patterns
      // In production, this would use a sandboxed execution engine
      const containsLogic = code.length > 20 && !code.match(/^\s*$/);
      const passed = containsLogic && (
        code.includes('return') ||
        code.includes('console.log') ||
        code.includes('print') ||
        code.includes('function') ||
        code.includes('=>')
      );

      return {
        testCaseIndex: index,
        passed,
        output: passed ? tc.expectedOutput : 'Incorrect output',
        executionTime: Math.floor(Math.random() * 50) + 5,
      };
    } catch (e) {
      return {
        testCaseIndex: index,
        passed: false,
        output: e.message,
        executionTime: 0,
      };
    }
  });

  return results;
};

exports.submitSolution = async (req, res, next) => {
  try {
    const { code, language = 'javascript' } = req.body;
    const challengeId = req.params.id;

    if (!code) return error(res, 'Code is required.', 400);

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return error(res, 'Challenge not found.', 404);

    // Check if already solved
    const alreadySolved = await Submission.findOne({
      userId: req.userId,
      challengeId,
      status: 'passed',
    });

    // Evaluate code
    const testResults = evaluateCode(code, challenge.testCases, language);
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
