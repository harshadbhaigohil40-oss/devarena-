const router = require('express').Router();
const { searchTalent, viewCandidate, getAnalytics } = require('../controllers/recruiterController');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.get('/talent', auth, requireRole('recruiter', 'admin'), searchTalent);
router.get('/talent/:id', auth, requireRole('recruiter', 'admin'), viewCandidate);
router.get('/analytics', auth, requireRole('recruiter', 'admin'), getAnalytics);

module.exports = router;
