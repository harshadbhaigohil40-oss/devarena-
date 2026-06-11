const router = require('express').Router();
const { listSkillTrees, getSkillTree } = require('../controllers/skillTreeController');
const { optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, listSkillTrees);
router.get('/:id', optionalAuth, getSkillTree);

module.exports = router;
