import { Router } from "express";

import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();


router.post("/register", userController.registerUser )
router.post("/login", userController.loginUser )
router.get("/me", authMiddleware(), userController.getMe);

export const userRoutes = router;