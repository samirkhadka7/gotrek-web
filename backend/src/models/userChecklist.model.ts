import mongoose, { Schema, Document } from 'mongoose';

export interface IUserChecklistDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: Array<{
    _id: string;
    name: string;
    checked: boolean;
    category: string;
  }>;
  config: {
    experience: string;
    duration: string;
    weather: string;
  };
  updatedAt: Date;
}

const userChecklistSchema = new Schema<IUserChecklistDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One checklist per user
    },
    items: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        checked: { type: Boolean, default: false },
        category: { type: String, default: 'General' },
      },
    ],
    config: {
      experience: { type: String, default: 'beginner' },
      duration: { type: String, default: 'day' },
      weather: { type: String, default: 'sunny' },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserChecklistDocument>('UserChecklist', userChecklistSchema);
// TODO: add completion percentage virtual field
