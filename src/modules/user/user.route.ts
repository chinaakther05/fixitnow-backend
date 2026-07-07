import { Router } from "express";

import { userController } from "./user.controller";

const router = Router();


router.post("/register", userController.registerUser )
router.post("/login", userController.loginUser )

export const userRoutes = router;