/**
 * ARCHITECTURAL NOTE:
 * This cache is in-memory and PER-PROCESS.
 * In a multi-instance or clustered production deployment, cache state is not shared
 * across workers/replicas; replace with an external store (e.g., Redis) if distributed
 * cache consistency is required.
 */
const NodeCache = require('node-cache');
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 320,
  maxKeys: 1000, // Bound maximum cache entries to prevent memory exhaustion
});

// Whitelist of permitted query parameter keys that alter response content
const ALLOWED_QUERY_PARAMS = new Set([
  'page',
  'limit',
  'category',
  'difficulty',
  'search',
  'sort',
  'tag',
  'period',
  'userId',
  'node',
]);

function normalizeQuery(queryObj = {}) {
  const keys = Object.keys(queryObj)
    .filter(k => ALLOWED_QUERY_PARAMS.has(k))
    .sort();
  if (keys.length === 0) return '';
  return '?' + keys.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(queryObj[k])}`).join('&');
}

function generateCacheKey(req) {
  const userIdentifier = req.user ? req.user._id.toString() : 'guest';
  const pathOnly = (req.originalUrl || req.url || '').split('?')[0];
  const normalizedQuery = normalizeQuery(req.query);
  return `${pathOnly}${normalizedQuery}_${userIdentifier}`;
}

const cacheMiddleware = (duration) => (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = generateCacheKey(req);
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  // Intercept the res.json method to store the response
  const originalJson = res.json;
  res.json = (body) => {
    // Only cache successful responses
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        // Parse/stringify to strip Mongoose prototypes and ensure a plain object is cached
        const plainBody = JSON.parse(JSON.stringify(body));
        cache.set(key, plainBody, duration || 300);
      } catch (e) {
        console.error('Cache serialization error:', e);
      }
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

module.exports = {
  cacheMiddleware,
  clearCache,
  cache,
  generateCacheKey,
  normalizeQuery,
};
