import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Upload() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [videoLink, setVideoLink] = useState("");
  const [videoFile, setVideoFile] = useState(null);

  const handleUpload = () => {
    // ❌ nothing selected
    if (!videoLink && !videoFile) {
      alert("Please choose one option: Link or File ❗");
      return;
    }

    // ❌ both selected
    if (videoLink && videoFile) {
      alert("Please upload via single option only ❗");
      return;
    }

    // ✅ valid
    if (videoLink) {
      console.log("Uploading via Link:", videoLink);
    }

    if (videoFile) {
      console.log("Uploading File:", videoFile);
    }

    alert("Upload Successful ✅");
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
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
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
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
          >
          Delete
          </button>
          )}
          </div>

          {/* show file name */}
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

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-300 py-2 rounded-md"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}