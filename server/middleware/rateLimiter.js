const rateLimit = require('express-rate-limit');

// ─── Skip Logic ──────────────────────────────────────────────────────────────
// Rate limiting is bypassed ONLY for:
//   1. Localhost IPs in non-production environments (automated tests on CI/CD)
//   2. A secret bypass header in non-production (useful for load tests)
//
// REMOVED: email-pattern bypass (test/dev/admin/demo).
// That bypass was exploitable in production by any attacker who included those
// strings in their email address, allowing unlimited brute-force attempts.

const isBypassRateLimit = (req) => {
  // Never bypass in production — no exceptions
  if (process.env.NODE_ENV === 'production') return false;

  // Development/test only: allow localhost to skip rate limits
  const ip = req.ip || req.connection?.remoteAddress || '';
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('::ffff:127.')) return true;

  // Development/test only: allow a secret internal header
  // This header must match the value set in RATE_LIMIT_BYPASS_SECRET env var
  const bypassSecret = process.env.RATE_LIMIT_BYPASS_SECRET;
  if (bypassSecret && req.headers['x-ratelimit-bypass'] === bypassSecret) return true;

  return false;
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  skip: isBypassRateLimit,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skip: isBypassRateLimit,
  message: { error: 'Too many auth attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  skip: isBypassRateLimit,
  message: { error: 'AI rate limit reached, please wait a moment.' },
});

module.exports = { apiLimiter, authLimiter, aiLimiter };
