const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.name === 'ZodError' || Array.isArray(err.issues) || Array.isArray(err.errors)) {
    const issues = Array.isArray(err.issues) ? err.issues : (Array.isArray(err.errors) ? err.errors : []);
    const messages = issues.map(e => `${Array.isArray(e.path) ? e.path.join('.') : (e.path || '')}: ${e.message || 'Invalid value'}`);
    return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, error: 'Validation Error', details: messages });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ success: false, error: `${field} already exists.` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format.' });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
};

module.exports = errorHandler;

