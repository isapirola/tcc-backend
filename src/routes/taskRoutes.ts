// src/routes/taskRoutes.ts
import express from "express";
import {
  createTask,
  deleteTask,
  getTasksByUser,
  updateTask,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasksByUser);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask);

export default router;
