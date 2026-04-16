import Video from "../models/Video.js";


// 🔹 Upload Video Link
export const uploadLink = async (req, res) => {
  try {
    const { title, description, videoUrl, isPublic } = req.body;

    if (!title || !videoUrl) {
      return res.status(400).json({ message: "Title & videoUrl required" });
    }

    const video = await Video.create({
      title,
      description: description || "",
      videoType: "link",
      videoUrl,
      uploadedBy: req.user.id,
      isPublic: isPublic === true || isPublic === "true",
    });

    res.status(201).json({ message: "Link uploaded successfully", video });
  } catch (error) {
    console.log("Upload link error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Upload Video File
export const uploadFile = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title & video file required" });
    }

    const video = await Video.create({
      title,
      description: description || "",
      videoType: "file",
      videoUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
      isPublic: isPublic === true || isPublic === "true",
    });

    res.status(201).json({ message: "File uploaded successfully", video });
  } catch (error) {
    console.log("Upload file error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Get My Videos (private + public of logged user)
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


// 🔹 Get Public Videos (for dashboard/recommendation)
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