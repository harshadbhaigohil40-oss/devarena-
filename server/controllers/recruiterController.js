const User = require('../models/User');
const { toPublicProfile } = require('../models/User');
const { success, error, paginated } = require('../utils/responseHelper');

const { escapeRegex, clampPagination } = require('../utils/queryHelper');

exports.searchTalent = async (req, res, next) => {
  try {
    const { skill, minLevel, minXP, location } = req.query;
    const { page, limit, skip } = clampPagination(req.query, 20, 100);
    const filter = { role: 'developer' };

    const parsedMinLevel = parseInt(minLevel, 10);
    if (Number.isFinite(parsedMinLevel)) filter.level = { $gte: parsedMinLevel };

    const parsedMinXP = parseInt(minXP, 10);
    if (Number.isFinite(parsedMinXP)) filter.xp = { $gte: parsedMinXP };

    if (location && typeof location === 'string') {
      filter.location = { $regex: escapeRegex(location), $options: 'i' };
    }
    if (skill && typeof skill === 'string') {
      filter['topSkills.name'] = { $regex: escapeRegex(skill), $options: 'i' };
    }

    const developers = await User.find(filter)
      .select('username avatar bio level xp topSkills recentBadges location githubUrl challengesSolved streak')
      .sort({ xp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);
    paginated(res, developers, total, page, limit);
  } catch (err) { next(err); }
};

exports.viewCandidate = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -email');
    if (!user || user.role !== 'developer') {
      return error(res, 'Developer not found.', 404);
    }
    success(res, { developer: toPublicProfile(user) });
  } catch (err) { next(err); }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const totalDevelopers = await User.countDocuments({ role: 'developer' });
    const avgLevel = await User.aggregate([
      { $match: { role: 'developer' } },
      { $group: { _id: null, avgLevel: { $avg: '$level' }, avgXP: { $avg: '$xp' } } },
    ]);

    const topSkills = await User.aggregate([
      { $match: { role: 'developer' } },
      { $unwind: '$topSkills' },
      { $group: { _id: '$topSkills.name', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    success(res, {
      totalDevelopers,
      avgLevel: avgLevel[0]?.avgLevel || 0,
      avgXP: avgLevel[0]?.avgXP || 0,
      topSkills,
    });
  } catch (err) { next(err); }
};
