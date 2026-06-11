const router = require('express').Router();
const { listProjects, getProject, createProject, updateProject, deleteProject, likeProject } = require('../controllers/projectController');
const { auth } = require('../middleware/auth');

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/like', auth, likeProject);

module.exports = router;
