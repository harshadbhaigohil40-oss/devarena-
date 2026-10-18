require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const hpp = require('hpp');

const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const { validateEnv } = require('./config/envValidator');

// Validate environment variables on startup
validateEnv(logger);

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const { initGemini } = require('./config/gemini');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const projectRoutes = require('./routes/projectRoutes');
const badgeRoutes = require('./routes/badgeRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const skillTreeRoutes = require('./routes/skillTreeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const messageRoutes = require('./routes/messageRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Trust front-facing reverse proxy (single hop for Render / Vercel architecture).
// Ensures req.ip evaluates accurately for rate limiting while resisting spoofed headers.
app.set('trust proxy', 1);

const { isAllowedOrigin } = require('./utils/urlHelper');

// Initialize Socket.io
initSocket(server);

// Initialize Gemini AI
initGemini();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://apis.google.com", "https://cdn.jsdelivr.net"],
      frameSrc: ["'self'", "blob:", "data:", "https://accounts.google.com", "https://apis.google.com"],
      connectSrc: ["'self'", "https:", "http:", "wss:", "ws:", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:", "https://cdn.jsdelivr.net"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    // Safely reject untrusted origins without triggering an unhandled 500 error
    callback(null, false);
  },
  credentials: true,
}));
app.use(requestLogger);
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(hpp()); // HTTP Parameter Pollution protection
app.use(cookieParser());
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/challenges', submissionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/skill-trees', skillTreeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handle 404 for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API Endpoint Not Found' });
});

// Catch all for any other unknown routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route Not Found' });
});

// Global Error handler
app.use(errorHandler);

const { ensureAdminUser } = require('./config/adminSeed');
const { initScheduler, stopScheduler } = require('./services/leaderboardService');

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await ensureAdminUser();
  initScheduler();
  server.listen(PORT, () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, `DEVARENA API Server running on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const mongoose = require('mongoose');

function gracefulShutdown(signal) {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  stopScheduler();
  server.close(() => {
    logger.info('HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      logger.info('MongoDB connection closed.');
      process.exit(0);
    }).catch((err) => {
      logger.error({ err }, 'Error closing MongoDB connection');
      process.exit(1);
    });
  });

  // Force exit if graceful shutdown takes too long (10 seconds)
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── Global Error Handlers ───────────────────────────────────────────────────

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason }, 'Unhandled Promise Rejection');
  // In production, log and continue; in development, crash to surface bugs
  if (process.env.NODE_ENV === 'production') return;
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught Exception');
  // Always exit on uncaught exceptions — the process is in an undefined state
  gracefulShutdown('uncaughtException');
});

app._normalizeOrigin = normalizeOrigin;
module.exports = app;

