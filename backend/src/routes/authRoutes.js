import express from "express";
import {
  completeProfile,
  getMe,
  login,
  signup
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/complete-profile", protect, completeProfile);

// 🔥 ADD THIS
router.get("/me", protect, getMe);

export default router;