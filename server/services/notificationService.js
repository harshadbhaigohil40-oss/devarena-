const Notification = require('../models/Notification');
const socketService = require('./socketService');
const logger = require('../utils/logger');

/**
 * Creates a notification record and emits it in real-time to the target user
 */
const createNotification = async ({ userId, title, message, type = 'info', link = null }) => {
  if (!userId || !title || !message) return null;

  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      link,
      isRead: false,
    });

    socketService.emitToUser(userId, 'notification:new', notification);
    return notification;
  } catch (err) {
    logger.warn({ err, userId, title }, 'Failed to create notification');
    return null;
  }
};

module.exports = {
  createNotification,
};
