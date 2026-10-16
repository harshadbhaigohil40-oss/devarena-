/**
 * Escapes special regex characters in a user-provided string to prevent ReDoS
 * or unexpected regex pattern behavior in MongoDB queries.
 */
function escapeRegex(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Clamps pagination parameters to safe numeric bounds.
 * Prevents NaN, negative offsets, and excessive limits that cause DoS.
 */
function clampPagination(query = {}, defaultLimit = 20, maxLimit = 100) {
  const rawPage = parseInt(query.page, 10);
  const rawLimit = parseInt(query.limit, 10);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, maxLimit) : defaultLimit;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

module.exports = {
  escapeRegex,
  clampPagination,
};
