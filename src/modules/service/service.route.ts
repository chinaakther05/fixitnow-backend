import { Router } from "express";
import { serviceController } from "./service.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/technician/services", authMiddleware("TECHNICIAN"), serviceController.createService);
router.get("/services", serviceController.getAllServices);

export const serviceRoutes = router;