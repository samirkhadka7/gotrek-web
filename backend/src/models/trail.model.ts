import mongoose, { Schema } from 'mongoose';
import { ITrailDocument } from '../types/models';

const trailSchema = new Schema<ITrailDocument>(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'A trail must have a name.'],
    },
    location: {
      type: String,
      required: [true, 'A trail must have a location.'],
    },
    region: {
      type: String,
      trim: true,
    },
    distance: {
      type: Number,
      required: [true, 'A trail must have a distance.'],
    },
    elevation: {
      type: Number,
      required: [true, 'A trail must have an elevation gain.'],
    },
    duration: {
      min: { type: Number },
      max: { type: Number },
    },
    durationDays: {
      type: Number,
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Moderate', 'Hard'],
        message: 'Difficulty must be either: Easy, Moderate, or Hard',
      },
      required: [true, 'A trail must have a difficulty level.'],
    },
    description: {
      type: String,
      trim: true,
    },
    highlights: [String],
    images: [String],
    features: [String],
    seasons: [String],
    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot be more than 5.0'],
      set: (val: number) => Math.round(val * 10) / 10,
    },
    numRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITrailDocument>('Trail', trailSchema);
// TODO: add geospatial index for nearby trails query
