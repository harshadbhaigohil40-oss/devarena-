const router = require('express').Router();
const { listProjects, getProject, createProject, updateProject, deleteProject, likeProject } = require('../controllers/projectController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createProjectSchema, updateProjectSchema } = require('../validators/projectValidator');

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', auth, validate(createProjectSchema), createProject);
router.put('/:id', auth, validate(updateProjectSchema), updateProject);
router.delete('/:id', auth, deleteProject);
router.post('/:id/like', auth, likeProject);

module.exports = router;
