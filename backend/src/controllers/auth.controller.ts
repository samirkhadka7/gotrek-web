import { Request, Response } from "express";

import { loginUserDto, registerUserDto } from "../dto/auth.dto";
import { AuthError, authService } from "../services/auth.service";

const getValidationMessage = (error: unknown) => {
  if (typeof error !== "object" || error === null) {
    return "Validation failed";
  }

  if (!("issues" in error) || !Array.isArray((error as { issues?: unknown }).issues)) {
    return "Validation failed";
  }

  const issues = (error as { issues: Array<{ message?: string }> }).issues;
  return issues[0]?.message || "Validation failed";
};

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const payload = registerUserDto.parse(req.body);
      const user = await authService.register(payload);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      const validationMessage = getValidationMessage(error);
      if (validationMessage !== "Validation failed") {
        return res.status(400).json({
          success: false,
          message: validationMessage,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const payload = loginUserDto.parse(req.body);
      const loginResponse = await authService.login(payload);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: loginResponse,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }

      const validationMessage = getValidationMessage(error);
      if (validationMessage !== "Validation failed") {
        return res.status(400).json({
          success: false,
          message: validationMessage,
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};
