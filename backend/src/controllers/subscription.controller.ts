import { Request, Response } from 'express';
import User from '../models/user.model';

export const cancelSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscription: 'Basic',
        subscriptionExpiresAt: null,
      },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Subscription successfully cancelled.',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
