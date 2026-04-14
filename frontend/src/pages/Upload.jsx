import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getText } from "../utils/translations";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const t = getText();

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const parseResponse = async (response) => {
    const rawText = await response.text();
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(
        rawText.startsWith("<!DOCTYPE")
          ? "Backend returned an HTML error page. Check backend logs."
          : rawText || "Unexpected server response",
      );
    }
  };

  const handleUpload = async () => {
    if (!videoLink && !videoFile) {
      alert("Please choose one option");
      return;
    }

    if (videoLink && videoFile) {
      alert("Upload via single option only");
      return;
    }

    let previewData = null;
    let savedVideo = null;

    // Preview
    if (videoFile) {
      previewData = {
        type: "file",
        url: URL.createObjectURL(videoFile),
      };
      setPreview(previewData);
    }

    if (videoLink) {
      previewData = {
        type: "link",
        link: videoLink,
      };
      setPreview(previewData);
    }

    try {
      let data;

      // FILE UPLOAD
      if (videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", videoFile.name);
        formData.append("description", "Uploaded video file");

        const res = await fetch(
          "http://localhost:5000/api/videos/upload-file",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          },
        );

        data = await parseResponse(res);

        if (!res.ok) {
          throw new Error(data.message || "File upload failed");
        }

        savedVideo = data.video;
      }

      // LINK UPLOAD
      if (videoLink) {
        const res = await fetch(
          "http://localhost:5000/api/videos/upload-link",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              title: "Uploaded link video",
              description: "Video via link",
              videoUrl: videoLink,
            }),
          },
        );

        data = await parseResponse(res);

        if (!res.ok) {
          throw new Error(data.message || "Link upload failed");
        }

        savedVideo = data.video;
      }

      // Reset
      setVideoLink("");
      setVideoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      // Navigate to watch page (BEST VERSION)
      navigate(
        savedVideo?._id
          ? `/dashboard/watch/${savedVideo._id}`
          : "/dashboard/watch",
        {
          state: {
            video: savedVideo || previewData,
          },
        },
      );
    } catch (err) {
      console.log("Backend error:", err);
      alert(err.message || "Upload failed");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{t.uploadTitle}</h2>

        <p className="mb-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          AI will process this video and generate timestamps, transcript, and
          notes in{" "}
          <span className="font-semibold">
            {currentUser.preferredLanguage || "your selected language"}
          </span>
          .
        </p>

        {/* Link Upload */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">{t.uploadViaLink}</label>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">{t.uploadVideoFile}</label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setVideoFile(e.target.files[0] || null)}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-purple-600 text-white py-2 rounded-md"
        >
          {t.uploadBtn}
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-300 py-2 rounded-md mt-4"
        >
          {t.backToDashboard}
        </button>
      </div>
    </div>
  );
}
