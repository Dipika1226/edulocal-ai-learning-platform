import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  formatTimestamp,
  getVideoSource,
  getYoutubeEmbedUrl,
} from "../utils/videoLearning";

export default function Watch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const playerRef = useRef(null);

  const [video, setVideo] = useState(location.state?.video || null);
  const [loading, setLoading] = useState(Boolean(id && !location.state?.video));
  const [error, setError] = useState("");
  const [retrying, setRetrying] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const preferredLanguage = user?.preferredLanguage || "English";

  const [dubStatus, setDubStatus] = useState("not_created");
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState("");

  const fetchVideo = async ({ silent = false } = {}) => {
    if (!id) return;

    try {
      if (!silent) setLoading(true);

      const res = await fetch(`http://localhost:5000/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setVideo(data.video);
    } catch (err) {
      setError(err.message || "Failed to load video");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchVideo();
  }, [id]);

  // Auto refresh AI processing
  useEffect(() => {
    if (!id) return;
    if (!["pending", "processing"].includes(video?.insightsStatus)) return;

    const interval = setInterval(() => {
      fetchVideo({ silent: true });
    }, 5000);

    return () => clearInterval(interval);
  }, [video]);

  // ================= DUB FETCH =================
  useEffect(() => {
    const fetchDub = async () => {
      if (!video?._id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/dubbings/${video._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.dubbing) {
          setDubStatus(data.dubbing.processingStatus);
          setDubbedVideoUrl(data.dubbing.dubbedVideoUrl);
        } else {
          setDubStatus("not_created");
        }
      } catch {}
    };

    fetchDub();
    const interval = setInterval(fetchDub, 3000);
    return () => clearInterval(interval);
  }, [video]);

  const handleCreateDub = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/dubbings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          videoId: video._id,
          dubLanguage: preferredLanguage,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setDubStatus("pending");
      alert("Dubbing started");
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= HELPERS =================
  const embedUrl = useMemo(() => getYoutubeEmbedUrl(video?.videoUrl), [video]);

  const source = useMemo(() => getVideoSource(video), [video]);

  const jumpToTopic = (t) => {
    if (!playerRef.current) return;
    playerRef.current.currentTime = t;
    playerRef.current.play();
  };

  // ================= UI =================
  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!video) return <div className="p-6">No video</div>;

  const topics = video.topics || [];
  const notes = video.notes || [];
  const transcript = video.transcript || "";

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{video.title}</h1>

      {/* VIDEO PLAYER */}
      <div className="rounded-xl overflow-hidden bg-black">
        {video.videoType === "link" && embedUrl ? (
          <iframe src={embedUrl} className="w-full h-[420px]" />
        ) : (
          <video ref={playerRef} src={source} controls className="w-full" />
        )}
      </div>

      {/* DUB */}
      <div className="bg-purple-50 p-4 rounded-xl">
        <h2 className="font-semibold">Dubbing</h2>

        {dubStatus === "not_created" && (
          <button
            onClick={handleCreateDub}
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Create Dub
          </button>
        )}

        {dubStatus === "completed" && dubbedVideoUrl && (
          <video
            src={`http://localhost:5000${dubbedVideoUrl}`}
            controls
            className="mt-4"
          />
        )}
      </div>

      {/* TOPICS */}
      <div>
        <h2 className="font-semibold mb-2">Topics</h2>
        {topics.map((t, i) => (
          <button
            key={i}
            onClick={() => jumpToTopic(t.timestamp)}
            className="block text-left mb-2"
          >
            {formatTimestamp(t.timestamp)} - {t.label}
          </button>
        ))}
      </div>

      {/* NOTES */}
      <div>
        <h2 className="font-semibold">Notes</h2>
        {notes.map((n, i) => (
          <p key={i}>{n}</p>
        ))}
      </div>

      {/* TRANSCRIPT */}
      <div>
        <h2 className="font-semibold">Transcript</h2>
        <p>{transcript}</p>
      </div>
    </div>
  );
}
