import { Router } from "express";
import { adminController } from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/admin/users", authMiddleware("ADMIN"), adminController.getAllUsers);
router.patch("/admin/users/:id", authMiddleware("ADMIN"), adminController.updateUserStatus);
router.get("/admin/bookings", authMiddleware("ADMIN"), adminController.getAllBookings);

export const adminRoutes = router;