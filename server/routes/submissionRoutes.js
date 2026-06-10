const router = require('express').Router();
const { submitSolution, getSubmissions } = require('../controllers/submissionController');
const { auth } = require('../middleware/auth');

router.post('/:id/submit', auth, submitSolution);
router.get('/:id/submissions', auth, getSubmissions);

module.exports = router;
