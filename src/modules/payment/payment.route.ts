import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/payments/create", authMiddleware("CUSTOMER"), paymentController.createPayment);
router.post("/payments/confirm", authMiddleware("CUSTOMER"), paymentController.confirmPayment);
router.get("/payments", authMiddleware("CUSTOMER"), paymentController.getMyPayments);
router.get("/payments/:id", authMiddleware("CUSTOMER"), paymentController.getPaymentById);

export const paymentRoutes = router;