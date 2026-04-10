import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [preview, setPreview] = useState(null);

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

    // 🔥 PREVIEW FIRST (IMPORTANT FIX)
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
    navigate("/dashboard/watch", {
  state: {
    video: previewData
  }
});
    // 🔹 Save to history (temporary)
    let historyItem = {};

    if (videoLink) {
      let videoId = "";

      if (videoLink.includes("v=")) {
        videoId = videoLink.split("v=")[1]?.split("&")[0];
      } else if (videoLink.includes("youtu.be/")) {
        videoId = videoLink.split("youtu.be/")[1]?.split("?")[0];
      }

      historyItem = {
        type: "link",
        link: videoLink,
        thumbnail: videoId
          ? `https://img.youtube.com/vi/${videoId}/0.jpg`
          : "",
      };
    }

    if (videoFile) {
      historyItem = {
        type: "file",
        name: videoFile.name,
        url: previewData.url,
      };
    }

    // 🔹 Backend call (after preview)
    const formData = new FormData();
    if (videoLink) formData.append("link", videoLink);
    if (videoFile) formData.append("video", videoFile);

    try {
      const res = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);
    } catch (err) {
      console.log("Backend error:", err);
    }

    // 🔹 Reset input (preview ko mat hatao)
    setVideoLink("");
    setVideoFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Video 🎥
        </h2>

        {/* Link Upload */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Upload via Link 🔗
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
            Upload Video File 📁
          </label>

          <div className="flex gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setVideoFile(e.target.files[0])}
              className="w-full border px-4 py-2 rounded-md"
            />

            {videoFile && (
              <button
                onClick={() => {
                  setVideoFile(null);
                  fileInputRef.current.value = "";
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Delete
              </button>
            )}
          </div>

          {videoFile && (
            <p className="text-sm text-gray-500 mt-2">
              Selected: {videoFile.name}
            </p>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-purple-600 text-white py-2 rounded-md mb-3"
        >
          Upload
        </button>

        {/* 🔥 VIDEO PREVIEW */}
        {preview && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Now Playing 🎬</h3>

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
                    ? `https://www.youtube.com/embed/${preview.link.split("v=")[1]?.split("&")[0]}`
                    : `https://www.youtube.com/embed/${preview.link.split("youtu.be/")[1]?.split("?")[0]}`
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
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-300 py-2 rounded-md mt-4"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}