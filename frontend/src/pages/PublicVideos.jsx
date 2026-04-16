import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PublicVideos() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/videos/public");
      const data = await res.json();

      setVideos(data.videos || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Public Videos</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            onClick={() =>
              navigate("/dashboard/watch", {
                state: {
                  video: {
                    _id: video._id,
                    type: video.videoType === "file" ? "file" : "link",
                    url:
                      video.videoType === "file"
                        ? `http://localhost:5000${video.videoUrl}`
                        : video.videoUrl,
                    link: video.videoUrl,
                    title: video.title,
                    description: video.description,
                  },
                },
              })
            }
            className="bg-white p-4 rounded-xl shadow cursor-pointer"
          >
            <video
              src={`http://localhost:5000${video.videoUrl}`}
              className="w-full h-40 object-cover"
            />
            <h3 className="mt-2 font-semibold">{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}