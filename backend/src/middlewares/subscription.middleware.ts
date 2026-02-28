import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const checkSubscriptionStatus = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    return next();
  }

  const user = req.user;

  if (user.subscriptionExpiresAt && new Date() > new Date(user.subscriptionExpiresAt)) {
    try {
      const userToUpdate = await User.findById(user._id);
      if (userToUpdate) {
        userToUpdate.subscription = 'Basic';
        userToUpdate.subscriptionExpiresAt = null;
        await userToUpdate.save();

        req.user.subscription = 'Basic';
        req.user.subscriptionExpiresAt = null;
      }
    } catch (error) {
      console.error(`Failed to downgrade user ${user._id}:`, error);
    }
  }

  next();
};
