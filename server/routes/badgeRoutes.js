const router = require('express').Router();
const { listBadges, getUserBadges } = require('../controllers/badgeController');
const { auth } = require('../middleware/auth');

router.get('/', listBadges);
router.get('/user/:userId', getUserBadges);
router.get('/my', auth, (req, res, next) => { req.params.userId = req.userId; getUserBadges(req, res, next); });

module.exports = router;
