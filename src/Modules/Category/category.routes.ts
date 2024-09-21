import express from "express";
import { categoryController } from "./categoryController";
const router = express.Router();
router.post("/create", categoryController.createdCategory);
router.get("", categoryController.allCategory);
router.patch("/:id", categoryController.deletedCategory);
router.delete("/:id", categoryController.deleteCategory);

export const categoryRoutes = router;
