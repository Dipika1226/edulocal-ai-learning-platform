import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import {
  deleteVideo,
  getVideoById,
  myVideos,
  reprocessVideoInsights,
  uploadFile,
  uploadLink,
} from "../controllers/videoController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const uploadsDir = path.join(process.cwd(), "src", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadsDir, { recursive: true });
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-matroska",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only MP4, WebM, MOV, and MKV videos are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

router.post("/upload-file", protect, upload.single("video"), uploadFile);
router.post("/upload-link", protect, uploadLink);
router.post("/:id/process", protect, reprocessVideoInsights);
router.get("/my-videos", protect, myVideos);
router.get("/:id", protect, getVideoById);
router.delete("/:id", protect, deleteVideo);

export default router;
