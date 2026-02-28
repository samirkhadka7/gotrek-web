import { IMessageDocument } from './models';

export interface NotificationPayload {
  _id: string;
  recipient: string;
  type: 'join_request_approved' | 'join_request_declined' | 'upcoming_hike_reminder' | 'achievement_unlocked';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

export interface ServerToClientEvents {
  newMessage: (message: IMessageDocument) => void;
  messageError: (data: { message: string }) => void;
  newNotification: (notification: NotificationPayload) => void;
}

export interface ClientToServerEvents {
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  sendMessage: (data: { groupId: string; senderId: string; text: string }) => void;
  register: (userId: string) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
