import mongoose, { Schema } from 'mongoose';
import { IAchievementDocument } from '../types/models';

const achievementSchema = new Schema<IAchievementDocument>({
  name: {
    type: String,
    required: [true, 'An achievement must have a name'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'An achievement must have a description'],
  },
  icon: {
    type: String,
    required: [true, 'An achievement must have an icon'],
  },
  category: {
    type: String,
    enum: ['milestones', 'elevation', 'social', 'special', 'exploration'],
    required: [true, 'An achievement must have a category'],
  },
  criteria: {
    type: {
      type: String,
      enum: ['hike_count', 'elevation_gain', 'distance', 'group_count', 'trail_count', 'special'],
      required: [true, 'Achievement criteria must have a type.'],
    },
    value: {
      type: Number,
      required: function (this: IAchievementDocument) {
        return this.criteria.type !== 'special';
      },
    },
    specialCondition: {
      type: String,
      required: function (this: IAchievementDocument) {
        return this.criteria.type === 'special';
      },
    },
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
});

export default mongoose.model<IAchievementDocument>('Achievement', achievementSchema);
// TODO: add achievement unlock notification trigger
