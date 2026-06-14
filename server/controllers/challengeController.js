const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const { success, error, paginated } = require('../utils/responseHelper');

exports.listChallenges = async (req, res, next) => {
  try {
    const { difficulty, category, search, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (search) {
      // Handle special alias for "Fundamentals" which isn't present in the old database data
      if (search.toLowerCase().includes('fundamental')) {
        filter.$or = [
          { difficulty: 'beginner', category: 'algorithms' },
          { tags: 'algorithms' }
        ];
      } else {
        // Split search into words and create an OR regex to match any of the terms
        const searchTerms = search.split(/[\s,-]+/).filter(Boolean);
        if (searchTerms.length > 0) {
          // Escape regex special characters in terms, then join with |
          const safeTerms = searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
          const searchRegex = new RegExp(safeTerms.join('|'), 'i');
          filter.$or = [
            { title: searchRegex },
            { tags: searchRegex },
            { category: searchRegex },
            { description: searchRegex }
          ];
        }
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const challenges = await Challenge.find(filter)
      .select('-solution -testCases')
      .sort({ _id: -1 }) // Sort by newest (insertion order reversed) to show a healthy mix
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
