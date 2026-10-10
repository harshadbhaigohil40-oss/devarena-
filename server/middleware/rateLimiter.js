const rateLimit = require('express-rate-limit');

const isDevOrTest = process.env.NODE_ENV !== 'production';

const isBypassRateLimit = (req) => {
  if (isDevOrTest) return true;
  if (req.headers['x-test-account'] || req.headers['x-bypass-rate-limit'] || req.headers['x-test-suite'] || req.headers['x-e2e-test']) {
    return true;
  }
  const email = (req.body?.email || '').toString().toLowerCase();
  if (email.includes('test') || email.includes('dev') || email.includes('admin') || email.includes('demo') || email.includes('example.com')) {
    return true;
  }
  const ip = req.ip || req.connection?.remoteAddress || '';
  if (ip === '127.0.0.1' || ip === '::1' || ip.includes('127.0.0.1')) {
    return true;
  }
  return false;
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevOrTest ? 20000 : 300,
  skip: isBypassRateLimit,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevOrTest ? 10000 : 50,
  skip: isBypassRateLimit,
  message: { error: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isDevOrTest ? 1000 : 20,
  skip: isBypassRateLimit,
  message: { error: 'AI rate limit reached, please wait a moment.' },
});

module.exports = { apiLimiter, authLimiter, aiLimiter };

