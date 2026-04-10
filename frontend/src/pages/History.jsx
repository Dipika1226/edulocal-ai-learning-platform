import { useEffect, useState } from "react";

export default function History() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your History 🎥</h2>

      {videos.length === 0 ? (
        <p>No videos yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow">

              {/* FILE VIDEO */}
              {video.type === "file" ? (
                <video
                  src={`http://localhost:5000/uploads/${video.file}`}
                  controls
                  className="w-full h-40 object-cover"
                />
              ) : (
                // LINK VIDEO
                <iframe
                  width="100%"
                  height="150"
                  src={
                    video.link.includes("v=")
                      ? `https://www.youtube.com/embed/${video.link.split("v=")[1]}`
                      : `https://www.youtube.com/embed/${video.link.split("youtu.be/")[1]}`
                  }
                  title="video"
                  allowFullScreen
                ></iframe>
              )}

              <p className="mt-2 text-sm text-gray-600">
                {video.type === "file" ? video.file : video.link}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}