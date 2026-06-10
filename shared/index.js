const { ROLES, PERMISSIONS, hasPermission } = require('./roles');
const { XP_CONFIG, XP_REWARDS, STREAK_MULTIPLIERS, xpForLevel, levelFromXP, progressToNextLevel, getStreakMultiplier } = require('./xpConfig');
const { BADGE_DEFINITIONS } = require('./badgeDefinitions');

module.exports = {
  ROLES, PERMISSIONS, hasPermission,
  XP_CONFIG, XP_REWARDS, STREAK_MULTIPLIERS, xpForLevel, levelFromXP, progressToNextLevel, getStreakMultiplier,
  BADGE_DEFINITIONS,
};
