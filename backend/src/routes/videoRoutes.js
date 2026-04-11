import express from "express";
import multer from "multer";
import { deleteVideo, myVideos, uploadFile, uploadLink } from "../controllers/videoController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "video/mp4") cb(null, true);
  else cb(new Error("Only mp4 allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

router.post("/upload-file", protect, upload.single("video"), uploadFile);
router.post("/upload-link", protect, uploadLink);
router.get("/my-videos", protect, myVideos);
router.delete("/:id", protect, deleteVideo);

export default router;
