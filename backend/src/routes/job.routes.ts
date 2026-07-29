import express from 'express';
import { createJob, getJobs, updateJobStatus } from '../controllers/job.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', requireAuth, createJob);
router.get('/', requireAuth, getJobs);
router.patch('/:jobId/status', requireAuth, updateJobStatus);

export default router;
