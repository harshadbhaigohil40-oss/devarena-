require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');

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

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Initialize Gemini AI
initGemini();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin
    callback(null, true);
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
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

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║         🚀 DEVARENA API Server          ║
║         Running on port ${PORT}            ║
║         Environment: ${process.env.NODE_ENV || 'development'}    ║
╚══════════════════════════════════════════╝
    `);
  });
};

startServer();

module.exports = app;
