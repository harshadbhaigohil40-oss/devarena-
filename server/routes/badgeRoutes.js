const router = require('express').Router();
const { listBadges, getUserBadges } = require('../controllers/badgeController');
const { auth } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Badge definitions rarely change — cache for 5 minutes
router.get('/', cacheMiddleware(300), listBadges);
router.get('/user/:userId', getUserBadges);
router.get('/my', auth, (req, res, next) => { req.params.userId = req.userId; getUserBadges(req, res, next); });

module.exports = router;
