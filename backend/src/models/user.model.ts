import mongoose, { Schema, CallbackWithoutResultAndOptionalError } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { IUserDocument } from '../types/models';

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: function(this: IUserDocument) {
        return !this.googleId; // Only required if not using Google OAuth
      },
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      required: function(this: IUserDocument) {
        return !this.googleId; // Only required if not using Google OAuth
      },
    },
    hikerType: {
      type: String,
      enum: ['new', 'experienced'],
      default: 'new',
    },
    ageGroup: {
      type: String,
      enum: ['18-24', '24-35', '35-44', '45-54', '55-64', '65+'],
    },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'admin'],
      default: 'user',
    },
    subscription: {
      type: String,
      enum: ['Basic', 'Pro', 'Premium'],
      default: 'Basic',
    },
    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    stats: {
      totalHikes: { type: Number, default: 0 },
      totalDistance: { type: Number, default: 0 },
      totalElevation: { type: Number, default: 0 },
      totalHours: { type: Number, default: 0 },
      hikesJoined: { type: Number, default: 0 },
      hikesLed: { type: Number, default: 0 },
    },
    achievements: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Achievement',
      },
    ],
    completedTrails: [
      {
        trail: {
          type: Schema.Types.ObjectId,
          ref: 'Trail',
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    joinedTrails: [
      {
        trail: {
          type: Schema.Types.ObjectId,
          ref: 'Trail',
          required: true,
        },
        scheduledDate: {
          type: Date,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    guideProfile: {
      verified: { type: Boolean, default: false },
      experienceYears: { type: Number, default: 0 },
      specialization: [{ type: String }],
      languages: [{ type: String }],
      certifications: [{ type: String }],
    },
    googleId: {
      type: String,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    passwordResetOTP: {
      type: String,
      select: false,
    },
    passwordResetOTPExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  this.passwordResetToken = resetToken;
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return resetToken;
};

UserSchema.methods.createPasswordResetOTP = function (): string {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.passwordResetOTP = otp;
  this.passwordResetOTPExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return otp;
};

export default mongoose.model<IUserDocument>('User', UserSchema);
// TODO: add index on lastLoginAt for analytics queries
