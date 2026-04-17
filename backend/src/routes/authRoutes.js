import express from "express";
import {
  completeProfile,
  login,
  signup,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/complete-profile", protect, completeProfile);

export default router;
