const User = require('../models/User');
const XPEvent = require('../models/XPEvent');
const { levelFromXP, XP_REWARDS, getStreakMultiplier } = require('../../shared/xpConfig');
const { emitXPGained, emitLevelUp } = require('./socketService');
const badgeService = require('./badgeService');
const leaderboardService = require('./leaderboardService');

const awardXP = async (userId, amount, source, sourceId = null, description = '') => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  // Apply streak multiplier
  const multiplier = getStreakMultiplier(user.streak);
  const finalAmount = Math.floor(amount * multiplier);

  // Update user XP
  const previousLevel = user.level;
  user.xp += finalAmount;
  user.level = levelFromXP(user.xp);
  await user.save();

  // Log XP event
  await XPEvent.create({
    userId,
    amount: finalAmount,
    source,
    sourceId,
    description: description || `Earned ${finalAmount} XP from ${source}`,
  });

  // Emit real-time XP notification
  emitXPGained(userId, finalAmount, user.xp, source);

  // Check for level up
  if (user.level > previousLevel) {
    emitLevelUp(userId, user.level, { xpBonus: 50 * user.level });
  }

  // Check for new badges
  await badgeService.evaluateBadges(userId);

  // Update leaderboard
  await leaderboardService.updateEntry(userId);

  return { xpEarned: finalAmount, totalXp: user.xp, level: user.level, leveledUp: user.level > previousLevel };
};

const updateStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let diffDays = 0;
  if (user.lastActiveDate) {
    const lastActive = new Date(user.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);

    diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
    } else if (diffDays > 1) {
      user.streak = 1;
    }
  } else {
    user.streak = 1;
  }

  user.lastActiveDate = today;
  await user.save();

  // Award daily login XP
  if (diffDays === 1 || diffDays > 1 || !user.lastActiveDate) {
    await module.exports.awardXP(userId, XP_REWARDS.daily_login, 'daily_login', null, 'Daily login bonus');
  }

  return user.streak;
};

module.exports = { awardXP, updateStreak };
