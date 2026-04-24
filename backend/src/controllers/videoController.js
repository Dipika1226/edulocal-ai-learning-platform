import fs from "fs";
import User from "../models/User.js";
import Video from "../models/Video.js";
import { queueVideoInsights } from "../services/videoInsightsService.js";

// 🔹 Upload Video Link
export const uploadLink = async (req, res) => {
  try {
    const { title, description, videoUrl, isPublic } = req.body;
    const user = await User.findById(req.user.id).select("preferredLanguage");

    if (!title || !videoUrl) {
      return res.status(400).json({ message: "Title & videoUrl required" });
    }

    const video = await Video.create({
      title,
      description: description || "",
      videoType: "link",
      videoUrl,
      learningLanguage: user?.preferredLanguage || "English",
      uploadedBy: req.user.id,
      isPublic: isPublic === true || isPublic === "true",
    });

    queueVideoInsights(video._id.toString());

    res.status(201).json({
      message: "Link uploaded",
      video,
    });
  } catch (error) {
    console.log("Upload link error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Upload Video File
export const uploadFile = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    const user = await User.findById(req.user.id).select("preferredLanguage");

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title & video file required" });
    }

    if (req.file.size === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Corrupted upload" });
    }

    const video = await Video.create({
      title,
      description: description || "",
      videoType: "file",
      videoUrl: `/uploads/${req.file.filename}`,
      learningLanguage: user?.preferredLanguage || "English",
      uploadedBy: req.user.id,
      isPublic: isPublic === true || isPublic === "true",
    });

    queueVideoInsights(video._id.toString());

    res.status(201).json({
      message: "File uploaded",
      video,
    });
  } catch (error) {
    console.log("Upload file error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get My Videos
export const myVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      uploadedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      totalUploaded: videos.length,
      videos,
    });
  } catch (error) {
    console.log("My videos error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get Public Videos
export const getPublicVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublic: true }).sort({
      createdAt: -1,
    });

    res.json({ videos });
  } catch (error) {
    console.log("Public videos error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get Video By ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ video });
  } catch (error) {
    console.log("Get video by id error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Reprocess Video Insights
export const reprocessVideoInsights = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { language } = req.body;

    if (language) {
      video.learningLanguage = language;
    }

    video.insightsStatus = "pending";
    video.processingError = "";
    await video.save();

    queueVideoInsights(video._id.toString());

    res.json({ message: "Video processing restarted", video });
  } catch (error) {
    console.log("Reprocess error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Update learning language and reprocess
export const updateVideoLanguage = async (req, res) => {
  try {
    const { learningLanguage } = req.body;
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (!learningLanguage) {
      return res.status(400).json({ message: "learningLanguage is required" });
    }

    video.learningLanguage = learningLanguage;
    video.insightsStatus = "pending";
    video.processingError = "";

    await video.save();

    queueVideoInsights(video._id.toString());

    res.json({
      message: "Language updated successfully",
      video,
    });
  } catch (error) {
    console.log("updateVideoLanguage error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete Video
export const deleteVideo = async (req, res) => {
  try {
    console.log("Delete API hit 🔥");
    console.log("User ID:", req.user.id);
    console.log("Video ID:", req.params.id);

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await video.deleteOne();

    console.log("Deleted successfully ✅");
    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.log("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
};