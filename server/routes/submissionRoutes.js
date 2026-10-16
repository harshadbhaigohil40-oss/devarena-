const router = require('express').Router();
const { submitSolution, getSubmissions, runCode } = require('../controllers/submissionController');
const { auth } = require('../middleware/auth');
const { runLimiter, submitLimiter } = require('../middleware/rateLimiter');

router.post('/:id/run', auth, runLimiter, runCode);
router.post('/:id/submit', auth, submitLimiter, submitSolution);
router.get('/:id/submissions', auth, getSubmissions);

module.exports = router;
