import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import dubbingRoutes from "./routes/dubbingRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
// static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));
app.use("/api/dubbings", dubbingRoutes);
app.get("/", (req, res) => {
  res.send("EduLocal Backend Running");
});

// video routes
app.use("/api/videos", videoRoutes);

app.use((err, req, res, next) => {
  console.error("Unhandled backend error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }

  next();
});

export default app;
