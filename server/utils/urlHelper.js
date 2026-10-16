/**
 * Normalizes an origin URL string to its canonical scheme://host[:port] format.
 * Returns null if the string is invalid or not an http/https URL.
 * Handles trailing slashes, paths, and casing safely via WHATWG URL parsing.
 */
function normalizeOrigin(originStr) {
  if (!originStr || typeof originStr !== 'string') return null;
  const trimmed = originStr.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.origin.toLowerCase();
  } catch (_) {
    return null;
  }
}

function isValidHttpUrl(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (trimmed === '') return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Determines whether an incoming origin is permitted for CORS.
 * Permits:
 * 1. Explicitly configured origins in CLIENT_URL (comma-delimited)
 * 2. Localhost and 127.0.0.1 on any port (for local development & testing)
 * 3. Any Vercel deployment domain (*.vercel.app)
 */
function isAllowedOrigin(originStr) {
  if (!originStr) return true;
  const normalized = normalizeOrigin(originStr);
  if (!normalized) return false;

  const allowedOrigins = new Set(
    (process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',')
      .map(normalizeOrigin)
      .filter(Boolean)
  );

  if (allowedOrigins.has(normalized)) return true;

  // Local development host & port variations
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(normalized)) {
    return true;
  }

  // Vercel deployment domains (production, preview, staging)
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(normalized)) {
    return true;
  }

  return false;
}

module.exports = { normalizeOrigin, isValidHttpUrl, isAllowedOrigin };
