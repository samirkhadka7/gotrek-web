import mongoose, { Schema } from 'mongoose';
import { INotificationDocument } from '../types/models';

const notificationSchema = new Schema<INotificationDocument>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['join_request_approved', 'join_request_declined', 'upcoming_hike_reminder', 'achievement_unlocked'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    default: {},
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<INotificationDocument>('Notification', notificationSchema);
