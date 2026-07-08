import { Router } from "express";

import { userController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(userValidation.registerValidationSchema),
  userController.registerUser
);

router.post(
  "/login",
  validateRequest(userValidation.loginValidationSchema),
  userController.loginUser
);

router.get("/me", authMiddleware(), userController.getMe);

export const userRoutes = router;