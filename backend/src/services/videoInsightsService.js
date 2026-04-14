import fs from "fs/promises";
import path from "path";
import Video from "../models/Video.js";
import User from "../models/User.js";

const OPENAI_API_BASE_URL = process.env.OPENAI_API_BASE_URL || "https://api.openai.com/v1";
const TRANSCRIPTION_MODEL = process.env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1";
const SUMMARIZATION_MODEL = process.env.OPENAI_SUMMARIZATION_MODEL || "gpt-4o-mini";

const parseMaybeJson = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
};

const fallbackInsights = ({
  title,
  description,
  transcript,
  videoType,
  targetLanguage,
}) => {
  const cleanTitle = (title || "Learning video").replace(/\.[^/.]+$/, "");
  const cleanDescription = description || "Study the uploaded lesson with guided checkpoints.";
  const words = transcript
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 4);
  const focusTerms = [...new Set(words)].slice(0, 5);
  const conceptLine =
    focusTerms.length > 0 ? focusTerms.join(", ") : "the main concepts from the lesson";

  return {
    translatedTranscript: transcript || "",
    summary: `This lesson on ${cleanTitle} covers ${conceptLine} in ${targetLanguage}.`,
    notes: [
      `${cleanTitle} introduces the lesson goal and the key outcomes for the learner in ${targetLanguage}.`,
      `Important concepts mentioned include ${conceptLine}.`,
      transcript ? transcript.slice(0, 2800) : cleanDescription,
      "Use the timestamps to revisit the sections that need more revision.",
    ],
    topics: [
      {
        label: "Introduction",
        timestamp: 0,
        summary: `Overview of ${cleanTitle} and the learning goals.`,
      },
      {
        label: "Main explanation",
        timestamp: 60,
        summary: "The lesson moves into the core explanation and examples.",
      },
      {
        label: videoType === "link" ? "Wrap-up" : "Practice and recap",
        timestamp: 180,
        summary: "The final section reinforces the main learning outcomes.",
      },
    ],
  };
};

const buildTranscriptPrompt = ({ title, description, transcript, segments, targetLanguage }) => `
You are helping turn a video transcript into a study-friendly learning outline.
Translate the final learner-facing output into ${targetLanguage}.

Video title: ${title || "Untitled video"}
Video description: ${description || "No description provided"}

Transcript:
${transcript}

Segments with approximate timestamps:
${JSON.stringify(
  segments.map((segment) => ({
    start: Math.max(0, Math.floor(segment.start || 0)),
    end: Math.max(0, Math.floor(segment.end || 0)),
    text: segment.text || "",
  })),
  null,
  2
)}

Return valid JSON only in this shape:
{
  "translatedTranscript": "full translated transcript in ${targetLanguage}",
  "summary": "2-3 sentence overall summary",
  "notes": ["4-6 concise revision notes"],
  "topics": [
    {
      "label": "short topic title",
      "timestamp": 0,
      "summary": "what this section covers"
    }
  ]
}

Rules:
- Use the timestamps from the provided segments when possible.
- Return 4 to 6 topics.
- Each topic label must be short and study-friendly.
- Notes, summary, topic titles, topic summaries, and translatedTranscript must all be in ${targetLanguage}.
- Keep all timestamps as integer seconds.
`;

