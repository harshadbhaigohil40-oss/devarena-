const Badge = require('../models/Badge');
const badgeService = require('../services/badgeService');
const { success } = require('../utils/responseHelper');

exports.listBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find().sort({ rarity: 1, name: 1 });
    success(res, { badges });
  } catch (err) { next(err); }
};

exports.getUserBadges = async (req, res, next) => {
  try {
    const badges = await badgeService.getUserBadges(req.params.userId || req.userId);
    success(res, { badges });
  } catch (err) { next(err); }
};
