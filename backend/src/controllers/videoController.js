import Video from "../models/Video.js";

export const uploadLink = async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ message: "Title & videoUrl required" });
    }

    const video = await Video.create({
      title,
      description,
      videoType: "link",
      videoUrl,
      uploadedBy: req.user.id,
    });

    res.status(201).json({ message: "Link uploaded", video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title & video file required" });
    }

    const video = await Video.create({
      title,
      description,
      videoType: "file",
      videoUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
    });

    res.status(201).json({ message: "File uploaded", video });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const myVideos = async (req, res) => {
  try {
    const videos = await Video.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

    res.json({
      totalUploaded: videos.length,
      videos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
