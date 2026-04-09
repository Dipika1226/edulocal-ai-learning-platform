import { useEffect, useState } from "react";

export default function History() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("videos")) || [];
    setVideos(data);
  }, []);

  const handleDelete = (index) => {
    const updated = videos.filter((_, i) => i !== index);
    setVideos(updated);
    localStorage.setItem("videos", JSON.stringify(updated));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Your Upload History 🎥
      </h2>

      {videos.length === 0 ? (
        <p className="text-gray-500">No uploads yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              
              {/* Thumbnail */}
              <div className="relative">
                {video.type === "link" && (
                  <img
                    src={video.thumbnail}
                    alt="thumbnail"
                    className="w-full h-40 object-cover"
                  />
                )}

                {video.type === "file" && (
                  <video
                    src={video.url}
                    className="w-full h-40 object-cover"
                  />
                )}

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
                >
                  Delete
                </button>
              </div>

              {/* Info */}
              <div className="p-3 text-sm">
                {video.type === "link" ? (
                  <a
                    href={video.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-600 hover:underline break-words"
                  >
                    {video.link}
                  </a>
                ) : (
                  <p className="text-gray-700 break-words">
                    {video.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}