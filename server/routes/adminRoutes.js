const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const ctrl = require('../controllers/adminChallengeController');

// All routes require admin
router.use(auth, requireRole('admin'));

// Generated challenge CRUD
router.get('/challenges/generated', ctrl.listGenerated);
router.get('/challenges/generated/files', ctrl.listFiles);
router.put('/challenges/generated/:slug', ctrl.editGenerated);
router.delete('/challenges/generated/:slug', ctrl.deleteGenerated);

// Approval
router.post('/challenges/generated/:slug/approve', ctrl.approveGenerated);
router.post('/challenges/generated/approve-bulk', ctrl.approveBulk);

// Quality scoring
router.post('/challenges/generated/:slug/quality', ctrl.scoreChallenge);
router.post('/challenges/score-all', ctrl.scoreAll);

// AI review
router.post('/challenges/generated/:slug/ai-review', ctrl.aiReview);

// Import
router.post('/challenges/import', ctrl.importApproved);

// Analytics
router.get('/challenges/analytics', ctrl.getAnalytics);

module.exports = router;
