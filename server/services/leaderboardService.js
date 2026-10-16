const LeaderboardEntry = require('../models/LeaderboardEntry');
const User = require('../models/User');
const { emitLeaderboardUpdate } = require('./socketService');
const { clampPagination } = require('../utils/queryHelper');

/**
 * Updates a developer's leaderboard entry without recalculating global ranks
 * on every single XP award, eliminating hot-spot database contention.
 */
const updateEntry = async (userId, xpIncrement = 0) => {
  const user = await User.findById(userId).select('xp challengesSolved streak username avatar level role');
  if (!user || user.role !== 'developer') return;

  const baseUpdate = {
    userId,
    totalXp: user.xp,
    challengesSolved: user.challengesSolved || 0,
    currentStreak: user.streak || 0,
    username: user.username,
    avatar: user.avatar,
    level: user.level,
    updatedAt: new Date(),
  };

  if (xpIncrement > 0) {
    await LeaderboardEntry.findOneAndUpdate(
      { userId },
      {
        $set: baseUpdate,
        $inc: { weeklyXp: xpIncrement, monthlyXp: xpIncrement },
      },
      { upsert: true, new: true }
    );
  } else {
    await LeaderboardEntry.findOneAndUpdate(
      { userId },
      { $set: baseUpdate },
      { upsert: true, new: true }
    );
  }
};

/**
 * Recalculate ranks across top entries.
 * Designed to be called periodically (cron/scheduled job) rather than on every XP award.
 */
const recalculateRanks = async () => {
  const entries = await LeaderboardEntry.find().sort({ totalXp: -1 }).limit(100);
  const bulkOps = entries.map((entry, index) => ({
    updateOne: {
      filter: { _id: entry._id },
      update: { rank: index + 1 },
    },
  }));

  if (bulkOps.length > 0) {
    await LeaderboardEntry.bulkWrite(bulkOps);
  }

  // Emit top 10 update
  const top10 = entries.slice(0, 10);
  emitLeaderboardUpdate(top10);
};

/**
 * Returns leaderboard entries with pagination clamped to max 100.
 * Dynamic ranks are computed on read via (skip + index + 1).
 */
const getLeaderboard = async (period = 'all', page = 1, limit = 20) => {
  const { limit: clampedLimit, skip } = clampPagination({ page, limit }, 20, 100);
  const sortField = period === 'weekly' ? 'weeklyXp' : period === 'monthly' ? 'monthlyXp' : 'totalXp';

  const [entries, total] = await Promise.all([
    LeaderboardEntry.find()
      .sort({ [sortField]: -1 })
      .skip(skip)
      .limit(clampedLimit)
      .lean(),
    LeaderboardEntry.countDocuments(),
  ]);

  const rankedEntries = entries.map((entry, index) => ({
    ...entry,
    rank: skip + index + 1,
  }));

  return { entries: rankedEntries, total };
};

/**
 * Computes rank on read via countDocuments({ totalXp: { $gt: x } }).
 */
const getUserRank = async (userId) => {
  const entry = await LeaderboardEntry.findOne({ userId }).lean();
  if (!entry) return { rank: 0, totalXp: 0 };

  const higherCount = await LeaderboardEntry.countDocuments({ totalXp: { $gt: entry.totalXp } });
  return {
    ...entry,
    rank: higherCount + 1,
  };
};

/**
 * Scheduled helpers for resetting periodic XP pools.
 */
const resetWeeklyXP = async () => {
  await LeaderboardEntry.updateMany({}, { $set: { weeklyXp: 0 } });
};

const resetMonthlyXP = async () => {
  await LeaderboardEntry.updateMany({}, { $set: { monthlyXp: 0 } });
};

module.exports = {
  updateEntry,
  recalculateRanks,
  getLeaderboard,
  getUserRank,
  resetWeeklyXP,
  resetMonthlyXP,
};
