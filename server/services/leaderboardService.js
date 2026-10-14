const LeaderboardEntry = require('../models/LeaderboardEntry');
const User = require('../models/User');
const { emitLeaderboardUpdate } = require('./socketService');

const updateEntry = async (userId) => {
  const user = await User.findById(userId);
  if (!user || user.role !== 'developer') return;

  await LeaderboardEntry.findOneAndUpdate(
    { userId },
    {
      userId,
      totalXp: user.xp,
      challengesSolved: user.challengesSolved || 0,
      currentStreak: user.streak,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  // Recalculate ranks for top users
  await recalculateRanks();
};

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

const getLeaderboard = async (period = 'all', page = 1, limit = 20) => {
  const sortField = period === 'weekly' ? 'weeklyXp' : period === 'monthly' ? 'monthlyXp' : 'totalXp';
  const skip = (page - 1) * limit;

  const entries = await LeaderboardEntry.find()
    .sort({ [sortField]: -1 })
    .skip(skip)
    .limit(limit);

  const total = await LeaderboardEntry.countDocuments();

  return { entries, total };
};

const getUserRank = async (userId) => {
  const entry = await LeaderboardEntry.findOne({ userId });
  if (!entry) return { rank: 0, totalXp: 0 };
  return entry;
};

module.exports = { updateEntry, recalculateRanks, getLeaderboard, getUserRank };
