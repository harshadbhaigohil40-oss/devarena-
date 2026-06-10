const router = require('express').Router();
const { getProfile, updateProfile, getStats, getBadges, getXPHistory } = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.get('/:id', getProfile);
router.put('/profile', auth, updateProfile);
router.get('/:id/stats', getStats);
router.get('/:id/badges', getBadges);
router.get('/:id/xp-history', getXPHistory);

module.exports = router;
