const User = require('../models/User');
const { success, error, paginated } = require('../utils/responseHelper');

exports.searchTalent = async (req, res, next) => {
  try {
    const { skill, minLevel, minXP, location, page = 1, limit = 20 } = req.query;
    const filter = { role: 'developer' };

    if (minLevel) filter.level = { $gte: parseInt(minLevel) };
    if (minXP) filter.xp = { $gte: parseInt(minXP) };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (skill) filter['topSkills.name'] = { $regex: skill, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const developers = await User.find(filter)
      .select('username avatar bio level xp topSkills recentBadges location githubUrl challengesSolved streak')
      .sort({ xp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);
    paginated(res, developers, total, parseInt(page), parseInt(limit));
  } catch (err) { next(err); }
};

exports.viewCandidate = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash -email');
    if (!user || user.role !== 'developer') {
      return error(res, 'Developer not found.', 404);
    }
    success(res, { developer: user });
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
