const mongoose = require('mongoose');
const logger = require('../utils/logger');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info({ host: conn.connection.host }, 'MongoDB Connected');
  } catch (error) {
    logger.error({ attempt: retryCount + 1, maxRetries: MAX_RETRIES, err: error }, 'MongoDB Connection Error');
    if (retryCount < MAX_RETRIES - 1) {
      logger.info({ retryDelaySeconds: RETRY_DELAY_MS / 1000 }, 'Retrying MongoDB connection...');
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    }
    logger.fatal('Max MongoDB connection retries reached. Exiting.');
    process.exit(1);
  }
};

// Connection event listeners for monitoring
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Mongoose will attempt to reconnect.');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected.');
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});

module.exports = connectDB;

