const router = require('express').Router();
const { getLeaderboard, getUserRank } = require('../controllers/leaderboardController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(300), getLeaderboard);
router.get('/rank/:userId', cacheMiddleware(300), getUserRank);

module.exports = router;
