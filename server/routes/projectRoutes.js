const router = require('express').Router();
const { listProjects, getProject, createProject, updateProject, deleteProject, likeProject } = require('../controllers/projectController');
const { auth } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

router.get('/', cacheMiddleware(300), listProjects);
router.get('/:id', cacheMiddleware(300), getProject);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/like', auth, likeProject);

module.exports = router;
