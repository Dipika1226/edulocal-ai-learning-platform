import express from "express";
import { createDub, getUserDubForVideo } from "../controllers/dubbingController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, createDub);
router.get("/:videoId", protect, getUserDubForVideo);

export default router;