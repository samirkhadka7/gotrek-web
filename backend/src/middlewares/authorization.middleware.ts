import { Request, Response, NextFunction } from 'express';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.role) {
      res.status(403).json({
        success: false,
        message: 'Forbidden : User role not available',
      });
      return;
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Forbidden : You do not have permission to perform this action',
      });
    }
  };
};
