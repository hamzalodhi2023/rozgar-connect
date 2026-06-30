import { Request, Response, NextFunction } from 'express';
import { Review } from '../models/Review.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await Review.find()
      .populate('customerId', 'name email')
      .populate({
        path: 'workerId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ createdAt: -1 });
    return sendSuccess(res, 'All reviews retrieved successfully', { reviews });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    const workerId = review.workerId;
    await Review.findByIdAndDelete(id);

    // Recalculate average rating
    await (Review as any).calculateAverageRating(workerId);

    return sendSuccess(res, 'Review deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return sendError(res, 'Rating must be between 1 and 5', 400);
    }

    const review = await Review.findById(id);
    if (!review) {
      return sendError(res, 'Review not found', 404);
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Recalculate average rating for the worker
    await (Review as any).calculateAverageRating(review.workerId);

    return sendSuccess(res, 'Review updated successfully', { review });
  } catch (error) {
    next(error);
  }
};
