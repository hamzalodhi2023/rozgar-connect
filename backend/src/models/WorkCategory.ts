import mongoose from 'mongoose';

const workCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: [true, 'Category label is required'],
      trim: true,
    },
    iconName: {
      type: String,
      default: 'FaWrench',
      trim: true,
    },
    iconColor: {
      type: String,
      default: 'blue',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkCategory = mongoose.model('WorkCategory', workCategorySchema);
