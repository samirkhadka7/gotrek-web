import mongoose, { Schema } from 'mongoose';
import { IMessageDocument } from '../types/models';

const messageSchema = new Schema<IMessageDocument>(
  {
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessageDocument>('Message', messageSchema);
