const leaderboardService = require('../services/leaderboardService');
const { success } = require('../utils/responseHelper');

exports.getLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all', page = 1, limit = 20 } = req.query;
    const result = await leaderboardService.getLeaderboard(period, parseInt(page), parseInt(limit));
    success(res, result);
  } catch (err) { next(err); }
};

exports.getUserRank = async (req, res, next) => {
  try {
    const entry = await leaderboardService.getUserRank(req.params.userId);
    success(res, { entry });
  } catch (err) { next(err); }
};
