import { useLocation } from "react-router-dom";

export default function Watch() {
  const location = useLocation();
  const video = location.state?.video;

  return (
    <div className="flex gap-6 p-6">

      {/* LEFT: Video Player */}
      <div className="flex-1">
        {video?.type === "file" ? (
          <video
            src={video.url}
            controls
            className="w-full rounded-md"
          />
        ) : (
          <iframe
            width="100%"
            height="400"
            src={
              video?.link.includes("v=")
                ? `https://www.youtube.com/embed/${video.link.split("v=")[1]}`
                : `https://www.youtube.com/embed/${video.link.split("youtu.be/")[1]}`
            }
            title="video"
            allowFullScreen
          ></iframe>
        )}
      </div>

      {/* RIGHT: Recommendations */}
      <div className="w-80 space-y-4">
        <h3 className="font-bold">Recommended</h3>

        {/* dummy cards */}
        {[1,2,3,4].map((item) => (
          <div key={item} className="bg-white p-2 rounded shadow">
            <img
              src="https://via.placeholder.com/150"
              className="w-full rounded"
            />
            <p className="text-sm mt-2">Sample Video {item}</p>
          </div>
        ))}
      </div>

    </div>
  );
}