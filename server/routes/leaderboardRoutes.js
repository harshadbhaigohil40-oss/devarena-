const router = require('express').Router();
const { getLeaderboard, getUserRank } = require('../controllers/leaderboardController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Leaderboard data is expensive to compute and changes infrequently — cache for 60s
router.get('/', cacheMiddleware(60), getLeaderboard);
router.get('/rank/:userId', cacheMiddleware(60), getUserRank);

module.exports = router;
