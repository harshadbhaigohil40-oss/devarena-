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
    
    let pipeline = [];
    
    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }
    
    pipeline.push({ $sort: { _id: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });
    pipeline.push({ $project: { solution: 0, testCases: 0 } });

    if (req.user) {
      const mongoose = require('mongoose');
      const userId = new mongoose.Types.ObjectId(req.user._id);
      pipeline.push({
        $lookup: {
          from: 'submissions',
          let: { challengeId: '$_id' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $and: [
                    { $eq: ['$challengeId', '$$challengeId'] },
                    { $eq: ['$userId', userId] },
                    { $eq: ['$status', 'passed'] }
                  ]
                }
              }
            },
            { $limit: 1 }
          ],
          as: 'userSubmission'
        }
      });
      pipeline.push({
        $addFields: {
          completed: { $gt: [{ $size: '$userSubmission' }, 0] }
        }
      });
      pipeline.push({ $project: { userSubmission: 0 } });
    }

    const challenges = await Challenge.aggregate(pipeline);
    const total = await Challenge.countDocuments(filter);

    paginated(res, challenges, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

exports.getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findOne({ slug: req.params.slug }).lean();
    if (!challenge) return error(res, 'Challenge not found.', 404);

    // Hide solution from non-admin users
    if (!req.user || req.user.role !== 'admin') {
      delete challenge.solution;
      // Hide hidden test cases
      if (challenge.testCases) {
        challenge.testCases = challenge.testCases.filter(tc => !tc.isHidden);
      }
    }

    success(res, { challenge });
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
