export function getVideoSource(video) {
  if (!video) return "";

  if (video.videoType === "file" && video.videoUrl?.startsWith("/uploads/")) {
    return `http://localhost:5000${video.videoUrl}`;
  }

  if (video.url) {
    return video.url;
  }

  return video.videoUrl || video.link || "";
}

export function getYoutubeEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("v=")) {
    return `https://www.youtube.com/embed/${url.split("v=")[1]?.split("&")[0]}`;
  }

  if (url.includes("youtu.be/")) {
    return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]?.split("?")[0]}`;
  }

  return "";
}

export function formatTimestamp(totalSeconds = 0) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = Math.floor(safeSeconds % 60);

  if (hours > 0) {
    return [hours, minutes, seconds]
      .map((part, index) => (index === 0 ? String(part) : String(part).padStart(2, "0")))
      .join(":");
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
