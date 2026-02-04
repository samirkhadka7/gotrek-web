import { Router } from "express";

import { upload } from "../config/multer";
import { authController } from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/isAuthenticated";

export const authRoute = Router();

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
authRoute.put("/:id", isAuthenticated, upload.single("image"), authController.updateProfile);
