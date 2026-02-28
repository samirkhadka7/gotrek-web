import mongoose, { Schema } from 'mongoose';
import { ICancellationDocument } from '../types/models';

const cancellationSchema = new Schema<ICancellationDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    trail: {
      type: Schema.Types.ObjectId,
      ref: 'Trail',
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    cancelledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICancellationDocument>('Cancellation', cancellationSchema);
