import { Router } from "express";
import { reviewController } from "./review.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/reviews", authMiddleware("CUSTOMER"), reviewController.createReview);

export const reviewRoutes = router;