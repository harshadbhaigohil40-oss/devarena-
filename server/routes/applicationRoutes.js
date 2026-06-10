const router = require('express').Router();
const { getPipeline, addToPipeline, updateStatus, removeFromPipeline } = require('../controllers/applicationController');
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

router.use(auth, requireRole('recruiter', 'admin'));
router.get('/', getPipeline);
router.post('/', addToPipeline);
router.put('/:id', updateStatus);
router.delete('/:id', removeFromPipeline);

module.exports = router;
