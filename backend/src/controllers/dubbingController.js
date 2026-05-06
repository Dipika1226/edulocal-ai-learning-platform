import { createDubbedMedia } from "../services/dubbingService.js";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import Dubbing from "../models/Dubbing.js";
import Video from "../models/Video.js";
import { translateText } from "../services/translationService.js";
// 🔹 Run any terminal command
const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Command Error:", error);
        console.error("❌ stderr:", stderr);
        return reject(error);
      }
      resolve(stdout.trim());
    });
  });
};

// 🔹 Whisper function
const runWhisper = (videoPath) => {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.WHISPER_PYTHON_PATH;
    const scriptPath = process.env.WHISPER_SCRIPT_PATH;

    exec(`"${pythonPath}" "${scriptPath}" "${videoPath}"`, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Whisper Error:", error);
        console.error("❌ Whisper stderr:", stderr);
        return reject(error);
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (err) {
        console.error("❌ JSON Parse Error:", err);
        console.error("❌ Whisper stdout:", stdout);
        reject(err);
      }
    });
  });
};

// 🔹 Download link video locally for processing
const downloadLinkVideo = async (url) => {
  const downloadsDir = "backend/uploads/link-temp";

  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
  }

  const outputTemplate = path.join(downloadsDir, "%(id)s.%(ext)s");

  await runCommand(`python -m yt_dlp -f mp4 -o "${outputTemplate}" "${url}"`);

  const files = fs
    .readdirSync(downloadsDir)
    .map((name) => ({
      name,
      fullPath: path.join(downloadsDir, name),
      time: fs.statSync(path.join(downloadsDir, name)).mtime.getTime(),
    }))
    .sort((a, b) => b.time - a.time);

  if (!files.length) {
    throw new Error("Downloaded file not found");
  }

  return files[0].fullPath;
};

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

    try {
      const video = await Video.findById(videoId);

      if (!video || !video.videoUrl) {
        throw new Error("Video not found or invalid videoUrl");
      }

      let videoPath = "";

      if (video.videoType === "file") {
        videoPath = `.${video.videoUrl}`;
      } else if (video.videoType === "link") {
        console.log("🔗 Downloading link video:", video.videoUrl);
        videoPath = await downloadLinkVideo(video.videoUrl);
      } else {
        throw new Error("Unsupported video type");
      }

      console.log("🎯 Running Whisper on:", videoPath);

      const transcriptResult = await runWhisper(videoPath);

      dubbing.transcript = transcriptResult.text || "";

if (!dubbing.transcript.trim()) {
  throw new Error("Transcript is empty");
}

if (dubLanguage !== "English") {
  console.log(`🌐 Translating transcript to ${dubLanguage}...`);

  dubbing.translatedText = await translateText({
    text: dubbing.transcript,
    targetLanguage: dubLanguage,
    sourceLanguage: "auto",
  });
} else {
  dubbing.translatedText = dubbing.transcript;
}

console.log("🎙️ Creating dubbed audio and video...");

const textForDubbing =
  dubLanguage === "English" ? dubbing.transcript : dubbing.translatedText;

const dubbedMedia = await createDubbedMedia({
  videoPath,
  text: textForDubbing,
  language: dubLanguage,
});
      dubbing.dubbedAudioUrl = dubbedMedia.dubbedAudioUrl;
      dubbing.dubbedVideoUrl = dubbedMedia.dubbedVideoUrl;
      dubbing.processingStatus = "completed";

      await dubbing.save();

      console.log("✅ Transcript and dubbed video saved");
    } catch (err) {
      console.log("❌ Whisper/dubbing processing failed:", err.message);

      dubbing.processingStatus = "failed";
      await dubbing.save();
    }

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
    const { dubLanguage } = req.query;
    const dubbing = await Dubbing.findOne({
  videoId,
  userId: req.user.id,
  ...(dubLanguage ? { dubLanguage } : {}),
}).sort({ createdAt: -1 });
    if (!dubbing) {
      return res.json({ dubbing: null });
    }

    res.json({ dubbing });
  } catch (error) {
    console.log("❌ getUserDubForVideo error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Complete Dubbing
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
}).sort({ createdAt: -1 });

    if (!dubbing) {
      return res.status(404).json({ message: "Dubbing not found" });
    }

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