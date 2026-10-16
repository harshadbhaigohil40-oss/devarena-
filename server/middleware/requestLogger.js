const crypto = require('crypto');
const logger = require('../utils/logger');

/**
 * Express middleware that assigns a unique request ID (or propagates x-request-id),
 * attaches a contextual child logger to req.log, and logs request lifecycle events.
 */
function requestLogger(req, res, next) {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = reqId;
  res.setHeader('x-request-id', reqId);

  req.log = logger.child({ reqId });

  const startTime = Date.now();
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    req.log.info({
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
    }, `${req.method} ${req.originalUrl || req.url} ${res.statusCode} in ${durationMs}ms`);
  });

  next();
}

module.exports = requestLogger;
