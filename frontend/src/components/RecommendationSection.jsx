import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVideoSource, getYoutubeEmbedUrl } from "../utils/videoLearning";

/**
 * RecommendationSection
 *
 * Fetches personalized video recommendations from the backend
 * and displays them in the same card grid used elsewhere in the app.
 * Designed to be dropped into DashboardHome without any CSS changes.
 */
export default function RecommendationSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/recommendations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setVideos(data.videos || []);
      }
    } catch (err) {
      console.log("Recommendation fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-[20px] font-semibold text-slate-900 mb-4">
          Recommended for You
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[22px] bg-white p-4 shadow-sm animate-pulse"
            >
              <div className="h-44 w-full rounded-xl bg-slate-200" />
              <div className="mt-3 h-5 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-1/2 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-[20px] font-semibold text-slate-900 mb-4">
        Recommended for You
      </h2>

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
              {/* Video thumbnail / player – same as History page cards */}
              {isFile ? (
                <video
                  src={getVideoSource(video)}
                  className="h-44 w-full rounded-xl object-cover"
                  muted
                  preload="metadata"
                />
              ) : isLink ? (
                getYoutubeEmbedUrl(video.videoUrl) ? (
                  <iframe
                    width="100%"
                    height="176"
                    src={getYoutubeEmbedUrl(video.videoUrl)}
                    title={video.title || "video"}
                    allowFullScreen
                    className="rounded-xl pointer-events-none"
                  ></iframe>
                ) : (
                  <video
                    src={getVideoSource(video)}
                    className="h-44 w-full rounded-xl object-cover"
                    muted
                    preload="metadata"
                  />
                )
              ) : (
                <div className="h-44 w-full rounded-xl bg-slate-100 flex items-center justify-center">
                  <p className="text-[13px] text-slate-400">No preview</p>
                </div>
              )}

              <h3 className="mt-3 text-[16px] font-semibold text-gray-800">
                {video.title || "Untitled Video"}
              </h3>

              {video.description ? (
                <p className="mt-1 text-[13px] text-slate-500 line-clamp-2">
                  {video.description}
                </p>
              ) : null}

              {video.learningLanguage ? (
                <p className="mt-1 text-[13px] font-medium text-emerald-700">
                  Language: {video.learningLanguage}
                </p>
              ) : null}

              {video.insightsStatus ? (
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${
                    video.insightsStatus === "completed"
                      ? "bg-emerald-50 text-emerald-700"
                      : video.insightsStatus === "processing" ||
                          video.insightsStatus === "pending"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {video.insightsStatus === "completed"
                    ? "AI Ready"
                    : video.insightsStatus === "processing" ||
                        video.insightsStatus === "pending"
                      ? "Processing"
                      : video.insightsStatus}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
