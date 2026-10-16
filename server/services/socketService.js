const { getIO } = require('../config/socket');
const { SOCKET_EVENTS } = require('../utils/constants');
const logger = require('../utils/logger');

const emitToUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
  } catch (e) {
    logger.warn({ err: e, event, userId }, 'Socket emit failed');
  }
};

const emitXPGained = (userId, amount, total, source) => {
  emitToUser(userId, SOCKET_EVENTS.XP_GAINED, { userId, amount, total, source });
};

const emitLevelUp = (userId, newLevel, rewards) => {
  emitToUser(userId, SOCKET_EVENTS.LEVEL_UP, { userId, newLevel, rewards });
};

const emitBadgeUnlocked = (userId, badge) => {
  emitToUser(userId, SOCKET_EVENTS.BADGE_UNLOCKED, { userId, badge });
};

const emitChallengeCompleted = (userId, challengeId, xp) => {
  emitToUser(userId, SOCKET_EVENTS.CHALLENGE_COMPLETED, { userId, challengeId, xp });
};

const emitLeaderboardUpdate = (top10) => {
  try {
    const io = getIO();
    io.emit(SOCKET_EVENTS.LEADERBOARD_UPDATE, { top10 });
  } catch (e) {
    logger.warn({ err: e }, 'Socket emit failed');
  }
};

module.exports = {
  emitToUser,
  emitXPGained,
  emitLevelUp,
  emitBadgeUnlocked,
  emitChallengeCompleted,
  emitLeaderboardUpdate,
};
