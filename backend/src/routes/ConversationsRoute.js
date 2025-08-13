/**
 * Conversation Routes
 * 
 * Purpose: Express routes for conversation and message APIs
 * - Maps HTTP endpoints to controller methods
 * - Provides RESTful API structure for frontend
 */

import { Router } from 'express';
import conversationController from '../Controllers/conversationController.js';

const router = Router();

// Conversation routes
router.get('/conversations', conversationController.getConversations);
router.get('/conversations/search', conversationController.searchConversations);
router.get('/conversations/:conversationId/messages', conversationController.getMessages);
router.post('/conversations/:conversationId/messages', conversationController.sendMessage);

// Message routes
router.patch('/messages/:messageId/status', conversationController.updateMessageStatus);

export default router;