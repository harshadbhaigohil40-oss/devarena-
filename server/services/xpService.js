const User = require('../models/User');
const XPEvent = require('../models/XPEvent');
const { levelFromXP, XP_REWARDS, getStreakMultiplier } = require('../../shared/xpConfig');
const { emitXPGained, emitLevelUp } = require('./socketService');
const badgeService = require('./badgeService');
const leaderboardService = require('./leaderboardService');

/**
 * Awards XP atomically using findByIdAndUpdate with $inc to eliminate
 * read-modify-write race conditions under concurrent requests.
 */
const awardXP = async (userId, amount, source, sourceId = null, description = '') => {
  const currentUser = await User.findById(userId).select('streak level xp');
  if (!currentUser) throw new Error('User not found');

  // Apply streak multiplier
  const multiplier = getStreakMultiplier(currentUser.streak || 0);
  const finalAmount = Math.floor(amount * multiplier);
  const previousLevel = currentUser.level || 1;

  // Atomic update of user XP
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { xp: finalAmount } },
    { new: true }
  );

  // Recompute level based on total XP
  const newLevel = levelFromXP(updatedUser.xp);
  if (newLevel !== updatedUser.level) {
    updatedUser.level = newLevel;
    await User.findByIdAndUpdate(userId, { level: newLevel });
  }

  // Log XP event
  await XPEvent.create({
    userId,
    amount: finalAmount,
    source,
    sourceId,
    description: description || `Earned ${finalAmount} XP from ${source}`,
  });

  // Emit real-time XP notification
  emitXPGained(userId, finalAmount, updatedUser.xp, source);

  // Check for level up
  if (newLevel > previousLevel) {
    emitLevelUp(userId, newLevel, { xpBonus: 50 * newLevel });
  }

  // Check for new badges
  await badgeService.evaluateBadges(userId);

  // Update leaderboard entry (per-user update without recalculating all ranks)
  await leaderboardService.updateEntry(userId, finalAmount);

  return {
    xpEarned: finalAmount,
    totalXp: updatedUser.xp,
    level: newLevel,
    leveledUp: newLevel > previousLevel,
  };
};

const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let diffDays = 0;
  let newStreak = user.streak || 0;
  if (user.lastActiveDate) {
    const lastActive = new Date(user.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  await User.findByIdAndUpdate(userId, {
    streak: newStreak,
    lastActiveDate: today,
  });

  // Award daily login XP
  if (diffDays === 1 || diffDays > 1 || !user.lastActiveDate) {
    await module.exports.awardXP(userId, XP_REWARDS.daily_login, 'daily_login', null, 'Daily login bonus');
  }

  return newStreak;
};

module.exports = { awardXP, updateStreak };
