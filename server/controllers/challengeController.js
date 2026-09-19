const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const { success, error, paginated } = require('../utils/responseHelper');

const nodeTagMap = {
  // Algorithm Mastery
  'algo-basics':    ['algorithm-basics', 'arrays','strings','hash-map','hash-set','bit-manipulation','data-types'],
  'algo-search':    ['searching','binary-search'],
  'algo-sort':      ['sorting','merge-sort'],
  'algo-recursion': ['recursion','backtracking','divide-and-conquer'],
  'algo-dp':        ['dynamic-programming'],
  'algo-graphs':    ['graphs','dfs','bfs'],
  'algo-master':    ['algorithm-expert','design'],
  // Frontend
  'fe-html':        ['html-css-layouts'],
  'fe-js':          ['js-dom-manipulation'],
  'fe-responsive':  ['html-css-layouts'],
  'fe-react':       ['hooks','closures'],
  'fe-advanced':    ['state-management','performance'],
  'fe-testing':     ['web-apis'],
  'fe-master':      ['system-ui','design-patterns'],
  // Backend
  'be-node':        ['be-node'],
  'be-express':     ['be-express'],
  'be-db':          ['be-db'],
  'be-auth':        ['be-auth'],
  'be-scale':       ['be-scale'],
  'be-realtime':    ['be-realtime'],
  'be-master':      ['be-master'],
  // System Design
  'sd-basics':      ['sd-basics'],
  'sd-storage':     ['sd-storage'],
  'sd-compute':     ['sd-compute'],
  'sd-distributed': ['sd-distributed'],
  'sd-interview':   ['sd-interview'],
  'sd-cloud':       ['sd-cloud'],
  'sd-master':      ['sd-master'],
};

exports.listChallenges = async (req, res, next) => {
  try {
    const { difficulty, category, search, node, tag, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (node) {
      const mappedTags = nodeTagMap[node.toLowerCase()];
      if (mappedTags && mappedTags.length > 0) {
        filter.tags = { $in: mappedTags };
      } else {
        filter.tags = node;
      }
    }
    if (tag) filter.tags = tag;
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

    // Get next challenge slug for navigation
    const nextChallenge = await Challenge.findOne({ _id: { $gt: challenge._id } })
      .sort({ _id: 1 })
      .select('slug')
      .lean();
    challenge.nextChallengeSlug = nextChallenge ? nextChallenge.slug : null;

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
