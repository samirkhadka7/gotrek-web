import { Request, Response } from 'express';
import Message from '../models/message.model';

export const getMessageForGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const messages = await Message.find({ group: req.params.groupId })
      .populate('sender', 'name profileImage')
      .sort({ createdAt: 'asc' });

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages.',
    });
  }
};
