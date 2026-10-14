const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },

  totalXp: { type: Number, default: 0, index: true },
  weeklyXp: { type: Number, default: 0, index: true },
  monthlyXp: { type: Number, default: 0 },
  challengesSolved: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },

  rank: { type: Number, default: 0, index: true },

  // Denormalized for fast reads
  username: { type: String, default: '' },
  avatar: { type: String, default: '' },
  level: { type: Number, default: 1 },

  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LeaderboardEntry', leaderboardEntrySchema);
