const mongoose = require('mongoose');

/**
 * UserBadge model tracks badges earned by users.
 * The compound unique index on (userId, badgeId) enforces strict de-duplication
 * and prevents race conditions under concurrent badge evaluations.
 */
const userBadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true,
    index: true,
  },
  earnedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

module.exports = mongoose.model('UserBadge', userBadgeSchema);
