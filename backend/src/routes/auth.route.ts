import { Router } from "express";

import { authController } from "../controllers/auth.controller";

export const authRoute = Router();

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
