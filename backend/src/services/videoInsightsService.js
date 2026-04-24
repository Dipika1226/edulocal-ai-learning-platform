import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import Video from "../models/Video.js";

/* 🔥 ENV BASED CONFIG (NO HARDCODE) */
const getWhisperConfig = () => {
  const pythonPath =
    process.env.WHISPER_PYTHON_PATH ||
    path.join(process.cwd(), "venv", "Scripts", "python.exe");

  const scriptPath =
    process.env.WHISPER_SCRIPT_PATH ||
    path.join(process.cwd(), "python", "whisper_transcribe.py");

  const model = process.env.WHISPER_MODEL || "tiny";

  return { pythonPath, scriptPath, model };
};

const MIN_TRANSCRIPT_LENGTH = 5;

/* ---------------- CLEANING ---------------- */

const cleanTranscriptText = (text = "") =>
  text
    .replace(/\b(uh|umm|hmm)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const extractKeywords = (text = "") =>
  [...new Set(text.toLowerCase().split(/\s+/).filter((w) => w.length > 5))].slice(0, 6);

/* ---------------- TOPICS / TIMESTAMPS ---------------- */

const cleanSegments = (segments = []) =>
  segments
    .map((segment) => ({
      ...segment,
      text: cleanTranscriptText(segment?.text || ""),
    }))
    .filter((segment) => {
      const text = segment.text || "";
      return typeof segment.start !== "undefined" && text.length >= 8;
    });

const buildTopicsFromSegments = (segments = []) => {
  if (!Array.isArray(segments) || segments.length === 0) {
    return [
      {
        label: "Introduction",
        timestamp: 0,
        summary: "Opening section of the lesson.",
      },
    ];
  }

  const normalized = cleanSegments(segments);

  if (normalized.length === 0) {
    return [
      {
        label: "Introduction",
        timestamp: 0,
        summary: "Opening section of the lesson.",
      },
    ];
  }

  const desiredTopicCount = Math.min(
    5,
    Math.max(3, Math.ceil(normalized.length / 4))
  );

  const chunkSize = Math.max(1, Math.ceil(normalized.length / desiredTopicCount));
  const topics = [];

  for (let index = 0; index < normalized.length; index += chunkSize) {
    const chunk = normalized.slice(index, index + chunkSize);

    if (chunk.length === 0) continue;

    const chunkText = cleanTranscriptText(
      chunk.map((segment) => segment.text).join(" ")
    );

    const keywords = extractKeywords(chunkText);

    const label =
      keywords.length > 0
        ? keywords
            .slice(0, 2)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" & ")
        : `Topic ${topics.length + 1}`;

    topics.push({
      label,
      timestamp: Math.max(0, Math.floor(Number(chunk[0].start) || 0)),
      summary:
        chunkText.slice(0, 140) ||
        "Important explanation from this section of the lesson.",
    });
  }

  return topics;
};

/* ---------------- YT-DLP DOWNLOAD ---------------- */

const downloadAudioFromUrl = (url) =>
  new Promise((resolve, reject) => {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    const outputTemplate = path.join(tempDir, `audio_${Date.now()}.%(ext)s`);
    const outputPath = outputTemplate.replace("%(ext)s", "mp3");

    let cleanUrl = url;
    try {
      const parsed = new URL(url);
      const v = parsed.searchParams.get("v");
      if (v) cleanUrl = `https://www.youtube.com/watch?v=${v}`;
    } catch {}

    execFile(
      "yt-dlp",
      [
        "--js-runtimes",
        "node",
        "--extract-audio",
        "--audio-format",
        "mp3",
        "--output",
        outputTemplate,
        "--no-playlist",
        "--quiet",
        cleanUrl,
      ],
      (error, stdout, stderr) => {
        if (error) {
          console.log("yt-dlp error:", stderr || error.message);
          return reject(new Error("yt-dlp failed"));
        }

        if (!fs.existsSync(outputPath)) {
          return reject(new Error("Audio not found"));
        }

        resolve(outputPath);
      }
    );
  });

/* ---------------- WHISPER ---------------- */

const transcribeWithWhisper = (filePath) =>
  new Promise((resolve, reject) => {
    const { pythonPath, scriptPath, model } = getWhisperConfig();

    console.log("Running Whisper with:");
    console.log("python:", pythonPath);
    console.log("script:", scriptPath);
    console.log("file:", filePath);
    console.log("model:", model);

    execFile(
      pythonPath,
      [scriptPath, filePath, model],
      { maxBuffer: 1024 * 1024 * 50, timeout: 20 * 60 * 1000 },
      (error, stdout, stderr) => {
        if (stderr?.trim()) {
          console.log("Whisper STDERR:", stderr);
        }

        if (error) return reject(error);

        try {
          const parsed = JSON.parse(stdout);
          resolve({
            transcript: parsed.text || "",
            segments: Array.isArray(parsed.segments) ? parsed.segments : [],
          });
        } catch {
          reject(new Error("Invalid Whisper output"));
        }
      }
    );
  });

/* ---------------- MAIN PROCESS ---------------- */

export const processVideoInsights = async (videoId) => {
  const video = await Video.findById(videoId);
  const targetLanguage = video.learningLanguage || "English";
  console.log("Processing in language:", targetLanguage);
  if (!video) return;

  video.insightsStatus = "processing";
  video.processingError = "";
  await video.save();

  try {
    let filePath;

    if (video.videoType === "file") {
      filePath = path.join(process.cwd(), video.videoUrl.replace(/^\/+/, ""));
    } else {
      filePath = await downloadAudioFromUrl(video.videoUrl);
    }

    const { transcript, segments } = await transcribeWithWhisper(filePath);
    const clean = cleanTranscriptText(transcript);

    if (!clean || clean.length < MIN_TRANSCRIPT_LENGTH) {
      throw new Error("Transcript too short");
    }

    const keywords = extractKeywords(clean);
    const topics = buildTopicsFromSegments(segments);

    console.log("Generated topics:", topics);
    console.log("Transcript segments count:", segments?.length || 0);

    video.transcript = clean;
    video.notes = [
  `Language: ${targetLanguage}`,
  `Concepts: ${keywords.join(", ")}`,
  clean.slice(0, 200),
];
    video.topics = topics;
    video.insightsSummary = `(${targetLanguage}) This video explains ${keywords.join(", ")}`;
    video.insightsStatus = "completed";
    video.processingError = "";

    await video.save();

    if (video.videoType !== "file" && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.log("Processing error:", err.message);
    video.insightsStatus = "failed";
    video.processingError = err.message;
    await video.save();
  }
};

export const queueVideoInsights = (videoId) => {
  setTimeout(() => processVideoInsights(videoId), 0);
};