import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getText } from "../utils/translations";

export default function History() {
  const [videos, setVideos] = useState([]);
  const [dubStatuses, setDubStatuses] = useState({});
  const navigate = useNavigate();
  const t = getText();

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
              status: data.dubbing ? data.dubbing.processingStatus : "not_created",
            };
          } catch (err) {
            console.log("Dub status fetch error:", err);
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
      console.log("History API data:", data);

      if (Array.isArray(data)) {
        setVideos(data);
        fetchDubStatuses(data);
      } else if (Array.isArray(data.videos)) {
        setVideos(data.videos);
        fetchDubStatuses(data.videos);
      } else {
        setVideos([]);
        setDubStatuses({});
      }
    } catch (err) {
      console.log("History error:", err);
      setVideos([]);
      setDubStatuses({});
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return "";

    if (url.includes("v=")) {
      return `https://www.youtube.com/embed/${url.split("v=")[1]?.split("&")[0]}`;
    }

    if (url.includes("youtu.be/")) {
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]?.split("?")[0]}`;
    }

    return "";
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t.historyTitle}</h2>

      {videos.length === 0 ? (
        <p>{t.noVideos}</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => {
            const isFile = video.videoType === "file";
            const isLink = video.videoType === "link";

            return (
              <div
                key={video._id || index}
                onClick={() => {
                  console.log("HISTORY CLICK VIDEO:", video);

                  navigate("/dashboard/watch", {
                    state: {
                      video: {
                        _id: video._id,
                        type: isFile ? "file" : "link",
                        url: isFile
                          ? `http://localhost:5000${video.videoUrl}`
                          : video.videoUrl,
                        link: video.videoUrl,
                        title: video.title,
                        description: video.description,
                      },
                    },
                  });
                }}
                className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
              >
                {isFile ? (
                  <video
                    src={`http://localhost:5000${video.videoUrl}`}
                    controls
                    className="w-full h-48 object-cover rounded-md"
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
                      src={video.videoUrl}
                      controls
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )
                ) : (
                  <p className="text-sm text-red-500">{t.unsupportedVideo}</p>
                )}

                <h3 className="mt-3 font-semibold text-gray-800">
                  {video.title || t.untitledVideo}
                </h3>

                {video.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {video.description}
                  </p>
                )}

                <p className="text-sm mt-2 font-medium text-violet-600">
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
  );
}