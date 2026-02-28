import mongoose, { Schema } from 'mongoose';
import { IStepDocument } from '../types/models';

const stepSchema = new Schema<IStepDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  trail: {
    type: Schema.Types.ObjectId,
    ref: 'Trail',
  },
  steps: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<IStepDocument>('Step', stepSchema);
