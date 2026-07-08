const mongoose = require('mongoose');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool size — tune based on expected concurrency
      maxPoolSize: 10,
      // How long to wait for a server to respond to selection
      serverSelectionTimeoutMS: 5000,
      // How long to wait for a socket timeout
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error (attempt ${retryCount + 1}/${MAX_RETRIES}): ${error.message}`);
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`🔄 Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB(retryCount + 1);
    }
    console.error('❌ Max retries reached. Exiting.');
    process.exit(1);
  }
};

// Connection event listeners for monitoring
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Mongoose will attempt to reconnect.');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

module.exports = connectDB;

