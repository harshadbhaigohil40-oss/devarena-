// XP required for each level: level N requires baseXP * N^exponent total XP
const XP_CONFIG = {
  baseXP: 100,
  exponent: 1.5,
  maxLevel: 100,
};

// XP rewards by source
const XP_REWARDS = {
  challenge: {
    beginner: 50,
    intermediate: 100,
    advanced: 200,
    expert: 400,
  },
  project: {
    create: 150,
    featured: 500,
  },
  streak: {
    daily: 10,
    weekly_bonus: 50,    // 7-day streak
    monthly_bonus: 200,  // 30-day streak
  },
  daily_login: 5,
  first_submission: 25,
  badge_bonus: {
    common: 25,
    rare: 50,
    epic: 100,
    legendary: 250,
  },
};

// Streak multipliers
const STREAK_MULTIPLIERS = {
  3: 1.1,   // 3-day streak = 10% bonus
  7: 1.25,  // 7-day streak = 25% bonus
  14: 1.5,  // 14-day streak = 50% bonus
  30: 2.0,  // 30-day streak = 100% bonus
};

// Calculate XP required for a given level
const xpForLevel = (level) => {
  return Math.floor(XP_CONFIG.baseXP * Math.pow(level, XP_CONFIG.exponent));
};

// Calculate level from total XP
const levelFromXP = (totalXP) => {
  let level = 1;
  let xpNeeded = 0;
  while (level < XP_CONFIG.maxLevel) {
    xpNeeded += xpForLevel(level);
    if (totalXP < xpNeeded) break;
    level++;
  }
  return level;
};

// Calculate progress percentage to next level
const progressToNextLevel = (totalXP) => {
  const currentLevel = levelFromXP(totalXP);
  let xpAtCurrentLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    xpAtCurrentLevel += xpForLevel(i);
  }
  const xpIntoLevel = totalXP - xpAtCurrentLevel;
  const xpNeededForNext = xpForLevel(currentLevel);
  return Math.min((xpIntoLevel / xpNeededForNext) * 100, 100);
};

// Get streak multiplier
const getStreakMultiplier = (streakDays) => {
  let multiplier = 1.0;
  for (const [days, mult] of Object.entries(STREAK_MULTIPLIERS)) {
    if (streakDays >= parseInt(days)) {
      multiplier = mult;
    }
  }
  return multiplier;
};

module.exports = {
  XP_CONFIG,
  XP_REWARDS,
  STREAK_MULTIPLIERS,
  xpForLevel,
  levelFromXP,
  progressToNextLevel,
  getStreakMultiplier,
};
