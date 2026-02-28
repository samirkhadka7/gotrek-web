import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface JwtPayload {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.SECRET!) as JwtPayload;

      const user = await User.findById(decoded._id || decoded.id).select('-password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Not authorized, user not found',
        });
        return;
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT verification error:', (error as Error).message);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
      return;
    }
  }

  res.status(401).json({
    success: false,
    message: 'Not authorized, no token provided',
  });
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Not authorized as an admin',
    });
  }
};

export const guideOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.role === 'guide' || req.user.role === 'admin')) {
    return next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Only guides and admins can perform this action',
    });
  }
};

export const proOrPremium = (req: Request, res: Response, next: NextFunction): void => {
  const sub = (req.user as any)?.subscription;
  if (req.user && (sub === 'Pro' || sub === 'Premium' || (req.user as any).role === 'admin')) {
    return next();
  } else {
    res.status(403).json({
      success: false,
      message: 'This feature requires a Pro or Premium subscription',
    });
  }
};
