import { execFile } from "child_process";
import ffmpegPath from "ffmpeg-static";
import fs from "fs";
import path from "path";
import Video from "../models/Video.js";
import User from "../models/User.js";
import {
  isTranslationEnabled,
  translateInsights,
} from "./translationService.js";

const getWhisperConfig = () => {
  const pythonPath =
    process.env.WHISPER_PYTHON_PATH ||
    "C:\\Users\\ASUS\\anaconda3\\envs\\whisper-clean\\python.exe";

  const scriptPath =
    process.env.WHISPER_SCRIPT_PATH ||
    path.join(process.cwd(), "python", "whisper_transcribe.py");

  const model = process.env.WHISPER_MODEL || "tiny";

  return { pythonPath, scriptPath, model };
};

const MIN_TRANSCRIPT_LENGTH = 20;

const normalizeWhitespace = (value = "") => value.replace(/\s+/g, " ").trim();

const collapseRepeatedWords = (value = "") => {
  const words = normalizeWhitespace(value).split(" ");
  const cleaned = [];

  for (const word of words) {
    const normalizedWord = word.toLowerCase();
    const previousWord = cleaned[cleaned.length - 1]?.toLowerCase();

    if (normalizedWord && normalizedWord === previousWord) {
      continue;
    }

    cleaned.push(word);
  }

  return cleaned.join(" ").trim();
};

const collapseRepeatedPhrases = (value = "") => {
  let text = normalizeWhitespace(value);
  text = text.replace(/\b(\w+(?:\s+\w+){0,2})\b(?:\s+\1\b){2,}/gi, "$1");
  return text;
};

const cleanTranscriptText = (value = "") =>
  collapseRepeatedWords(collapseRepeatedPhrases(value))
    .replace(/\b(uh|umm|hmm)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

const extractKeywords = (transcript = "") =>
  [...new Set(
    transcript
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 5 && Number.isNaN(Number(word)))
  )].slice(0, 6);

const cleanSegments = (segments = []) =>
  segments
    .map((segment) => ({
      ...segment,
      text: cleanTranscriptText(segment?.text || ""),
    }))
    .filter((segment) => {
      const text = segment.text || "";
      const uniqueWords = new Set(text.toLowerCase().split(/\s+/).filter(Boolean));

      return (
        typeof segment.start !== "undefined" &&
        text.length >= 8 &&
        uniqueWords.size >= 2
      );
    });

const buildNotes = ({ title, transcript, keywords }) => {
  const conceptLine =
    keywords.length > 0 ? keywords.join(", ") : "the main concepts";

  return [
    `This video covers ${title || "the lesson"}.`,
    `Focus on these concepts: ${conceptLine}.`,
    transcript.slice(0, 240) ||
      "Transcript is short, so review the full video carefully.",
    "Use the timestamps to quickly jump back to important explanations.",
  ];
};

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

const buildFallbackInsights = ({ title, transcript = "", segments = [] }) => {
  const cleanedTranscript = cleanTranscriptText(transcript);
  const keywords = extractKeywords(cleanedTranscript);
  const conceptLine =
    keywords.length > 0 ? keywords.join(", ") : "the main concepts";

  return {
    summary: `This video explains ${conceptLine}.`,
    notes: buildNotes({ title, transcript: cleanedTranscript, keywords }),
    topics: buildTopicsFromSegments(segments),
  };
};

const buildAbsolutePath = (videoUrl) =>
  path.join(process.cwd(), videoUrl.replace(/^\/+/, ""));

const getYtDlpConfig = () => {
  const command = process.env.YT_DLP_PATH || "python";
  const baseArgs = process.env.YT_DLP_PATH ? [] : ["-m", "yt_dlp"];

  return { command, baseArgs };
};

