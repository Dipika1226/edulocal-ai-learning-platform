import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getText } from "../utils/translations";
import { getVideoSource, getYoutubeEmbedUrl } from "../utils/videoLearning";

export default function History() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const t = getText();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/videos/my-videos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("History API data:", data);

      if (Array.isArray(data)) {
        setVideos(data);
      } else if (Array.isArray(data.videos)) {
        setVideos(data.videos);
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.log("History error:", err);
      setVideos([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/videos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log("Delete response:", data);

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      setVideos((prev) => prev.filter((video) => video._id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };
  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">Video Learning Library 🎬</h2>
        <p className="mb-6 text-sm text-gray-500">
          {t.learningIn}{" "}
          <span className="font-semibold text-emerald-700">
            {currentUser.preferredLanguage || "your selected language"}
          </span>
          .
        </p>

        {videos.length === 0 ? (
          <p>{t.noVideos}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => {
              const isFile = video.videoType === "file";
              const isLink = video.videoType === "link";

              return (
                <div
                  key={video._id || index}
                  className="bg-white p-4 rounded-xl shadow cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                  onClick={() =>
                    navigate(`/dashboard/watch/${video._id}`, {
                      state: { video },
                    })
                  }
                >
                  {isFile ? (
                    <video
                      src={getVideoSource(video)}
                      controls
                      className="w-full h-44 sm:h-48 object-cover rounded-md"
                    />
                  ) : isLink ? (
                    getYoutubeEmbedUrl(video.videoUrl) ? (
                      <iframe
                        width="100%"
                        height="220"
                        src={getYoutubeEmbedUrl(video.videoUrl)}
                        title="video"
                        allowFullScreen
                        className="rounded-md"
                      ></iframe>
                    ) : (
                      <video
                        src={getVideoSource(video)}
                        controls
                        className="w-full h-44 sm:h-48 object-cover rounded-md"
                      />
                    )
                  ) : (
                    <p className="text-sm text-red-500">{t.unsupportedVideo}</p>
                  )}

                  <h3 className="mt-3 font-semibold text-gray-800">
                    {video.title || t.untitledVideo}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-emerald-700">
                    {t.learningLanguage}:{" "}
                    {video.learningLanguage ||
                      currentUser.preferredLanguage ||
                      "English"}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(video._id);
                    }}
                    className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
                  >
                    {t.deleteBtn}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
