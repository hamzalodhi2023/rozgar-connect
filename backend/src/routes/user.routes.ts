import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, becomeWorker, deleteAccount } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { handleValidation } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.get('/me', requireAuth, getProfile);

router.put(
  '/me',
  requireAuth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  ],
  handleValidation,
  updateProfile
);

router.post('/become-worker', requireAuth, becomeWorker);

router.delete('/me', requireAuth, deleteAccount);

export default router;
