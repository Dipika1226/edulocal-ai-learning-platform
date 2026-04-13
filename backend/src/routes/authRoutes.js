import express from "express";
import {
    getMe,
    login,
    requestPasswordReset,
    resetPassword,
    signup,
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

// 👇 YEH IMPORTANT LINE
router.get("/me", protect, getMe);

export default router;