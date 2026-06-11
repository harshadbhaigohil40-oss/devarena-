const router = require('express').Router();
const { getLeaderboard, getUserRank } = require('../controllers/leaderboardController');

router.get('/', getLeaderboard);
router.get('/rank/:userId', getUserRank);

module.exports = router;
