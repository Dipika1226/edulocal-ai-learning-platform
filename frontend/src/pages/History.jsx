import { useEffect, useState } from "react";

export default function History() {
  const [videos, setVideos] = useState([]);

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
  } catch (err) {
    console.log("Delete error:", err);
  }
};
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Upload History 🎬</h2>

      {videos.length === 0 ? (
        <p>No videos yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, index) => {
            const isFile = video.videoType === "file";
            const isLink = video.videoType === "link";

            return (
              <div key={video._id || index} className="bg-white p-4 rounded-xl shadow">
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
                  <p className="text-sm text-red-500">Unsupported video type</p>
                )}

                <h3 className="mt-3 font-semibold text-gray-800">
                  {video.title || "Untitled Video"}
                </h3>

                {video.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {video.description}
                  </p>
                )}

                <button
  onClick={(e) => {
    e.stopPropagation();
    handleDelete(video._id);
  }}
  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
>
  Delete
</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}