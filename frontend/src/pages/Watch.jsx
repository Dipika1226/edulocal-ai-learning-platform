import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  formatTimestamp,
  getVideoSource,
  getYoutubeEmbedUrl,
} from "../utils/videoLearning";

const languageOptions = ["English", "Hindi", "Bengali", "Telugu", "Marathi"];

export default function Watch() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const playerRef = useRef(null);

  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const preferredLanguage = savedUser?.preferredLanguage || "English";

  const [video, setVideo] = useState(location.state?.video || null);
  const [loading, setLoading] = useState(Boolean(id && !location.state?.video));
  const [error, setError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(preferredLanguage);

  const fetchVideo = async ({ silent = false } = {}) => {
    if (!id) return;

    try {
      if (!silent) {
        setLoading(true);
      }

      setError("");

      const res = await fetch(`http://localhost:5000/api/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load video");
      }

      setVideo(data.video);
      setSelectedLanguage(data.video?.learningLanguage || preferredLanguage);
    } catch (err) {
      setError(err.message || "Failed to load video");
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (!["pending", "processing"].includes(video?.insightsStatus)) return;

    const intervalId = window.setInterval(() => {
      fetchVideo({ silent: true });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [id, video?.insightsStatus]);

  const jumpToTopic = (timestamp) => {
    const videoEl = playerRef.current;

    if (!videoEl) return;

    const time = Number(timestamp) || 0;

    if (videoEl.readyState < 1) {
      videoEl.onloadedmetadata = () => {
        videoEl.currentTime = time;
        videoEl.play().catch(() => {});
      };
      return;
    }

    videoEl.currentTime = time;
    videoEl.play().catch(() => {});
  };

  const embedUrl = useMemo(
    () => getYoutubeEmbedUrl(video?.videoUrl || video?.link),
    [video]
  );
  const source = useMemo(() => getVideoSource(video), [video]);
  const topics = video?.topics || [];
  const notes = video?.notes || [];
  const transcript = video?.transcript || "";
  const summary = video?.insightsSummary || "AI study summary will appear here.";
  const processingStatus = video?.insightsStatus || "completed";
  const isProcessing = ["pending", "processing"].includes(processingStatus);
  const isSkipped = processingStatus === "skipped";

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-[26px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-[14px] font-medium text-slate-500">
            Loading your video learning workspace...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-[26px] border border-red-200 bg-red-50 p-6 text-[14px] text-red-700 shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-[26px] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-[14px] text-slate-500">No video selected.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Video Learning
          </p>
          <h1 className="mt-2 text-[30px] font-semibold leading-tight text-slate-900">
            {video.title || "Learning session"}
          </h1>
          <p className="mt-2 max-w-3xl text-[13px] leading-6 text-slate-600">
            {video.description ||
              "Watch the lesson, jump by timestamps, read the transcript, and revise using AI-generated notes."}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard/video-learning")}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
        >
          Back to library
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(300px,0.8fr)]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-[26px] bg-slate-950 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            {video.videoType === "link" && embedUrl ? (
              <iframe
                src={embedUrl}
                title={video.title || "video"}
                allowFullScreen
                className="h-[280px] w-full sm:h-[390px] xl:h-[500px]"
              />
            ) : (
              <video
                ref={playerRef}
                src={source}
                controls
                className="h-[280px] w-full bg-black object-contain sm:h-[390px] xl:h-[500px]"
              />
            )}
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-slate-900">
                  Processing status:{" "}
                  <span className="capitalize text-emerald-700">
                    {processingStatus}
                  </span>
                </p>
                <p className="mt-1 text-[13px] leading-5 text-slate-600">
                  {isProcessing
                    ? `AI is preparing timestamps, transcript, and notes in ${selectedLanguage}.`
                    : isSkipped
                      ? `Fallback study material is available in ${selectedLanguage}.`
                      : summary}
                </p>
                {isProcessing ? (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1.5 text-[12px] font-medium text-purple-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500"></span>
                    Processing and checking for updates every 5 seconds...
                  </div>
                ) : null}
              </div>

              <div className="rounded-full bg-emerald-50 px-4 py-2 text-[13px] font-medium text-emerald-700">
                Learning language: {selectedLanguage}
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-[14px] font-semibold text-slate-800">
                Select Language
              </p>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => {
                  const isActive = selectedLanguage === lang;

                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
                        isActive
                          ? "bg-purple-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[16px] font-semibold text-slate-900">
                Topic timestamps
              </h2>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                {isProcessing ? "Generating" : "Ready"}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {isProcessing ? (
                <p className="text-[13px] leading-5 text-slate-500">
                  Timestamps are being prepared. This page will show them once
                  processing is done.
                </p>
              ) : topics.length > 0 ? (
                topics.map((topic, index) => (
                  <button
                    key={`${topic.label}-${topic.timestamp}-${index}`}
                    type="button"
                    onClick={() => jumpToTopic(topic.timestamp)}
                    disabled={video.videoType === "link" && Boolean(embedUrl)}
                    className="flex w-full items-start gap-4 rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:bg-white"
                  >
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                      {formatTimestamp(topic.timestamp)}
                    </span>
                    <span>
                        <span className="block text-[14px] font-semibold text-slate-900">
                          {topic.label}
                        </span>
                        <span className="mt-1 block text-[13px] leading-5 text-slate-600">
                          {topic.summary}
                        </span>
                    </span>
                  </button>
                ))
              ) : (
                <p className="text-[13px] text-slate-500">
                  No timestamps available yet.
                </p>
              )}
            </div>

            {video.videoType === "link" && embedUrl ? (
              <p className="mt-4 text-[12px] text-slate-500">
                Clickable timestamp jumping works for uploaded files. Link-based
                embeds still show the chapter outline.
              </p>
            ) : null}
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[16px] font-semibold text-slate-900">Transcript</h2>
            <p className="mt-1 text-[13px] leading-5 text-slate-600">
              {isProcessing
                ? "Transcript is currently being generated."
                : transcript
                  ? `Transcript available in ${selectedLanguage}.`
                  : "No transcript available for this video yet."}
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-[13px] leading-6 text-slate-700 ring-1 ring-slate-200">
              {isProcessing ? (
                <p>Transcribing and translating the lesson...</p>
              ) : transcript ? (
                <p className="whitespace-pre-line">{transcript}</p>
              ) : (
                <p>Transcript will appear here once the video is processed.</p>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[26px] bg-gradient-to-br from-amber-100 via-white to-cyan-100 p-5 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-[16px] font-semibold text-slate-900">AI notes</h2>
            <p className="mt-1 text-[13px] leading-5 text-slate-600">
              Quick revision notes generated for this lesson.
            </p>

            <div className="mt-5 space-y-3">
              {isProcessing ? (
                <p className="text-[13px] text-slate-500">
                  Notes are being generated from the lesson content.
                </p>
              ) : notes.length > 0 ? (
                notes.map((note, index) => (
                  <div
                    key={`${note}-${index}`}
                    className="rounded-xl bg-white/85 px-4 py-4 text-[13px] leading-6 text-slate-700 shadow-sm ring-1 ring-white"
                  >
                    {note}
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-slate-500">
                  Notes will appear here after processing.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-[16px] font-semibold text-slate-900">Lesson summary</h2>
            <p className="mt-4 text-[13px] leading-6 text-slate-600">{summary}</p>
          </div>

          <div className="rounded-[26px] bg-slate-900 p-5 text-white shadow-sm">
            <h2 className="text-[16px] font-semibold">Study flow</h2>
            <div className="mt-4 space-y-3 text-[13px] leading-6 text-slate-200">
              <p>Watch the lesson once from start to finish.</p>
              <p>Use the timestamps to revisit the exact concept you need.</p>
              <p>Read the notes and transcript for quick revision.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
