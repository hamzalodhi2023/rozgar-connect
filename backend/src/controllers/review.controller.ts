import { Review } from '../models/Review.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { Job } from '../models/Job.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment, jobId } = req.body;
    const customerId = req.user.id;

    if (!jobId) {
      return sendError(res, 'Job ID is required to leave a review', 400);
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return sendError(res, 'Job not found', 404);
    }

    if (job.customerId.toString() !== customerId) {
      return sendError(res, 'You can only review jobs you requested', 403);
    }

    if (job.status !== 'completed') {
      return sendError(res, 'You can only review completed jobs', 400);
    }

    // Find the worker profile for the worker who did the job
    const workerProfile = await WorkerProfile.findOne({ userId: job.workerId });
    if (!workerProfile) {
      return sendError(res, 'Worker profile not found for this job', 404);
    }

    // Check if review already exists for this job
    const existingReview = await Review.findOne({ jobId });
    if (existingReview) {
      return sendError(res, 'A review has already been submitted for this job', 400);
    }

    const review = new Review({
      jobId,
      workerId: workerProfile._id,
      customerId,
      rating,
      comment,
    });

    await review.save();

    job.isReviewed = true;
    await job.save();

    return sendSuccess(res, 'Review added successfully', { review }, 201);
  } catch (error) {
    next(error);
  }
};

export const getReviewsForWorker = async (req, res, next) => {
  try {
    const { workerId } = req.params;

    const reviews = await Review.find({ workerId })
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Reviews retrieved successfully', { reviews });
  } catch (error) {
    next(error);
  }
};
