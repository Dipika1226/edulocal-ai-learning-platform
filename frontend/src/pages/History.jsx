import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getText } from "../utils/translations";
import { getVideoSource, getYoutubeEmbedUrl } from "../utils/videoLearning";

export default function History() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [dubStatuses, setDubStatuses] = useState({});
  const t = getText();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchDubStatuses = async (videoList) => {
    try {
      const token = localStorage.getItem("token");

      const results = await Promise.all(
        videoList.map(async (video) => {
          try {
            const res = await fetch(
              `http://localhost:5000/api/dubbings/${video._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const data = await res.json();

            return {
              videoId: video._id,
              status: data.dubbing
                ? data.dubbing.processingStatus
                : "not_created",
            };
          } catch {
            return {
              videoId: video._id,
              status: "not_created",
            };
          }
        })
      );

      const statusMap = {};
      results.forEach((item) => {
        statusMap[item.videoId] = item.status;
      });

      setDubStatuses(statusMap);
    } catch (err) {
      console.log("Dub status fetch failed:", err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/videos/my-videos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      const videoList = Array.isArray(data)
        ? data
        : Array.isArray(data.videos)
        ? data.videos
        : [];

      setVideos(videoList);
      fetchDubStatuses(videoList);
    } catch (err) {
      console.log("History error:", err);
      setVideos([]);
      setDubStatuses({});
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

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      setVideos((prev) => prev.filter((video) => video._id !== id));

      // ✅ also remove dubbing status
      setDubStatuses((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-2 text-[30px] font-semibold text-slate-900">
          Video Learning Library
        </h2>

        <p className="mb-6 text-[13px] text-gray-500">
          {t.learningIn}{" "}
          <span className="font-semibold text-emerald-700">
            {currentUser.preferredLanguage || "your selected language"}
          </span>
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
                    <p className="text-[13px] text-red-500">
                      {t.unsupportedVideo}
                    </p>
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

                  {/* ✅ Dubbing Status */}
                  <p className="mt-1 text-[12px] font-medium text-purple-600">
                    {dubStatuses[video._id] === "not_created" && t.dubNotCreated}
                    {dubStatuses[video._id] === "pending" && t.dubPending}
                    {dubStatuses[video._id] === "processing" && t.dubProcessing}
                    {dubStatuses[video._id] === "completed" && t.dubCompleted}
                    {!dubStatuses[video._id] && t.dubNotCreated}
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