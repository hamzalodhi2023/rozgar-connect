import mongoose from 'mongoose';

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    categories: {
      type: [{
        type: String,
        trim: true,
        lowercase: true,
      }],
      validate: {
        validator: function(v: any[]) {
          return v && v.length > 0;
        },
        message: 'At least one category is required',
      },
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      lowercase: true,
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    idCardFront: {
      type: String,
      default: '',
    },
    idCardBack: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Optimize searches with indexes
workerProfileSchema.index({ categories: 1, city: 1, area: 1 });
workerProfileSchema.index({ averageRating: -1 });

export const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);
