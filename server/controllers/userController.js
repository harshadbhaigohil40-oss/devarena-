const User = require('../models/User');
const { toPublicProfile } = require('../models/User');
const XPEvent = require('../models/XPEvent');
const Submission = require('../models/Submission');
const { success, error } = require('../utils/responseHelper');
const { progressToNextLevel, xpForLevel } = require('../utils/levelCalculator');
const badgeService = require('../services/badgeService');

const { z } = require('zod');
const { isValidHttpUrl } = require('../utils/urlHelper');

const urlSchema = z
  .string()
  .max(500, 'URL cannot exceed 500 characters')
  .refine((val) => !val || isValidHttpUrl(val), {
    message: 'Must be a valid http or https URL',
  })
  .optional();

const updateProfileSchema = z.object({
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  location: z.string().max(100, 'Location cannot exceed 100 characters').optional(),
  company: z.string().max(100, 'Company cannot exceed 100 characters').optional(),
  avatar: urlSchema,
  githubUrl: urlSchema,
  linkedinUrl: urlSchema,
  portfolioUrl: urlSchema,
  hiringFor: z
    .array(z.string().max(50, 'Each hiring role cannot exceed 50 characters'))
    .max(20, 'Cannot specify more than 20 hiring roles')
    .optional(),
});

exports.updateProfileSchema = updateProfileSchema;

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return error(res, 'User not found.', 404);
    success(res, { user: toPublicProfile(user) });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const parseResult = updateProfileSchema.safeParse(req.body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join(', ');
      return error(res, errorMsg, 400);
    }

    const updates = parseResult.data;
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    if (!user) return error(res, 'User not found.', 404);
    success(res, { user: toPublicProfile(user) });
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return error(res, 'User not found.', 404);

    const [challengesSolved, totalSubmissions, recentXP] = await Promise.all([
      Submission.countDocuments({ userId, status: 'passed' }),
      Submission.countDocuments({ userId }),
      XPEvent.find({ userId }).sort({ createdAt: -1 }).limit(200).lean()
    ]);

    const progress = progressToNextLevel(user.xp);
    const xpNeeded = xpForLevel(user.level);

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

const { clampPagination } = require('../utils/queryHelper');

exports.getXPHistory = async (req, res, next) => {
  try {
    const { page, limit, skip } = clampPagination(req.query, 20, 100);

    const [events, total] = await Promise.all([
      XPEvent.find({ userId: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      XPEvent.countDocuments({ userId: req.params.id })
    ]);

    success(res, { events, total, page, limit });
  } catch (err) { next(err); }
};
