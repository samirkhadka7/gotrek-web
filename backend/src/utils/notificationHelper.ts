import Notification from '../models/notification.model';
import { emitToUser } from './socket';
import { NotificationType } from '../types/models';

interface CreateNotificationParams {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export async function createAndEmitNotification(params: CreateNotificationParams) {
  const notification = await Notification.create({
    recipient: params.recipientId,
    type: params.type,
    title: params.title,
    message: params.message,
    data: params.data || {},
  });

  emitToUser(params.recipientId, 'newNotification', {
    _id: notification._id,
    recipient: params.recipientId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data,
    read: notification.read,
    createdAt: notification.createdAt,
  });

  return notification;
}
