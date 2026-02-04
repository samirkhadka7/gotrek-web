import { Router } from "express";

import { upload } from "../config/multer";
import { adminController } from "../controllers/admin.controller";
import { isAdmin } from "../middleware/isAdmin";

export const adminRoute = Router();

adminRoute.get("/users", isAdmin, adminController.getAllUsers);
adminRoute.post("/users", isAdmin, upload.single("image"), adminController.createUser);
adminRoute.get("/users/:id", isAdmin, adminController.getUserById);
adminRoute.put("/users/:id", isAdmin, upload.single("image"), adminController.updateUser);
adminRoute.delete("/users/:id", isAdmin, adminController.deleteUser);
