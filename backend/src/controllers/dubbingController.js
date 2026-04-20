import Dubbing from "../models/Dubbing.js";


// 🔹 Create Dub Request
export const createDub = async (req, res) => {
  try {
    console.log("🔥 createDub API hit");
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { videoId, dubLanguage } = req.body;

    if (!videoId || !dubLanguage) {
      return res
        .status(400)
        .json({ message: "videoId and dubLanguage are required" });
    }

    const existingDub = await Dubbing.findOne({
      videoId,
      userId: req.user.id,
      dubLanguage,
    });

    if (existingDub) {
      return res
        .status(400)
        .json({ message: "Dub already exists for this language" });
    }

    const dubbing = await Dubbing.create({
      videoId,
      userId: req.user.id,
      dubLanguage,
      processingStatus: "pending",
      transcript: "",
      translatedText: "",
      dubbedAudioUrl: "",
      dubbedVideoUrl: "",
    });

    console.log("✅ Dubbing created:", dubbing._id);

    res.status(201).json({
      message: "Dubbing request created successfully",
      dubbing,
    });
  } catch (error) {
    console.log("❌ createDub error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Get current user's dub for a video
export const getUserDubForVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const dubbing = await Dubbing.findOne({
      videoId,
      userId: req.user.id,
    });

    if (!dubbing) {
      return res.json({ dubbing: null });
    }

    res.json({ dubbing });
  } catch (error) {
    console.log("❌ getUserDubForVideo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Complete dubbing (Dipika integration / real output)
export const completeDubbing = async (req, res) => {
  try {
    const {
      videoId,
      transcript,
      translatedText,
      dubbedVideoUrl,
      dubbedAudioUrl,
      processingStatus,
    } = req.body;

    const dubbing = await Dubbing.findOne({
      videoId,
      userId: req.user.id,
    });

    if (!dubbing) {
      return res.status(404).json({ message: "Dubbing not found" });
    }

    // Update only if values are provided
    if (transcript !== undefined) {
      dubbing.transcript = transcript;
    }

    if (translatedText !== undefined) {
      dubbing.translatedText = translatedText;
    }

    if (dubbedVideoUrl !== undefined) {
      dubbing.dubbedVideoUrl = dubbedVideoUrl;
    }

    if (dubbedAudioUrl !== undefined) {
      dubbing.dubbedAudioUrl = dubbedAudioUrl;
    }

    // If explicit status given, use it. Otherwise mark completed.
    dubbing.processingStatus = processingStatus || "completed";

    await dubbing.save();

    res.json({
      message: "Dubbing completed successfully",
      dubbing,
    });
  } catch (err) {
    console.log("❌ completeDubbing error:", err);
    res.status(500).json({ message: "Server error" });
  }
};