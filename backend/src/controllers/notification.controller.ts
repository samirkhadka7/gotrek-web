import { Request, Response } from 'express';
import Notification from '../models/notification.model';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Notification.countDocuments({ recipient: userId }),
      Notification.countDocuments({ recipient: userId, read: false }),
    ]);

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user!._id, read: false });
    res.status(200).json({ success: true, data: { count } });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user!._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }
    res.status(200).json({ success: true, data: notification });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { recipient: req.user!._id, read: false },
      { read: true }
    );
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
// TODO: batch notification delivery for performance
