import express from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { chatWithAI } from '../controllers/ai.controller.js';
import { handleValidation } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Rate limiter for AI Chat requests: max 15 requests per 15 minutes per IP
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  message: {
    reply: 'Sorry, Rozgar AI is currently unavailable. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/chat',
  aiLimiter,
  [
    body('message')
      .trim()
      .notEmpty()
      .withMessage('Message is required')
      .isString()
      .withMessage('Message must be a string')
      .isLength({ max: 500 })
      .withMessage('Message is too long. Maximum length is 500 characters.')
  ],
  handleValidation,
  chatWithAI
);

export default router;
