import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getText } from "../utils/translations";

export default function Watch() {
  const location = useLocation();
  const navigate = useNavigate();
  const video = location.state?.video;

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const preferredLanguage = user?.preferredLanguage || "English";
  const t = getText();

  const [dubStatus, setDubStatus] = useState("not_created");
  const [dubbedVideoUrl, setDubbedVideoUrl] = useState("");
  const [showDubbed, setShowDubbed] = useState(false);

  const getYoutubeEmbedLink = (link) => {
    if (!link) return "";

    if (link.includes("v=")) {
      return `https://www.youtube.com/embed/${link.split("v=")[1]?.split("&")[0]}`;
    }

    if (link.includes("youtu.be/")) {
      return `https://www.youtube.com/embed/${link.split("youtu.be/")[1]?.split("?")[0]}`;
    }

    return link;
  };

  useEffect(() => {
    const fetchDubStatus = async () => {
      if (!video?._id) return;

      try {
        const res = await fetch(
          `http://localhost:5000/api/dubbings/${video._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        if (data.dubbing) {
          setDubStatus(data.dubbing.processingStatus || "not_created");
          setDubbedVideoUrl(data.dubbing.dubbedVideoUrl || "");
        } else {
          setDubStatus("not_created");
          setDubbedVideoUrl("");
        }
      } catch (err) {
        console.log("Fetch dub error:", err);
      }
    };

    fetchDubStatus();
    const interval = setInterval(fetchDubStatus, 3000);

    return () => clearInterval(interval);
  }, [video]);

  const handleCreateDub = async () => {
    if (!video?._id) {
      alert("Video ID not found.");
      return;
    }

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

      if (!res.ok) {
        if (data.message === "Dub already exists for this language") {
          setDubStatus("pending");
          return;
        }

        alert(data.message || "Failed to create dub");
        return;
      }

      setDubStatus("pending");
      alert("Dubbing request created successfully");
    } catch (err) {
      console.log("Dub create error:", err);
      alert("Server error");
    }
  };

  if (!video) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {t.videoNotFound}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {t.openVideoAgain}
          </p>
          <button
            onClick={() => navigate("/dashboard/history")}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
          >
            {t.goToHistory}
          </button>
        </div>
      </div>
    );
  }

  const canShowDubbed = dubStatus === "completed" && !!dubbedVideoUrl;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setShowDubbed(false)}
              className={`px-4 py-2 rounded-md font-medium ${
                !showDubbed
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.original}
            </button>

            <button
              onClick={() => setShowDubbed(true)}
              disabled={!canShowDubbed}
              className={`px-4 py-2 rounded-md font-medium ${
                showDubbed
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } ${!canShowDubbed ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {t.dubbed}
            </button>
          </div>

          {!showDubbed ? (
            video.type === "file" ? (
              <video
                src={video.url}
                controls
                className="w-full rounded-lg"
              />
            ) : (
              <iframe
                width="100%"
                height="420"
                src={getYoutubeEmbedLink(video.link)}
                title="Video Player"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            )
          ) : (
            <video
              src={`http://localhost:5000${dubbedVideoUrl}`}
              controls
              className="w-full rounded-lg"
            />
          )}

          <h2 className="text-xl font-bold text-gray-800 mt-4">
            {!showDubbed ? (video.title || t.originalVideo) : t.dubbedVideo}
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            {t.preferredLanguageLabel}:{" "}
            <span className="font-medium text-violet-600">
              {preferredLanguage}
            </span>
          </p>

          <div className="mt-4 rounded-lg border border-violet-100 bg-violet-50 p-4">
            <h3 className="font-semibold text-violet-700">
              {t.dubbingTitle}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t.dubbingDescription}
            </p>

            {dubStatus === "not_created" && (
              <button
                onClick={handleCreateDub}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                {t.createDub}
              </button>
            )}

            {dubStatus === "pending" && (
              <p className="mt-4 text-sm font-medium text-orange-600">
                ⏳ {t.dubRequestCreated}
              </p>
            )}

            {dubStatus === "processing" && (
              <p className="mt-4 text-sm font-medium text-blue-600">
                ⚙️ {t.dubProcessingText}
              </p>
            )}

            {dubStatus === "completed" && (
              <p className="mt-4 text-sm font-medium text-green-600">
                ✅ {t.dubReady}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {t.dubStatusTitle}
        </h3>
        <p className="text-sm mt-3 font-medium">
          {dubStatus === "not_created" && (
            <span className="text-gray-500">{t.noDubYet}</span>
          )}
          {dubStatus === "pending" && (
            <span className="text-orange-600">{t.dubPending}</span>
          )}
          {dubStatus === "processing" && (
            <span className="text-blue-600">{t.dubProcessing}</span>
          )}
          {dubStatus === "completed" && (
            <span className="text-green-600">{t.dubCompleted}</span>
          )}
        </p>
      </div>
    </div>
  );
}