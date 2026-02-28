import mongoose, { Schema } from 'mongoose';
import { IPaymentDocument } from '../types/models';

const paymentSchema = new Schema<IPaymentDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      required: true,
      enum: ['Pro', 'Premium'],
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_uuid: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failure'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPaymentDocument>('Payment', paymentSchema);
