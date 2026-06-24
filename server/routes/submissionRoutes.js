const router = require('express').Router();
const { submitSolution, getSubmissions, runCode } = require('../controllers/submissionController');
const { auth, optionalAuth } = require('../middleware/auth');

router.post('/:id/run', optionalAuth, runCode);
router.post('/:id/submit', auth, submitSolution);
router.get('/:id/submissions', auth, getSubmissions);

module.exports = router;
