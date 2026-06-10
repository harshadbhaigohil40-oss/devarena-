const router = require('express').Router();
const { getMessages, getConversations, markAsRead } = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

router.use(auth);
router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.put('/:userId/read', markAsRead);

module.exports = router;
