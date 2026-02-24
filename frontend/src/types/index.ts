export interface EmergencyContact {
  name?: string;
  phone?: string;
}

export interface UserStats {
  totalHikes: number;
  totalDistance: number;
  totalElevation: number;
  totalHours: number;
  hikesJoined: number;
  hikesLed: number;
}

export interface CompletedTrail {
  trail: string | Trail;
  completedAt: string;
}

export interface JoinedTrail {
  _id?: string;
  trail: string | Trail;
  scheduledDate: string;
  addedAt?: string;
}

export interface GuideProfile {
  verified: boolean;
  experienceYears: number;
  specialization: string[];
  languages: string[];
  certifications: string[];
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'guide' | 'admin';
  subscription: 'Basic' | 'Pro' | 'Premium';
  subscriptionExpiresAt?: string | null;
  profileImage?: string;
  hikerType?: 'new' | 'experienced';
  ageGroup?: '18-24' | '24-35' | '35-44' | '45-54' | '55-64' | '65+';
  emergencyContact?: EmergencyContact;
  bio?: string;
  joinDate?: string;
  active?: boolean;
  stats?: UserStats;
  achievements?: string[];
  completedTrails?: CompletedTrail[];
  joinedTrails?: JoinedTrail[];
  guideProfile?: GuideProfile;
  googleId?: string;
  groups?: Group[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TrailDuration {
  min?: number;
  max?: number;
}

export interface TrailRating {
  _id?: string;
  user: string | User;
  rating: number;
  review?: string;
  createdAt?: string;
}

export interface Trail {
  _id: string;
  name: string;
  location: string;
  distance: number;
  elevation: number;
  duration?: TrailDuration;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  description?: string;
  images?: string[];
  features?: string[];
  seasons?: string[];
  ratings?: TrailRating[];
  averageRating?: number;
  numRatings?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GroupParticipant {
  _id?: string;
  user: string | User;
  status: 'pending' | 'confirmed' | 'declined';
  message?: string;
  joinedAt?: string;
}

export interface GroupComment {
  user: string | User;
  text: string;
  createAt?: string;
}

export interface Group {
  _id: string;
  title: string;
  trail: string | Trail;
  date: string;
  description?: string;
  maxSize?: number;
  leader: string | User;
  participants?: GroupParticipant[];
  status?: 'upcoming' | 'active' | 'completed' | 'cancelled';
  meetingPoint?: { description?: string };
  requirements?: string[];
  difficulty?: string;
  photos?: string[];
  comments?: GroupComment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Step {
  _id: string;
  userId: string | User;
  trail?: string | Trail;
  steps: number;
  timestamp?: string;
}

export interface ChecklistItem {
  _id?: string;
  id?: number;
  name: string;
  checked: boolean;
  category?: string;
}

export interface Checklist {
  _id?: string;
  user?: string | User;
  name?: string;
  experienceLevel?: 'new' | 'experienced';
  duration?: 'half-day' | 'full-day' | 'multi-day';
  weather?: 'mild' | 'hot' | 'cold' | 'rainy';
  items?: ChecklistItem[];
  associatedHike?: string | Trail;
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinRequest {
  _id: string;
  user: string | User;
  group: string | Group;
  status: 'pending' | 'confirmed' | 'declined';
  message?: string;
  createdAt?: string;
}

export interface Payment {
  _id: string;
  userId: string | User;
  plan: 'Pro' | 'Premium';
  amount: number;
  transaction_uuid: string;
  status: 'pending' | 'success' | 'failure';
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id?: string;
  group: string | Group;
  sender: string | User;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ActivityType = 'user_joined' | 'group_created' | 'hike_joined' | 'hike_completed' | 'hike_cancelled';

export interface Activity {
  _id?: string;
  type: ActivityType;
  user: string | User;
  trail?: string | Trail | null;
  createdAt?: string;
}

export interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestones' | 'elevation' | 'social' | 'special' | 'exploration';
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt?: string;
}

export interface Cancellation {
  _id?: string;
  user: string | User;
  trail: string | Trail;
  scheduledDate: string;
  cancelledAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

export type NotificationType = 'join_request_approved' | 'join_request_declined' | 'upcoming_hike_reminder' | 'achievement_unlocked';

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}
