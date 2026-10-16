const mongoose = require('mongoose');

/**
 * SolvedChallenge model provides an idempotent, concurrency-safe marker for
 * recording a user's first successful solve of a challenge.
 * The compound unique index on (userId, challengeId) guarantees that concurrent
 * submissions cannot double-award solve XP or duplicate solved counts.
 */
const solvedChallengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    index: true,
  },
  solvedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

solvedChallengeSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

module.exports = mongoose.model('SolvedChallenge', solvedChallengeSchema);
