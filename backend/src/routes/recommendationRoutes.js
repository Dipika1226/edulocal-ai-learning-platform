import express from "express";
import {
  getRecommendations,
  trackWatch,
} from "../controllers/recommendationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET  /api/recommendations       → personalized video list
router.get("/", protect, getRecommendations);

// POST /api/recommendations/watch → record a watch event
router.post("/watch", protect, trackWatch);

export default router;
