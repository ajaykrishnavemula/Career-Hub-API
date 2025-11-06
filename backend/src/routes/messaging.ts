import express from 'express';
import { authenticateUser } from '../middleware/auth';
import {
  getConversations,
  getConversationMessages,
  sendMessage,
  markMessageAsRead,
  deleteMessage,
  getUnreadMessageCount,
  searchMessages
} from '../controllers/messaging';

const router = express.Router();

// All messaging routes require authentication
router.use(authenticateUser);

// Get all conversations for the current user
router.get('/conversations', getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId', getConversationMessages);

// Send a new message
router.post('/', sendMessage);

// Mark a message as read
router.patch('/:messageId/read', markMessageAsRead);

// Delete a message
router.delete('/:messageId', deleteMessage);

// Get unread message count
router.get('/unread/count', getUnreadMessageCount);

// Search messages
router.get('/search', searchMessages);

export default router;

