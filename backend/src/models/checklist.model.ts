import mongoose, { Schema } from 'mongoose';
import { IChecklistDocument } from '../types/models';

const checklistSchema = new Schema<IChecklistDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A checklist must belong to a user'],
    },
    name: {
      type: String,
      required: [true, 'A checklist must have a name'],
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['new', 'experienced'],
      required: [true, 'A checklist must have an experience level'],
    },
    duration: {
      type: String,
      enum: ['half-day', 'full-day', 'multi-day'],
      required: [true, 'A checklist must have a duration'],
    },
    weather: {
      type: String,
      enum: ['mild', 'hot', 'cold', 'rainy'],
      required: [true, 'A checklist must have weather condition'],
    },
    items: [
      {
        id: {
          type: Number,
          required: [true, 'An item must have an ID'],
        },
        name: {
          type: String,
          enum: ['essentials', 'clothing', 'equipment', 'advanced', 'special'],
          required: [true, 'An item must have a category'],
        },
        checked: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    associatedHike: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model<IChecklistDocument>('Checklist', checklistSchema);
// TODO: add checklist category grouping
