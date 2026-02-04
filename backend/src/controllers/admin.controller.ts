import { Request, Response } from "express";

import { createAdminUserDto, updateAdminUserDto } from "../dto/admin.dto";
import { AuthError, adminService } from "../services/admin.service";

const handleError = (res: Response, error: unknown) => {
  if (error instanceof AuthError) {
    return res.status(error.statusCode).json({ success: false, message: error.message });
  }
  return res.status(500).json({ success: false, message: "Internal server error" });
};

export const adminController = {
  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await adminService.getAllUsers();
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      return handleError(res, error);
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const user = await adminService.getUserById(req.params.id);
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      return handleError(res, error);
    }
  },

  async createUser(req: Request, res: Response) {
    try {
      const payload = createAdminUserDto.parse(req.body);
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const user = await adminService.createUser(payload, imageUrl);
      return res.status(201).json({ success: true, message: "User created successfully", data: user });
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({ success: false, message: error.message });
      }
      // Zod validation error
      if (typeof error === "object" && error !== null && "issues" in error) {
        const issues = (error as { issues: Array<{ message?: string }> }).issues;
        return res.status(400).json({ success: false, message: issues[0]?.message || "Validation failed" });
      }
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },

  async updateUser(req: Request, res: Response) {
    try {
      const payload = updateAdminUserDto.parse(req.body);
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      const user = await adminService.updateUser(req.params.id, payload, imageUrl);
      return res.status(200).json({ success: true, message: "User updated successfully", data: user });
    } catch (error) {
      return handleError(res, error);
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const result = await adminService.deleteUser(req.params.id);
      return res.status(200).json({ success: true, message: "User deleted successfully", data: result });
    } catch (error) {
      return handleError(res, error);
    }
  },
};
