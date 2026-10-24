const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (user.lockUntil && user.lockUntil.getTime() > Date.now()) {
      return res.status(403).json({ error: 'Account is temporarily locked.' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired.' });
    }
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Optional auth — sets req.user if token present, but doesn't block
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user && (!user.lockUntil || user.lockUntil.getTime() <= Date.now())) {
        req.user = user;
        req.userId = user._id;
      }
    }
  } catch (e) { /* silent */ }
  next();
};

module.exports = { auth, optionalAuth };
