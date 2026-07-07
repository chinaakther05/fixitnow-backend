import { Router } from "express";
import { categoryController } from "./category.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Public
router.get("/categories", categoryController.getAllCategories);

// Admin
router.get("/admin/categories", authMiddleware("ADMIN"), categoryController.getAllCategories);
router.post("/admin/categories", authMiddleware("ADMIN"), categoryController.createCategory);

export const categoryRoutes = router;