import router from 'express';
import conversationController from '../Controllers/conversationController';

// Get all conversations
router.get('/conversations', conversationController.getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', conversationController.getMessages);

// Send a new message
router.post('/conversations/:conversationId/messages', conversationController.sendMessage);

module.exports = router;