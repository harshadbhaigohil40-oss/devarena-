const pino = require('pino');

/**
 * Pino structured logger configured with automatic redaction of sensitive credentials,
 * tokens, passwords, and cookies, conforming to Phase 7 requirements.
 */
const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'test' ? 'silent' : (process.env.NODE_ENV === 'production' ? 'info' : 'debug')),
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'req.headers["set-cookie"]',
      'headers.authorization',
      'headers.cookie',
      'headers["set-cookie"]',
      'authorization',
      'cookie',
      'password',
      'passwordHash',
      'token',
      'refreshToken',
      'verificationToken',
      'resetPasswordToken',
      'accessToken',
      '*.password',
      '*.passwordHash',
      '*.token',
      '*.refreshToken',
      '*.accessToken',
    ],
    censor: '[REDACTED]',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

module.exports = logger;
