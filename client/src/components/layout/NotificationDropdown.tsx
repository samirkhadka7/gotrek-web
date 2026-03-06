'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { notificationService } from '@/services/notification.service';
import { Notification } from '@/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function NotificationDropdown() {
  const socket = useSocket();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch initial unread count
  useEffect(() => {
    notificationService.getUnreadCount().then((res) => {
      if (res.success) setUnreadCount(res.data.count);
    }).catch(() => {});
  }, []);

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;
    const handler = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };
    socket.on('newNotification', handler as any);
    return () => { socket.off('newNotification', handler as any); };
  }, [socket]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await notificationService.getAll({ page: 1, limit: 20 });
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount ?? 0);
      }
    } catch {}
    setLoading(false);
  }, []);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchNotifications();
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) handleMarkAsRead(notification._id);
    if (notification.data?.groupId) {
      router.push(`/groups/${notification.data.groupId}`);
      setOpen(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'join_request_approved': return '✅';
      case 'join_request_declined': return '❌';
      case 'upcoming_hike_reminder': return '⏰';
      case 'achievement_unlocked': return '🏆';
      default: return '🔔';
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button onClick={handleToggle} className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
        <Bell className="h-5 w-5 text-gray-500" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={cn(
                    'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50',
                    !n.read && 'bg-blue-50/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-base mt-0.5">{getIcon(n.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{getTimeAgo(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
// TODO: add mark all as read functionality
