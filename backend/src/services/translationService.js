import { execFile } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

const DEFAULT_TRANSLATION_PYTHON =
  process.env.WHISPER_PYTHON_PATH ||
  "C:\\Users\\ASUS\\anaconda3\\envs\\whisper-clean\\python.exe";

const TRANSLATION_PYTHON_PATH =
  process.env.TRANSLATION_PYTHON_PATH || DEFAULT_TRANSLATION_PYTHON;

const TRANSLATION_SCRIPT_PATH =
  process.env.TRANSLATION_SCRIPT_PATH ||
  path.join(process.cwd(), "python", "free_translate.py");

const LANGUAGE_CODES = {
  auto: "auto",
  English: "en",
  Hindi: "hi",
  Bengali: "bn",
  Telugu: "te",
  Marathi: "mr",
};

const splitTextIntoChunks = (text = "", maxChars = 3500) => {
  const normalized = text.replace(/\r/g, "").trim();

  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const paragraphs = normalized.split(/\n\s*\n/);
  const chunks = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    if (paragraph.length <= maxChars) {
      current = paragraph;
      continue;
    }

    const sentences = paragraph.match(/[^.!?]+[.!?]*/g) || [paragraph];
    let sentenceChunk = "";

    for (const sentence of sentences) {
      const sentenceCandidate = sentenceChunk
        ? `${sentenceChunk} ${sentence}`.trim()
        : sentence.trim();

      if (sentenceCandidate.length <= maxChars) {
        sentenceChunk = sentenceCandidate;
      } else {
        if (sentenceChunk) {
          chunks.push(sentenceChunk);
        }
        sentenceChunk = sentence.trim();
      }
    }

    current = sentenceChunk;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
};

const getLanguageCode = (language = "auto") => {
  const code = LANGUAGE_CODES[language];

  if (!code) {
    throw new Error(`Unsupported translation language: ${language}`);
  }

  return code;
};

const runTranslator = (text, fromCode, toCode) =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(TRANSLATION_PYTHON_PATH)) {
      reject(
        new Error(
          `Translation Python interpreter not found at ${TRANSLATION_PYTHON_PATH}`
        )
      );
      return;
    }

    if (!fs.existsSync(TRANSLATION_SCRIPT_PATH)) {
      reject(
        new Error(`Translation script not found at ${TRANSLATION_SCRIPT_PATH}`)
      );
      return;
    }

    const tempFilePath = path.join(
      os.tmpdir(),
      `edulocal-translate-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.txt`
    );

    fs.writeFileSync(tempFilePath, text, "utf8");

    execFile(
      TRANSLATION_PYTHON_PATH,
      [TRANSLATION_SCRIPT_PATH, tempFilePath, fromCode, toCode],
      { maxBuffer: 1024 * 1024 * 20, timeout: 5 * 60 * 1000 },
      (error, stdout, stderr) => {
        try {
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        } catch {}

        if (stderr?.trim()) {
          console.log("Translation STDERR:", stderr.trim());
        }

        if (error) {
          reject(new Error(`Translation failed: ${error.message}`));
          return;
        }

        try {
          const parsed = JSON.parse(stdout);

          if (parsed.error) {
            reject(new Error(parsed.error));
            return;
          }

          resolve((parsed.translatedText || "").trim());
        } catch {
          reject(new Error("Translator returned invalid JSON"));
        }
      }
    );
  });

export const translateText = async ({
  text,
  targetLanguage,
  sourceLanguage = "auto",
}) => {
  const trimmed = (text || "").trim();

  if (!trimmed || !targetLanguage || targetLanguage === sourceLanguage) {
    return trimmed;
  }

  const fromCode = getLanguageCode(sourceLanguage);
  const toCode = getLanguageCode(targetLanguage);
  const chunks = splitTextIntoChunks(trimmed);
  const translatedChunks = [];

  for (const chunk of chunks) {
    const translated = await runTranslator(chunk, fromCode, toCode);

    if (!translated) {
      throw new Error("Translator returned empty translated text");
    }

    translatedChunks.push(translated);
  }

  return translatedChunks.join("\n\n").trim();
};

export const translateInsights = async ({
  transcript = "",
  notes = [],
  topics = [],
  summary = "",
  targetLanguage,
  sourceLanguage = "auto",
}) => {
  if (!targetLanguage || targetLanguage === "English") {
    return { transcript, notes, topics, summary };
  }

  const translatedTranscript = await translateText({
    text: transcript,
    targetLanguage,
    sourceLanguage,
  });

  const translatedNotes = await Promise.all(
    notes.map((note) =>
      translateText({
        text: note,
        targetLanguage,
        sourceLanguage: "auto",
      })
    )
  );

  const translatedTopics = await Promise.all(
    topics.map(async (topic) => ({
      ...topic,
      label: await translateText({
        text: topic.label || "",
        targetLanguage,
        sourceLanguage: "auto",
      }),
      summary: await translateText({
        text: topic.summary || "",
        targetLanguage,
        sourceLanguage: "auto",
      }),
    }))
  );

  const translatedSummary = await translateText({
    text: summary,
    targetLanguage,
    sourceLanguage: "auto",
  });

  return {
    transcript: translatedTranscript,
    notes: translatedNotes,
    topics: translatedTopics,
    summary: translatedSummary,
  };
};

export const isTranslationEnabled = () =>
  fs.existsSync(TRANSLATION_PYTHON_PATH) &&
  fs.existsSync(TRANSLATION_SCRIPT_PATH);
