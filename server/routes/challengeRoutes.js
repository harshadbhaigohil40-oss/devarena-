const router = require('express').Router();
const { listChallenges, getChallenge, createChallenge } = require('../controllers/challengeController');
const { auth, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', optionalAuth, cacheMiddleware(300), listChallenges);
router.get('/:slug', optionalAuth, cacheMiddleware(300), getChallenge);
router.post('/', auth, requireRole('admin'), createChallenge);

module.exports = router;
