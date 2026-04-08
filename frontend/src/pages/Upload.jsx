import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow w-full max-w-lg">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Upload Video 🎥
        </h2>

        {/* Link Upload */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Upload via Link 🔗
          </label>
          <input
            type="text"
            placeholder="Paste video link..."
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Upload Video File 📁
          </label>
          <input
            type="file"
            className="w-full"
          />
        </div>

        {/* Upload Button */}
        <button
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