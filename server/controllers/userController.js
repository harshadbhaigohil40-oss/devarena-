const User = require('../models/User');
const XPEvent = require('../models/XPEvent');
const Submission = require('../models/Submission');
const { success, error } = require('../utils/responseHelper');
const { progressToNextLevel, xpForLevel } = require('../utils/levelCalculator');
const badgeService = require('../services/badgeService');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return error(res, 'User not found.', 404);
    success(res, { user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['bio', 'location', 'githubUrl', 'linkedinUrl', 'portfolioUrl', 'avatar', 'company', 'hiringFor'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-passwordHash');
    success(res, { user });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return error(res, 'User not found.', 404);

    const challengesSolved = await Submission.countDocuments({ userId, status: 'passed' });
    const totalSubmissions = await Submission.countDocuments({ userId });
    const progress = progressToNextLevel(user.xp);
    const xpNeeded = xpForLevel(user.level);

    const recentXP = await XPEvent.find({ userId }).sort({ createdAt: -1 }).limit(200);

    success(res, {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      challengesSolved,
      totalSubmissions,
      progressToNext: progress,
      xpForNextLevel: xpNeeded,
      recentBadges: user.recentBadges,
      topSkills: user.topSkills,
      recentXP,
    });
  } catch (err) { next(err); }
};

exports.getBadges = async (req, res, next) => {
  try {
    const badges = await badgeService.getUserBadges(req.params.id);
    success(res, { badges });
  } catch (err) { next(err); }
};

exports.getXPHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const events = await XPEvent.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await XPEvent.countDocuments({ userId: req.params.id });

    success(res, { events, total, page, limit });
  } catch (err) { next(err); }
};
