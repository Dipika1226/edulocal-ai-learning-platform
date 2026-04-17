import {
  Brain,
  FileText,
  Link as LinkIcon,
  MessageSquareText,
  Sparkles,
  UploadCloud,
  Video,
} from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getText } from "../utils/translations";

const categoryOptions = [
  "Education",
  "Technology",
  "Language Learning",
  "Business",
  "Personal Development",
];

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const t = getText();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [uploadMethod, setUploadMethod] = useState("file");
  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const parseResponse = async (response) => {
    const rawText = await response.text();
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(
        rawText.startsWith("<!DOCTYPE")
          ? "Backend returned an HTML error page. Check backend logs."
          : rawText || "Unexpected server response"
      );
    }
  };

  const resetForm = () => {
    setVideoLink("");
    setVideoFile(null);
    setVideoTitle("");
    setCategory("");
    setDescription("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (uploadMethod === "file" && !videoFile) {
      alert("Please select a video file");
      return;
    }

    if (uploadMethod === "link" && !videoLink.trim()) {
      alert("Please paste a video link");
      return;
    }

    try {
      setIsUploading(true);

      let savedVideo = null;
      let data;

      if (uploadMethod === "file" && videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", videoTitle.trim() || videoFile.name);
        formData.append("description", description.trim() || "Uploaded video file");

        const res = await fetch("http://localhost:5000/api/videos/upload-file", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        data = await parseResponse(res);

        if (!res.ok) {
          throw new Error(data.message || "File upload failed");
        }

        savedVideo = data.video;
      }

      if (uploadMethod === "link" && videoLink.trim()) {
        const res = await fetch("http://localhost:5000/api/videos/upload-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: videoTitle.trim() || "Uploaded link video",
            description: description.trim() || "Video via link",
            videoUrl: videoLink.trim(),
            category,
          }),
        });

        data = await parseResponse(res);

        if (!res.ok) {
          throw new Error(data.message || "Link upload failed");
        }

        savedVideo = data.video;
      }

      resetForm();

      navigate(
        savedVideo?._id ? `/dashboard/watch/${savedVideo._id}` : "/dashboard/watch",
        {
          state: {
            video: savedVideo,
          },
        }
      );
    } catch (err) {
      console.log("Backend error:", err);
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const methodCardClass = (method) =>
    [
      "rounded-xl border px-4 py-5 text-left transition-all",
      uploadMethod === method
        ? "border-purple-500 bg-purple-50 shadow-[0_12px_30px_rgba(147,51,234,0.10)]"
        : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40",
    ].join(" ");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.10),_transparent_35%),linear-gradient(180deg,#fcf8ff_0%,#ffffff_45%,#faf5ff_100%)] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 text-center">
          <h1 className="text-[30px] font-bold tracking-tight text-slate-900">
            Upload Learning Content
          </h1>
          <p className="mt-2 text-[14px] text-slate-600">
            Share your knowledge with the community
          </p>
        </div>

        <div className="rounded-[26px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_50px_rgba(148,163,184,0.14)] backdrop-blur sm:p-6">
          <div className="mb-5">
            <h2 className="text-[15px] font-semibold text-slate-900">
              Choose Upload Method
            </h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setUploadMethod("file")}
              className={methodCardClass("file")}
            >
              <UploadCloud
                className={`mb-4 ${
                  uploadMethod === "file" ? "text-purple-600" : "text-purple-400"
                }`}
                size={24}
              />
              <p className="text-[16px] font-semibold text-slate-900">Upload Video File</p>
              <p className="mt-1 text-[13px] text-slate-500">Upload from your device</p>
            </button>

            <button
              type="button"
              onClick={() => setUploadMethod("link")}
              className={methodCardClass("link")}
            >
              <LinkIcon
                className={`mb-4 ${
                  uploadMethod === "link" ? "text-purple-600" : "text-purple-400"
                }`}
                size={24}
              />
              <p className="text-[16px] font-semibold text-slate-900">YouTube Link</p>
              <p className="mt-1 text-[13px] text-slate-500">Paste a YouTube URL</p>
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {uploadMethod === "file" ? (
              <div>
                <label className="mb-2.5 block text-[14px] font-semibold text-slate-800">
                  Select Video File
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-white px-5 py-10 text-center transition hover:border-purple-400 hover:from-purple-100"
                >
                  <Video className="mb-3 text-purple-500" size={36} />
                  <p className="text-[17px] font-semibold text-slate-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="mt-2 text-[13px] text-slate-500">
                    MP4, WebM, MOV, MKV
                  </p>
                  {videoFile ? (
                    <p className="mt-3 rounded-full bg-purple-100 px-4 py-1.5 text-[13px] font-medium text-purple-700">
                      Selected: {videoFile.name}
                    </p>
                  ) : null}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                  onChange={(e) => {
                    const file = e.target.files[0] || null;
                    setVideoFile(file);
                    if (file && !videoTitle.trim()) {
                      setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="hidden"
                />
              </div>
            ) : (
              <div>
                <label className="mb-2.5 block text-[14px] font-semibold text-slate-800">
                  Paste Video Link
                </label>
                <input
                  type="text"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
                />
              </div>
            )}

            <div>
              <label className="mb-2.5 block text-[14px] font-semibold text-slate-800">
                Video Title
              </label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="mb-2.5 block text-[14px] font-semibold text-slate-800">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              >
                <option value="">Select a category</option>
                {categoryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2.5 block text-[14px] font-semibold text-slate-800">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what learners will gain from this video"
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-[14px] text-slate-800 outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 text-[14px] font-semibold text-white transition hover:shadow-lg disabled:opacity-60"
            >
              <Sparkles size={16} />
              {isUploading ? "Processing..." : "Process with AI"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
            <Brain className="mb-2.5 text-purple-500" size={20} />
            <h3 className="text-[16px] font-semibold text-slate-900">AI Analysis</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              Automatic topic detection and timestamps
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
            <FileText className="mb-2.5 text-purple-500" size={20} />
            <h3 className="text-[16px] font-semibold text-slate-900">Smart Notes</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              AI-generated notes for learners
            </p>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-4 shadow-sm">
            <MessageSquareText className="mb-2.5 text-purple-500" size={20} />
            <h3 className="text-[16px] font-semibold text-slate-900">Auto Quizzes</h3>
            <p className="mt-1 text-[13px] text-slate-500">
              Learning aids created automatically
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-purple-50 px-4 py-3 text-[13px] text-purple-900">
          <p className="leading-5">
            AI will process this video in{" "}
            <span className="font-semibold">
              {currentUser.preferredLanguage || "your selected language"}
            </span>
            .
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-purple-300 bg-white px-4 py-2 text-[13px] font-medium text-purple-700 transition hover:bg-purple-100"
          >
            {t.backToDashboard}
          </button>
        </div>
      </div>
    </div>
  );
}
