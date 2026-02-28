import { Document, Types } from 'mongoose';

// --- User ---
export interface IEmergencyContact {
  name?: string;
  phone?: string;
}

export interface IUserStats {
  totalHikes: number;
  totalDistance: number;
  totalElevation: number;
  totalHours: number;
  hikesJoined: number;
  hikesLed: number;
}

export interface ICompletedTrail {
  trail: Types.ObjectId;
  completedAt: Date;
}

export interface IJoinedTrail {
  _id?: Types.ObjectId;
  trail: Types.ObjectId;
  scheduledDate: Date;
  addedAt: Date;
}

export interface IGuideProfile {
  verified: boolean;
  experienceYears: number;
  specialization: string[];
  languages: string[];
  certifications: string[];
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone: string;
  hikerType: 'new' | 'experienced';
  ageGroup?: '18-24' | '24-35' | '35-44' | '45-54' | '55-64' | '65+';
  emergencyContact?: IEmergencyContact;
  bio: string;
  profileImage: string;
  joinDate: Date;
  role: 'user' | 'guide' | 'admin';
  subscription: 'Basic' | 'Pro' | 'Premium';
  subscriptionExpiresAt: Date | null;
  active: boolean;
  stats: IUserStats;
  achievements: Types.ObjectId[];
  completedTrails: ICompletedTrail[];
  joinedTrails: Types.DocumentArray<IJoinedTrail & Document>;
  guideProfile?: IGuideProfile;
  googleId?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordResetOTP?: string;
  passwordResetOTPExpires?: Date;
}

export interface IUserDocument extends IUser, Document {
  createdAt: Date;
  updatedAt: Date;
  createPasswordResetToken(): string;
  createPasswordResetOTP(): string;
}

// --- Trail ---
export interface ITrailDuration {
  min?: number;
  max?: number;
}

export interface ITrailRating {
  user: Types.ObjectId;
  rating: number;
  review?: string;
  createdAt: Date;
}

export interface ITrail {
  name: string;
  location: string;
  region?: string;
  distance: number;
  elevation: number;
  duration: ITrailDuration;
  durationDays?: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  description?: string;
  highlights: string[];
  images: string[];
  features: string[];
  seasons: string[];
  ratings: ITrailRating[];
  averageRating: number;
  numRatings: number;
}

export interface ITrailDocument extends ITrail, Document {
  createdAt: Date;
  updatedAt: Date;
}

// --- Group ---
export interface IGroupParticipant {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  status: 'pending' | 'confirmed' | 'declined';
  message?: string;
  joinedAt: Date;
}

export interface IGroupComment {
  user: Types.ObjectId;
  text: string;
  createAt: Date;
}

export interface IGroup {
  title: string;
  trail: Types.ObjectId;
  date: Date;
  description?: string;
  maxSize: number;
  leader: Types.ObjectId;
  participants: Types.DocumentArray<IGroupParticipant & Document>;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  meetingPoint?: { description?: string };
  requirements: string[];
  difficulty?: string;
  createdAt: Date;
  updatedAt: Date;
  photos: string[];
  comments: IGroupComment[];
}

export interface IGroupDocument extends IGroup, Document {}

// --- Activity ---
export type ActivityType = 'user_joined' | 'group_created' | 'hike_joined' | 'hike_completed' | 'hike_cancelled';

export interface IActivity {
  type: ActivityType;
  user: Types.ObjectId;
  trail: Types.ObjectId | null;
  createdAt: Date;
}

export interface IActivityDocument extends IActivity, Document {}

// --- Checklist ---
export interface IChecklistItem {
  id: number;
  name: 'essentials' | 'clothing' | 'equipment' | 'advanced' | 'special';
  checked: boolean;
}

export interface IChecklist {
  user: Types.ObjectId;
  name: string;
  experienceLevel: 'new' | 'experienced';
  duration: 'half-day' | 'full-day' | 'multi-day';
  weather: 'mild' | 'hot' | 'cold' | 'rainy';
  items: IChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
  associatedHike?: Types.ObjectId;
}

export interface IChecklistDocument extends IChecklist, Document {}

// --- Message ---
export interface IMessage {
  group: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
}

export interface IMessageDocument extends IMessage, Document {
  createdAt: Date;
  updatedAt: Date;
}

// --- Payment ---
export interface IPayment {
  userId: Types.ObjectId;
  plan: 'Pro' | 'Premium';
  amount: number;
  transaction_uuid: string;
  status: 'pending' | 'success' | 'failure';
}

export interface IPaymentDocument extends IPayment, Document {
  createdAt: Date;
  updatedAt: Date;
}

// --- Achievement ---
export type AchievementCategory = 'milestones' | 'elevation' | 'social' | 'special' | 'exploration';
export type CriteriaType = 'hike_count' | 'elevation_gain' | 'distance' | 'group_count' | 'trail_count' | 'special';

export interface IAchievementCriteria {
  type: CriteriaType;
  value?: number;
  specialCondition?: string;
}

export interface IAchievement {
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  criteria: IAchievementCriteria;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
}

export interface IAchievementDocument extends IAchievement, Document {}

// --- Step ---
export interface IStep {
  userId: Types.ObjectId;
  trail?: Types.ObjectId;
  steps: number;
  timestamp: Date;
}

export interface IStepDocument extends IStep, Document {}

// --- Cancellation ---
export interface ICancellation {
  user: Types.ObjectId;
  trail: Types.ObjectId;
  scheduledDate: Date;
  cancelledAt: Date;
}

export interface ICancellationDocument extends ICancellation, Document {
  createdAt: Date;
  updatedAt: Date;
}

// --- Notification ---
export type NotificationType = 'join_request_approved' | 'join_request_declined' | 'upcoming_hike_reminder' | 'achievement_unlocked';

export interface INotification {
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

export interface INotificationDocument extends INotification, Document {}
