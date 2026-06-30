import { Review } from '../models/Review.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const createReview = async (req, res, next) => {
  try {
    const { workerId, rating, comment } = req.body;
    const customerId = req.user.id;

    // Verify worker profile exists
    const workerProfile = await WorkerProfile.findById(workerId);
    if (!workerProfile) {
      return sendError(res, 'Worker profile not found', 404);
    }

    // Customer cannot review themselves
    if (workerProfile.userId.toString() === customerId) {
      return sendError(res, 'You cannot rate or review your own worker profile', 400);
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ workerId, customerId });
    if (existingReview) {
      return sendError(res, 'You have already reviewed this worker', 400);
    }

    const review = new Review({
      workerId,
      customerId,
      rating,
      comment,
    });

    await review.save();

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
