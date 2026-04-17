import { execFile } from "child_process";
import fs from "fs";
import path from "path";
import Video from "../models/Video.js";
import User from "../models/User.js";

const DEFAULT_WHISPER_PYTHON =
  "C:\\Users\\ASUS\\anaconda3\\envs\\whisper-clean\\python.exe";

const WHISPER_PYTHON_PATH =
  process.env.WHISPER_PYTHON_PATH || DEFAULT_WHISPER_PYTHON;

const WHISPER_SCRIPT_PATH =
  process.env.WHISPER_SCRIPT_PATH ||
  path.join(process.cwd(), "python", "whisper_transcribe.py");

const WHISPER_MODEL = process.env.WHISPER_MODEL || "small";

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

const extractKeywords = (transcript = "") =>
  [...new Set(
    transcript
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 5 && Number.isNaN(Number(word)))
  )].slice(0, 6);

const buildNotes = ({ title, transcript, keywords }) => {
  const conceptLine =
    keywords.length > 0 ? keywords.join(", ") : "the main concepts";

  return [
    `This video covers ${title || "the lesson"}.`,
    `Focus on these concepts: ${conceptLine}.`,
    transcript.slice(0, 240) || "Transcript is short, so review the full video carefully.",
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
      chunk.map((segment) => segment.text.trim()).join(" ")
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

const transcribeWithWhisper = (filePath) =>
  new Promise((resolve, reject) => {
    const args = [WHISPER_SCRIPT_PATH, filePath, WHISPER_MODEL];

    console.log("Running Whisper with:");
    console.log("python:", WHISPER_PYTHON_PATH);
    console.log("script:", WHISPER_SCRIPT_PATH);
    console.log("file:", filePath);
    console.log("model:", WHISPER_MODEL);

    execFile(
      WHISPER_PYTHON_PATH,
      args,
      { maxBuffer: 1024 * 1024 * 50 },
      (error, stdout, stderr) => {
        if (stderr?.trim()) {
          console.log("Whisper STDERR:", stderr);
        }

        if (error) {
          return reject(
            new Error(`Whisper execution failed: ${error.message}`)
          );
        }

        try {
          const parsed = JSON.parse(stdout);

          resolve({
            transcript: parsed.text || "",
            segments: Array.isArray(parsed.segments) ? parsed.segments : [],
          });
        } catch {
          reject(new Error("Whisper returned invalid JSON"));
        }
      }
    );
  });

export const processVideoInsights = async (videoId) => {
  const video = await Video.findById(videoId);
  if (!video) return;

  video.insightsStatus = "processing";
  video.processingError = "";
  await video.save();

  try {
    const user = await User.findById(video.uploadedBy).select("preferredLanguage");
    const targetLanguage =
      video.learningLanguage || user?.preferredLanguage || "English";

    video.learningLanguage = targetLanguage;

    if (video.videoType !== "file") {
      const fallback = buildFallbackInsights({
        title: video.title,
        transcript: "",
        segments: [],
      });

      video.originalTranscript = "";
      video.transcript = "";
      video.notes = fallback.notes;
      video.topics = fallback.topics;
      video.insightsSummary =
        "Transcript generation for link videos is not built yet. File uploads are supported first.";
      video.insightsStatus = "skipped";
      video.processedAt = new Date();
      await video.save();
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

    if (!fs.existsSync(WHISPER_SCRIPT_PATH)) {
      throw new Error(`Whisper script not found at ${WHISPER_SCRIPT_PATH}`);
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

    video.originalTranscript = transcript;
    video.transcript = cleanedTranscript;
    video.notes = insights.notes;
    video.topics = insights.topics;
    video.insightsSummary = insights.summary;
    video.insightsStatus = "completed";
    video.processingError = "";
    video.processedAt = new Date();

    await video.save();
  } catch (error) {
    console.log("Processing error:", error.message);

    video.insightsStatus = "failed";
    video.processingError = error.message;
    video.processedAt = new Date();
    await video.save();
  }
};

export const queueVideoInsights = (videoId) => {
  setTimeout(() => {
    processVideoInsights(videoId).catch((err) => {
      console.error("Queue error:", err.message);
    });
  }, 0);
};
