import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  seedAdmin,
  toggleUserStatus,
} from '../controllers/admin.user.controller.js';
import {
  getAllWorkerProfiles,
  deleteWorkerProfile,
  verifyWorker,
  rejectWorker,
} from '../controllers/admin.worker.controller.js';
import {
  getAllReviews,
  deleteReview,
  updateReview,
} from '../controllers/admin.review.controller.js';
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/role.middleware.js';

const router = express.Router();

// Seed route (Public, only for initial development setup)
router.post('/seed', seedAdmin);

// Protect all other admin routes
router.use(requireAuth);
router.use(requireRoles('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/workers', getAllWorkerProfiles);
router.delete('/workers/:id', deleteWorkerProfile);
router.put('/workers/:id/verify', verifyWorker);
router.put('/workers/:id/reject', rejectWorker);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);
router.put('/reviews/:id', updateReview);

// Category Management
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
