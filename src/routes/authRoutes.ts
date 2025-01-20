import express from "express";
import {
  deleteUserController,
  getUserDataController,
  loginController,
  refreshTokenController,
  registerController,
  updateUserController,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", loginController);
router.post("/register", registerController);
router.post("/refresh", refreshTokenController);
router.get("/data", authMiddleware, getUserDataController);
router.put("/data", authMiddleware, updateUserController);
router.delete("/data", authMiddleware, deleteUserController);

export default router;
