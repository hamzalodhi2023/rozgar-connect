import express from 'express';
import { body } from 'express-validator';
import { createReview, getReviewsForWorker } from '../controllers/review.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { handleValidation } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.get('/worker/:workerId', getReviewsForWorker);

router.post(
  '/',
  requireAuth,
  [
    body('workerId').notEmpty().withMessage('Worker ID is required').isMongoId().withMessage('Invalid worker ID format'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Comment is required'),
  ],
  handleValidation,
  createReview
);

export default router;
