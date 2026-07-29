import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Worker's User ID
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in-progress', 'worker-completed', 'completed', 'cancelled'],
      default: 'pending',
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster querying
jobSchema.index({ customerId: 1 });
jobSchema.index({ workerId: 1 });
jobSchema.index({ status: 1 });

export const Job = mongoose.model('Job', jobSchema);
