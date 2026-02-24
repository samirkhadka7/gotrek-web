import api from './api';

export const notificationService = {
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/notifications', { params }).then((r) => r.data),

  getUnreadCount: () =>
    api.get('/notifications/unread-count').then((r) => r.data),

  markAsRead: (id: string) =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () =>
    api.patch('/notifications/read-all').then((r) => r.data),
};