const localizeInsights = async ({ transcript, insights, targetLanguage }) => {
  if (!targetLanguage || targetLanguage === "English") {
    return {
      transcript,
      notes: insights.notes,
      topics: insights.topics,
      summary: insights.summary,
    };
  }

  if (!isTranslationEnabled()) {
    throw new Error(
      `Free translation is not ready for ${targetLanguage}. Install the Python translation package first.`
    );
  }

  try {
    return translateInsights({
      transcript,
      notes: insights.notes,
      topics: insights.topics,
      summary: insights.summary,
      targetLanguage,
      sourceLanguage: "auto",
    });
  } catch (error) {
    console.log(`Translation fallback used for ${targetLanguage}:`, error.message);

    return {
      transcript,
      notes: insights.notes,
      topics: insights.topics,
      summary: insights.summary,
    };
  }
};

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

    const { command, baseArgs } = getYtDlpConfig();

    execFile(
      command,
      [
        ...baseArgs,
        "--js-runtimes",
        "node",
        "--extract-audio",
        "--audio-format",
        "mp3",
        ...(ffmpegPath ? ["--ffmpeg-location", ffmpegPath] : []),
        "--output",
        outputTemplate,
        "--no-playlist",
        "--quiet",
        cleanUrl,
      ],
      (error, stdout, stderr) => {
        if (error) {
          console.log("yt-dlp error:", stderr || error.message);
          return reject(
            new Error(
              "yt-dlp failed. Install it with: python -m pip install -U yt-dlp"
            )
          );
        }

        if (!fs.existsSync(outputPath)) {
          return reject(new Error("Audio not found"));
        }

        resolve(outputPath);
      }
    );
  });

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

export const processVideoInsights = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) return;

  video.insightsStatus = "processing";
  video.processingError = "";
  await Video.findByIdAndUpdate(video._id, video);

  try {
    const user = await User.findById(video.uploadedBy).select("preferredLanguage");
    const targetLanguage =
      video.learningLanguage || user?.preferredLanguage || "English";

    video.learningLanguage = targetLanguage;

    if (video.videoType === "link") {
      let audioPath = "";

      try {
        audioPath = await downloadAudioFromUrl(video.videoUrl);

        const { transcript, segments } = await transcribeWithWhisper(audioPath);
        const cleanedTranscript = cleanTranscriptText(transcript);
        const cleanedSegments = cleanSegments(segments);

        if (!cleanedTranscript || cleanedTranscript.trim().length < MIN_TRANSCRIPT_LENGTH) {
          throw new Error("Whisper returned an empty or too-short transcript for link");
        }

        const insights = buildFallbackInsights({
          title: video.title,
          transcript: cleanedTranscript,
          segments: cleanedSegments,
        });
        const localized = await localizeInsights({
          transcript: cleanedTranscript,
          insights,
          targetLanguage,
        });

        video.originalTranscript = transcript;
        video.transcript = localized.transcript;
        video.notes = localized.notes;
        video.topics = localized.topics;
        video.insightsSummary = localized.summary;
        video.insightsStatus = "completed";
        video.processingError = "";
        video.processedAt = new Date();
        await Video.findByIdAndUpdate(video._id, video);
      } finally {
        if (audioPath && fs.existsSync(audioPath)) {
          fs.unlinkSync(audioPath);
        }
      }
      return;
    }

    const filePath = buildAbsolutePath(video.videoUrl);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Uploaded file not found at ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    if (stats.size < 1000) {
      throw new Error("Uploaded video is empty or corrupted");
    }

    const { scriptPath } = getWhisperConfig();
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Whisper script not found at ${scriptPath}`);
    }

    const { transcript, segments } = await transcribeWithWhisper(filePath);
    const cleanedTranscript = cleanTranscriptText(transcript);
    const cleanedSegments = cleanSegments(segments);

    if (!cleanedTranscript || cleanedTranscript.trim().length < MIN_TRANSCRIPT_LENGTH) {
      throw new Error("Whisper returned an empty or too-short transcript");
    }

    const insights = buildFallbackInsights({
      title: video.title,
      transcript: cleanedTranscript,
      segments: cleanedSegments,
    });
    const localized = await localizeInsights({
      transcript: cleanedTranscript,
      insights,
      targetLanguage,
    });

    video.originalTranscript = transcript;
    video.transcript = localized.transcript;
    video.notes = localized.notes;
    video.topics = localized.topics;
    video.insightsSummary = localized.summary;
    video.insightsStatus = "completed";
    video.processingError = "";
    video.processedAt = new Date();
    await Video.findByIdAndUpdate(video._id, video);
  } catch (err) {
    console.log("Processing error:", err.message);
    video.insightsStatus = "failed";
    video.processingError = err.message;
    video.processedAt = new Date();
    await Video.findByIdAndUpdate(video._id, video);
  }
};

export const queueVideoInsights = (videoId) => {
  setTimeout(() => processVideoInsights(videoId), 0);
};
