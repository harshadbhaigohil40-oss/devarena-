const LeaderboardEntry = require('../models/LeaderboardEntry');
const User = require('../models/User');
const SystemLock = require('../models/SystemLock');
const cron = require('node-cron');
const logger = require('../utils/logger');
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

/**
 * Atomic lock acquisition for scheduled periodic resets across multiple instances.
 * Guarantees that only ONE worker executes the reset per period cycle.
 */
const acquireResetLock = async (lockId, thresholdDate, now = new Date()) => {
  try {
    const created = await SystemLock.create({
      _id: lockId,
      lastResetAt: now,
      lockedBy: `${process.pid}-${Date.now()}`,
      updatedAt: now,
    }).catch((err) => {
      if (err.code === 11000) return null; // Already exists
      throw err;
    });

    if (created) return true;

    // Document exists: update atomically ONLY IF lastResetAt < thresholdDate or null
    const updated = await SystemLock.findOneAndUpdate(
      {
        _id: lockId,
        $or: [
          { lastResetAt: { $lt: thresholdDate } },
          { lastResetAt: null },
        ],
      },
      {
        $set: {
          lastResetAt: now,
          lockedBy: `${process.pid}-${Date.now()}`,
          updatedAt: now,
        },
      },
      { new: true }
    );

    return Boolean(updated);
  } catch (err) {
    logger.error({ err, lockId }, 'Failed to acquire periodic reset lock');
    return false;
  }
};

const resetWeeklyXPWithLock = async (now = new Date()) => {
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const acquired = await module.exports.acquireResetLock('weekly_xp_reset', startOfWeek, now);
  if (!acquired) {
    logger.info('Weekly XP reset already executed or locked by another worker. Skipping.');
    return false;
  }

  logger.info('Acquired lock. Executing weekly XP reset...');
  await module.exports.resetWeeklyXP();
  logger.info('Weekly XP reset completed successfully.');
  return true;
};

const resetMonthlyXPWithLock = async (now = new Date()) => {
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  const acquired = await module.exports.acquireResetLock('monthly_xp_reset', startOfMonth, now);
  if (!acquired) {
    logger.info('Monthly XP reset already executed or locked by another worker. Skipping.');
    return false;
  }

  logger.info('Acquired lock. Executing monthly XP reset...');
  await module.exports.resetMonthlyXP();
  logger.info('Monthly XP reset completed successfully.');
  return true;
};

let cronJobs = [];

const initScheduler = () => {
  // Weekly XP reset: every Sunday at 00:00 (0 0 * * 0)
  const weeklyJob = cron.schedule('0 0 * * 0', async () => {
    try {
      await resetWeeklyXPWithLock();
    } catch (err) {
      logger.error({ err }, 'Error in scheduled weekly XP reset');
    }
  });

  // Monthly XP reset: 1st of every month at 00:00 (0 0 1 * *)
  const monthlyJob = cron.schedule('0 0 1 * *', async () => {
    try {
      await resetMonthlyXPWithLock();
    } catch (err) {
      logger.error({ err }, 'Error in scheduled monthly XP reset');
    }
  });

  cronJobs.push(weeklyJob, monthlyJob);
  logger.info('Leaderboard XP reset cron schedules initialized');
  return { weeklyJob, monthlyJob };
};

const stopScheduler = () => {
  cronJobs.forEach((job) => job.stop());
  cronJobs = [];
};

module.exports = {
  updateEntry,
  recalculateRanks,
  getLeaderboard,
  getUserRank,
  resetWeeklyXP,
  resetMonthlyXP,
  acquireResetLock,
  resetWeeklyXPWithLock,
  resetMonthlyXPWithLock,
  initScheduler,
  stopScheduler,
};
