import express from 'express';
import { body } from 'express-validator';
import { getConversations, getMessages, createConversation } from '../controllers/chat.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { handleValidation } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.get('/conversations', getConversations);
router.get('/messages/:conversationId', getMessages);
router.post(
  '/conversations',
  [
    body('recipientId').notEmpty().withMessage('Recipient ID is required').isMongoId().withMessage('Invalid recipient ID format')
  ],
  handleValidation,
  createConversation
);

export default router;
