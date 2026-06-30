import mongoose from 'mongoose';
import { WorkerProfile } from './WorkerProfile.js';

const reviewSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkerProfile',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required (1-5)'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from reviewing the same worker multiple times
reviewSchema.index({ workerId: 1, customerId: 1 }, { unique: true });

// Static method to calculate average rating and review count
reviewSchema.statics.calculateAverageRating = async function (workerId) {
  const stats = await this.aggregate([
    { $match: { workerId } },
    {
      $group: {
        _id: '$workerId',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await WorkerProfile.findByIdAndUpdate(workerId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await WorkerProfile.findByIdAndUpdate(workerId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};

// Recalculate rating on save
reviewSchema.post('save', async function () {
  await (this.constructor as any).calculateAverageRating(this.workerId);
});

// Recalculate rating on delete (findOneAndDelete, findByIdAndDelete triggers)
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
  }
});

export const Review = mongoose.model('Review', reviewSchema);
