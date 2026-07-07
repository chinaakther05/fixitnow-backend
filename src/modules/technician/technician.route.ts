import { Router } from "express";
import { technicianController } from "./technician.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.put("/technician/profile", authMiddleware("TECHNICIAN"), technicianController.updateProfile);
router.put("/technician/availability", authMiddleware("TECHNICIAN"), technicianController.updateAvailability);

export const technicianRoutes = router;