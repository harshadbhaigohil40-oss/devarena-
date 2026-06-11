const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // Cache for 5 minutes

const cacheMiddleware = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // Ensure cache key is unique per user if authentication is present
  const userIdentifier = req.user ? req.user._id.toString() : 'guest';
  const key = `${req.originalUrl || req.url}_${userIdentifier}`;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  // Intercept the res.json method to store the response
  const originalJson = res.json;
  res.json = (body) => {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, body, duration || 300);
    }
    originalJson.call(res, body);
  };

  next();
};

const clearCache = (prefix) => {
  const keys = cache.keys();
  for (const key of keys) {
    if (key.startsWith(prefix)) {
      cache.del(key);
    }
  }
};

module.exports = { cacheMiddleware, clearCache, cache };
