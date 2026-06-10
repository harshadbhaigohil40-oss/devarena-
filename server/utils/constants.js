const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced', 'expert'];
const CATEGORIES = ['algorithms', 'data-structures', 'frontend', 'backend', 'database', 'system-design', 'devops'];

const SOCKET_EVENTS = {
  XP_GAINED: 'xp:gained',
  LEVEL_UP: 'level:up',
  BADGE_UNLOCKED: 'badge:unlocked',
  CHALLENGE_COMPLETED: 'challenge:completed',
  LEADERBOARD_UPDATE: 'leaderboard:update',
  USER_ONLINE: 'user:online',
};

module.exports = { DIFFICULTY_ORDER, CATEGORIES, SOCKET_EVENTS };
