import mongoose, { Schema } from 'mongoose';
import { IGroupDocument } from '../types/models';

const groupSchema = new Schema<IGroupDocument>({
  title: {
    type: String,
    required: [true, 'A group must have a title'],
  },
  trail: {
    type: Schema.Types.ObjectId,
    ref: 'Trail',
    required: [true, 'A group must be associated with a trail'],
  },
  date: {
    type: Date,
    required: [true, 'A group must have a date'],
  },
  description: {
    type: String,
  },
  maxSize: {
    type: Number,
    min: [2, 'A group must have at least 2 participants'],
    max: [20, 'A group cannot have more than 20 participants'],
  },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A group must have a leader'],
  },
  participants: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['pending', 'confirmed', 'declined'],
        default: 'pending',
      },
      message: {
        type: String,
      },
      joinedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  meetingPoint: {
    description: String,
  },
  requirements: {
    type: [String],
    default: [],
  },
  difficulty: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  photos: {
    type: [String],
    default: [],
  },
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model<IGroupDocument>('Group', groupSchema);