const transcribeLocalFile = async ({ filePath, mimeType = "video/mp4" }) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const fileBuffer = await fs.readFile(filePath);
  const formData = new FormData();
  formData.append("model", TRANSCRIPTION_MODEL);
  formData.append("response_format", "verbose_json");
  formData.append(
    "file",
    new Blob([fileBuffer], { type: mimeType }),
    path.basename(filePath)
  );

  const response = await fetch(`${OPENAI_API_BASE_URL}/audio/transcriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Transcription request failed");
  }

  return {
    transcript: payload.text || "",
    segments: Array.isArray(payload.segments) ? payload.segments : [],
  };
};

const summarizeTranscript = async ({
  title,
  description,
  transcript,
  segments,
  targetLanguage,
}) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const response = await fetch(`${OPENAI_API_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: SUMMARIZATION_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You convert transcripts into structured study material. Always return valid JSON only.",
        },
        {
          role: "user",
          content: buildTranscriptPrompt({
            title,
            description,
            transcript,
            segments,
            targetLanguage,
          }),
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Summarization request failed");
  }

  const content = payload?.choices?.[0]?.message?.content || "{}";
  const parsed = parseMaybeJson(content);

  if (!parsed) {
    throw new Error("AI response was not valid JSON");
  }

  return {
    translatedTranscript: parsed.translatedTranscript || "",
    summary: parsed.summary || "",
    notes: Array.isArray(parsed.notes) ? parsed.notes.filter(Boolean) : [],
    topics: Array.isArray(parsed.topics)
      ? parsed.topics
          .filter((topic) => topic?.label)
          .map((topic) => ({
            label: topic.label,
            timestamp: Math.max(0, Math.floor(Number(topic.timestamp) || 0)),
            summary: topic.summary || "",
          }))
      : [],
  };
};

const buildAbsoluteUploadPath = (videoUrl) =>
  path.join(process.cwd(), "src", videoUrl.replace(/^\/+/, ""));

export const processVideoInsights = async (videoId) => {
  const video = await Video.findById(videoId);

  if (!video) {
    return;
  }

  video.insightsStatus = "processing";
  video.processingError = "";
  await video.save();

  try {
    const user = await User.findById(video.uploadedBy).select("preferredLanguage");
    const targetLanguage =
      video.learningLanguage || user?.preferredLanguage || "English";

    if (video.videoType !== "file") {
      const fallback = fallbackInsights({
        title: video.title,
        description: video.description,
        transcript: "",
        videoType: video.videoType,
        targetLanguage,
      });

      video.insightsStatus = "skipped";
      video.insightsSummary = `Transcript generation is currently enabled for uploaded video files. Link-based videos use fallback notes in ${targetLanguage} for now.`;
      video.learningLanguage = targetLanguage;
      video.transcript = fallback.translatedTranscript;
      video.notes = fallback.notes;
      video.topics = fallback.topics;
      video.processedAt = new Date();
      await video.save();
      return;
    }

    const filePath = buildAbsoluteUploadPath(video.videoUrl);
    const { transcript, segments } = await transcribeLocalFile({ filePath });
    const insights = transcript.trim()
      ? await summarizeTranscript({
          title: video.title,
          description: video.description,
          transcript,
          segments,
          targetLanguage,
        })
      : fallbackInsights({
          title: video.title,
          description: video.description,
          transcript,
          videoType: video.videoType,
          targetLanguage,
        });

    video.learningLanguage = targetLanguage;
    video.originalTranscript = transcript;
    video.transcript = insights.translatedTranscript || transcript;
    video.notes = insights.notes;
    video.topics = insights.topics;
    video.insightsSummary = insights.summary || "";
    video.insightsStatus = "completed";
    video.processedAt = new Date();
    await video.save();
  } catch (error) {
    const missingApiKey = error.message === "OPENAI_API_KEY is missing";
    const fallback = fallbackInsights({
      title: video.title,
      description: video.description,
      transcript: video.transcript || "",
      videoType: video.videoType,
      targetLanguage: video.learningLanguage || "English",
    });

    video.notes = fallback.notes;
    video.topics = fallback.topics;
    video.insightsSummary = fallback.summary;
    video.insightsStatus = missingApiKey || !process.env.OPENAI_API_KEY ? "skipped" : "failed";
    video.processingError = missingApiKey ? "" : error.message;
    video.processedAt = new Date();
    await video.save();
  }
};

export const queueVideoInsights = (videoId) => {
  setTimeout(() => {
    processVideoInsights(videoId).catch((error) => {
      console.error("Video insights processing error:", error.message);
    });
  }, 0);
};
