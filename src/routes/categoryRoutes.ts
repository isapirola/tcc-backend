import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategoriesByUser,
  getCategoryTotalDuration,
  updateCategory,
} from "../controllers/categoryController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createCategory);
router.get("/", authMiddleware, getCategoriesByUser);
router.get("/:categoryId/total-duration", getCategoryTotalDuration);
router.put("/:categoryId", authMiddleware, updateCategory);
router.delete("/:categoryId", authMiddleware, deleteCategory);

export default router;
