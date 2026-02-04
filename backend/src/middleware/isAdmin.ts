import { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "./isAuthenticated";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  isAuthenticated(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
    }
    next();
  });
};
