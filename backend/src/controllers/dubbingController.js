import Dubbing from "../models/Dubbing.js";

export const createDub = async (req, res) => {
  try {
    console.log("🔥 createDub API hit");
    console.log("Body:", req.body);
    console.log("User:", req.user);

    const { videoId, dubLanguage } = req.body;

    if (!videoId || !dubLanguage) {
      return res.status(400).json({ message: "videoId and dubLanguage are required" });
    }

    const existingDub = await Dubbing.findOne({
      videoId,
      userId: req.user.id,
      dubLanguage,
    });

    if (existingDub) {
      return res.status(400).json({ message: "Dub already exists for this language" });
    }

   const dubbing = await Dubbing.create({
  videoId,
  userId: req.user.id,
  dubLanguage,
  processingStatus: "pending",
});

console.log("✅ Dubbing created:", dubbing._id);

// 🔥 FORCE UPDATE after 5 sec
setTimeout(async () => {
  try {
    console.log("⏳ Running dummy completion...");

    await Dubbing.findByIdAndUpdate(dubbing._id, {
      processingStatus: "completed",
      dubbedVideoUrl: "/uploads/demo.mp4",
    });

    console.log("✅ Dummy dubbing completed");
  } catch (err) {
    console.log("❌ Dummy update error:", err);
  }
}, 5000);

    res.status(201).json({
      message: "Dubbing request created successfully",
      dubbing,
    });
  } catch (error) {
    console.log("❌ createDub error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
    console.log(" getUserDubForVideo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};