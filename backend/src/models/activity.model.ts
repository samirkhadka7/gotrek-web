import mongoose, { Schema } from 'mongoose';
import { IActivityDocument } from '../types/models';

const activitySchema = new Schema<IActivityDocument>({
  type: {
    type: String,
    enum: ['user_joined', 'group_created', 'hike_joined', 'hike_completed', 'hike_cancelled'],
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trail: {
    type: Schema.Types.ObjectId,
    ref: 'Trail',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IActivityDocument>('Activity', activitySchema);
// TODO: add activity feed aggregation
