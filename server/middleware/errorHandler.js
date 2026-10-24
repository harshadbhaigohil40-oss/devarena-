const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error({ err }, 'Unhandled request error');

  // Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ success: false, error: 'File size exceeds maximum allowed limit (5MB).' });
    }
    return res.status(400).json({ success: false, error: err.message || 'File upload error.' });
  }

  // Malformed JSON Body Error from express.json()
  if (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err)) {
    return res.status(400).json({ success: false, error: 'Invalid JSON payload format.' });
  }

  // Zod Validation Error
  if (err.name === 'ZodError' || Array.isArray(err.issues) || Array.isArray(err.errors)) {
    const issues = Array.isArray(err.issues) ? err.issues : (Array.isArray(err.errors) ? err.errors : []);
    const messages = issues.map(e => `${Array.isArray(e.path) ? e.path.join('.') : (e.path || '')}: ${e.message || 'Invalid value'}`);
    return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map(e => e.message);
    return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : 'Resource';
    return res.status(409).json({ success: false, error: `${field} already exists.` });
  }

  // Mongoose Invalid ObjectId Error
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format.' });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }

  // CORS Errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, error: 'Origin not allowed by CORS policy.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' && statusCode === 500 ? 'Internal Server Error' : err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
