import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import googleTTS from "google-tts-api";
import axios from "axios";

if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const splitText = (text, maxLength = 180) => {
  const sentences = text.match(/[^.!?।]+[.!?।]*/g) || [text];
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + " " + sentence).trim().length <= maxLength) {
      current = (current + " " + sentence).trim();
    } else {
      if (current) chunks.push(current);
      current = sentence.trim();
    }
  }

  if (current) chunks.push(current);

  return chunks;
};

const downloadAudio = async (text, langCode, outputPath) => {
  const url = googleTTS.getAudioUrl(text, {
    lang: langCode,
    slow: false,
    host: "https://translate.google.com",
  });

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  await new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

export const createDubbedMedia = async ({ videoPath, text, language }) => {
  const outputDir = path.join(process.cwd(), "uploads", "dubbed");
  ensureDir(outputDir);

  const fileName = `${Date.now()}-${language}`;
  const finalAudioPath = path.join(outputDir, `${fileName}.mp3`);
  const videoOutputPath = path.join(outputDir, `${fileName}.mp4`);
  const concatListPath = path.join(outputDir, `${fileName}-list.txt`);

  const langMap = {
    English: "en",
    Hindi: "hi",
    Marathi: "mr",
  };

  const langCode = langMap[language] || "en";

  console.log("Generating TTS for:", language);

  const chunks = splitText(text, 180);
  const audioParts = [];

  for (let i = 0; i < chunks.length; i++) {
    const partPath = path.join(outputDir, `${fileName}-part-${i}.mp3`);
    await downloadAudio(chunks[i], langCode, partPath);
    audioParts.push(partPath);
  }

  fs.writeFileSync(
    concatListPath,
    audioParts.map((p) => `file '${p.replace(/\\/g, "/")}'`).join("\n")
  );

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(concatListPath)
      .inputOptions(["-f concat", "-safe 0"])
      .outputOptions(["-c copy"])
      .save(finalAudioPath)
      .on("end", resolve)
      .on("error", reject);
  });

  console.log("Audio generated successfully");

  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(finalAudioPath)
      .outputOptions([
        "-map 0:v:0",
        "-map 1:a:0",
        "-c:v copy",
        "-c:a aac",
        "-shortest",
      ])
      .save(videoOutputPath)
      .on("end", () => {
        console.log("Dubbed video created");
        resolve();
      })
      .on("error", reject);
  });

  return {
    dubbedAudioUrl: `/uploads/dubbed/${fileName}.mp3`,
    dubbedVideoUrl: `/uploads/dubbed/${fileName}.mp4`,
  };
};