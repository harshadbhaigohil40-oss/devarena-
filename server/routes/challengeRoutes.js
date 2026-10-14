const router = require('express').Router();
const { listChallenges, getChallenge, createChallenge } = require('../controllers/challengeController');
const { auth, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Cache challenge list for 2 minutes — new challenges are added infrequently
router.get('/', optionalAuth, cacheMiddleware(120), listChallenges);
router.get('/:slug', optionalAuth, cacheMiddleware(120), getChallenge);
router.post('/', auth, requireRole('admin'), createChallenge);

module.exports = router;
