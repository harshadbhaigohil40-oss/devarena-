const BADGE_DEFINITIONS = [
  // Achievement badges
  { name: 'First Blood', description: 'Complete your first challenge', icon: '⚔️', category: 'achievement', rarity: 'common', criteria: { type: 'challenge_count', value: 1 }, xpBonus: 25 },
  { name: 'Problem Solver', description: 'Complete 10 challenges', icon: '🧩', category: 'achievement', rarity: 'common', criteria: { type: 'challenge_count', value: 10 }, xpBonus: 50 },
  { name: 'Challenge Master', description: 'Complete 50 challenges', icon: '🏆', category: 'achievement', rarity: 'rare', criteria: { type: 'challenge_count', value: 50 }, xpBonus: 100 },
  { name: 'Code Legend', description: 'Complete 100 challenges', icon: '👑', category: 'achievement', rarity: 'epic', criteria: { type: 'challenge_count', value: 100 }, xpBonus: 250 },
  { name: 'Grandmaster', description: 'Complete 500 challenges', icon: '🌟', category: 'achievement', rarity: 'legendary', criteria: { type: 'challenge_count', value: 500 }, xpBonus: 500 },

  // XP badges
  { name: 'Getting Started', description: 'Earn 100 XP', icon: '🌱', category: 'achievement', rarity: 'common', criteria: { type: 'xp_threshold', value: 100 }, xpBonus: 10 },
  { name: 'Rising Star', description: 'Earn 1,000 XP', icon: '⭐', category: 'achievement', rarity: 'common', criteria: { type: 'xp_threshold', value: 1000 }, xpBonus: 50 },
  { name: 'Power Player', description: 'Earn 5,000 XP', icon: '💪', category: 'achievement', rarity: 'rare', criteria: { type: 'xp_threshold', value: 5000 }, xpBonus: 100 },
  { name: 'XP Monster', description: 'Earn 25,000 XP', icon: '🔥', category: 'achievement', rarity: 'epic', criteria: { type: 'xp_threshold', value: 25000 }, xpBonus: 250 },
  { name: 'Legendary Coder', description: 'Earn 100,000 XP', icon: '💎', category: 'achievement', rarity: 'legendary', criteria: { type: 'xp_threshold', value: 100000 }, xpBonus: 500 },

  // Streak badges
  { name: 'On a Roll', description: 'Maintain a 3-day streak', icon: '🔥', category: 'streak', rarity: 'common', criteria: { type: 'streak_days', value: 3 }, xpBonus: 15 },
  { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '📅', category: 'streak', rarity: 'common', criteria: { type: 'streak_days', value: 7 }, xpBonus: 50 },
  { name: 'Dedicated Dev', description: 'Maintain a 14-day streak', icon: '💻', category: 'streak', rarity: 'rare', criteria: { type: 'streak_days', value: 14 }, xpBonus: 100 },
  { name: 'Month Master', description: 'Maintain a 30-day streak', icon: '🗓️', category: 'streak', rarity: 'epic', criteria: { type: 'streak_days', value: 30 }, xpBonus: 200 },
  { name: 'Unstoppable', description: 'Maintain a 100-day streak', icon: '⚡', category: 'streak', rarity: 'legendary', criteria: { type: 'streak_days', value: 100 }, xpBonus: 500 },

  // Project badges
  { name: 'Builder', description: 'Showcase your first project', icon: '🏗️', category: 'community', rarity: 'common', criteria: { type: 'project_count', value: 1 }, xpBonus: 25 },
  { name: 'Portfolio Pro', description: 'Showcase 5 projects', icon: '📁', category: 'community', rarity: 'rare', criteria: { type: 'project_count', value: 5 }, xpBonus: 100 },
  { name: 'Open Source Hero', description: 'Showcase 10 projects', icon: '🦸', category: 'community', rarity: 'epic', criteria: { type: 'project_count', value: 10 }, xpBonus: 200 },

  // Skill badges
  { name: 'Polyglot', description: 'Reach level 3 in 3 different skills', icon: '🌐', category: 'skill', rarity: 'rare', criteria: { type: 'skill_level', value: 3 }, xpBonus: 150 },
  { name: 'Specialist', description: 'Reach level 5 in any skill', icon: '🎯', category: 'skill', rarity: 'epic', criteria: { type: 'skill_level', value: 5 }, xpBonus: 250 },
];

module.exports = { BADGE_DEFINITIONS };
