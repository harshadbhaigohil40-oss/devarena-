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

module.exports = { normalizeOrigin, isValidHttpUrl };
