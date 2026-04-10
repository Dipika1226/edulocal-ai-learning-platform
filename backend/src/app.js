import cors from "cors";
import express from "express";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
// static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

app.get("/", (req, res) => {
  res.send("EduLocal Backend Running");
});

// video routes
app.use("/api/videos", videoRoutes);

export default app;
