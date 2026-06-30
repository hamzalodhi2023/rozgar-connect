import express from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import workerRoutes from './worker.routes.js';
import reviewRoutes from './review.routes.js';
import chatRoutes from './chat.routes.js';
import adminRoutes from './admin.routes.js';
import categoryRoutes from './category.routes.js';
import aiRoutes from './ai.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/workers', workerRoutes);
router.use('/reviews', reviewRoutes);
router.use('/chat', chatRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/ai', aiRoutes);

export default router;
