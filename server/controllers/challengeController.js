const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const { success, error, paginated } = require('../utils/responseHelper');

exports.listChallenges = async (req, res, next) => {
  try {
    const { difficulty, category, search, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const challenges = await Challenge.find(filter)
      .select('-solution -testCases')
      .sort({ xpReward: 1, title: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Challenge.countDocuments(filter);

    // If user is logged in, add completion status
    if (req.user) {
      const userSubmissions = await Submission.find({
        userId: req.user._id,
        status: 'passed',
      }).distinct('challengeId');

      const completedSet = new Set(userSubmissions.map(id => id.toString()));
      const challengesWithStatus = challenges.map(c => ({
        ...c.toObject(),
        completed: completedSet.has(c._id.toString()),
      }));

      return paginated(res, challengesWithStatus, total, parseInt(page), parseInt(limit));
    }

    paginated(res, challenges, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

exports.getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findOne({ slug: req.params.slug });
    if (!challenge) return error(res, 'Challenge not found.', 404);

    // Hide solution from non-admin users
    const result = challenge.toObject();
    if (!req.user || req.user.role !== 'admin') {
      delete result.solution;
      // Hide hidden test cases
      result.testCases = result.testCases.filter(tc => !tc.isHidden);
    }

    success(res, { challenge: result });
  } catch (err) { next(err); }
};

exports.createChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create({
      ...req.body,
      createdBy: req.userId,
    });
    success(res, { challenge }, 201);
  } catch (err) { next(err); }
};
