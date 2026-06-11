const router = require('express').Router();
const { listChallenges, getChallenge, createChallenge } = require('../controllers/challengeController');
const { auth, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/', optionalAuth, listChallenges);
router.get('/:slug', optionalAuth, getChallenge);
router.post('/', auth, requireRole('admin'), createChallenge);

module.exports = router;
