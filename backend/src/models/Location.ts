import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ILocation extends Document {
  type: 'city' | 'area';
  name: string; // lowercase, e.g., 'islamabad', 'blue area'
  label: string; // display name, e.g., 'Islamabad', 'Blue Area'
  cityId?: mongoose.Types.ObjectId; // Optional: If type is 'area', it can belong to a city. (For future use if needed)
}

const locationSchema = new Schema<ILocation>(
  {
    type: {
      type: String,
      enum: ['city', 'area'],
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    cityId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a city or area name is unique within its type
locationSchema.index({ type: 1, name: 1 }, { unique: true });

export const Location: Model<ILocation> = mongoose.model<ILocation>('Location', locationSchema);
