import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getText } from "../utils/translations";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const t = getText();

  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

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

    // Preview first
    if (videoFile) {
      const localUrl = URL.createObjectURL(videoFile);
      previewData = {
        type: "file",
        url: localUrl,
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
      // FILE UPLOAD
      if (videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        formData.append("title", videoFile.name);
        formData.append("description", t.uploadedVideoFile);
        formData.append("isPublic", isPublic);

        const res = await fetch("http://localhost:5000/api/videos/upload-file", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const data = await res.json();
        console.log("File upload response:", data);

        if (!res.ok) {
          alert(data.message || "Upload failed");
          return;
        }

        savedVideo = data.video;
      }

      // LINK UPLOAD
      if (videoLink) {
        const res = await fetch("http://localhost:5000/api/videos/upload-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: t.uploadedLinkVideo,
            description: t.videoViaLink,
            videoUrl: videoLink,
            isPublic,
          }),
        });

        const data = await res.json();
        console.log("Link upload response:", data);

        if (!res.ok) {
          alert(data.message || "Upload failed");
          return;
        }

        savedVideo = data.video;
      }

      // Reset input fields
      setVideoLink("");
      setVideoFile(null);
      setIsPublic(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Upload ke baad watch page kholo with REAL saved video
      if (savedVideo) {
        navigate("/dashboard/watch", {
          state: {
            video: {
              _id: savedVideo._id,
              type: savedVideo.videoType === "file" ? "file" : "link",
              url:
                savedVideo.videoType === "file"
                  ? `http://localhost:5000${savedVideo.videoUrl}`
                  : savedVideo.videoUrl,
              link: savedVideo.videoUrl,
              title: savedVideo.title,
              description: savedVideo.description,
            },
          },
        });
      } else {
        alert("Upload completed but video data not found");
      }
    } catch (err) {
      console.log("Backend error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t.uploadTitle}
        </h2>

        {/* Link Upload */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            {t.uploadViaLink}
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste video link..."
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              className="w-full border px-4 py-2 rounded-md"
            />

            {videoLink && (
              <button
                type="button"
                onClick={() => setVideoLink("")}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            {t.uploadVideoFile}
          </label>

          <div className="flex gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setVideoFile(e.target.files[0] || null)}
              className="w-full border px-4 py-2 rounded-md"
            />

            {videoFile && (
              <button
                type="button"
                onClick={() => {
                  setVideoFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            )}
          </div>

          {videoFile && (
            <p className="text-sm text-gray-500 mt-2">
              {t.selectedFile}: {videoFile.name}
            </p>
          )}
        </div>

        {/* Video Visibility */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            {t.videoVisibility}
          </label>

          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={isPublic === true}
                onChange={() => setIsPublic(true)}
              />
              {t.public}
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                checked={isPublic === false}
                onChange={() => setIsPublic(false)}
              />
              {t.private}
            </label>
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleUpload}
          className="w-full bg-purple-600 text-white py-2 rounded-md mb-3"
        >
          {t.uploadBtn}
        </button>

        {/* Preview */}
        {preview && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">{t.previewTitle}</h3>

            {preview.type === "file" ? (
              <video
                src={preview.url}
                controls
                className="w-full rounded-md"
              />
            ) : preview.link.includes("youtube.com") ||
              preview.link.includes("youtu.be") ? (
              <iframe
                width="100%"
                height="250"
                src={
                  preview.link.includes("v=")
                    ? `https://www.youtube.com/embed/${preview.link
                        .split("v=")[1]
                        ?.split("&")[0]}`
                    : `https://www.youtube.com/embed/${preview.link
                        .split("youtu.be/")[1]
                        ?.split("?")[0]}`
                }
                title="video"
                allowFullScreen
                className="rounded-md"
              ></iframe>
            ) : (
              <video
                src={preview.link}
                controls
                className="w-full rounded-md"
              />
            )}
          </div>
        )}

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-300 py-2 rounded-md mt-4"
        >
          {t.backToDashboard}
        </button>
      </div>
    </div>
  );
}