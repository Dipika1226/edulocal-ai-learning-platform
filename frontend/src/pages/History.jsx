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
        <h2 className="mb-2 text-[30px] font-semibold leading-tight text-slate-900">
          Video Learning Library
        </h2>
        <p className="mb-6 text-[13px] leading-5 text-gray-500">
          {t.learningIn}{" "}
          <span className="font-semibold text-emerald-700">
            {currentUser.preferredLanguage || "your selected language"}
          </span>
          .
        </p>

        {videos.length === 0 ? (
          <p className="text-[14px] text-slate-500">{t.noVideos}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, index) => {
              const isFile = video.videoType === "file";
              const isLink = video.videoType === "link";

              return (
                <div
                  key={video._id || index}
                  className="cursor-pointer rounded-[22px] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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
                      className="h-44 w-full rounded-xl object-cover"
                    />
                  ) : isLink ? (
                    getYoutubeEmbedUrl(video.videoUrl) ? (
                      <iframe
                        width="100%"
                        height="220"
                        src={getYoutubeEmbedUrl(video.videoUrl)}
                        title="video"
                        allowFullScreen
                        className="rounded-xl"
                      ></iframe>
                    ) : (
                      <video
                        src={getVideoSource(video)}
                        controls
                        className="h-44 w-full rounded-xl object-cover"
                      />
                    )
                  ) : (
                    <p className="text-[13px] text-red-500">{t.unsupportedVideo}</p>
                  )}

                  <h3 className="mt-3 text-[16px] font-semibold text-gray-800">
                    {video.title || t.untitledVideo}
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-emerald-700">
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
                    className="mt-3 rounded-xl bg-red-500 px-4 py-2 text-[13px] font-medium text-white hover:bg-red-600"
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
