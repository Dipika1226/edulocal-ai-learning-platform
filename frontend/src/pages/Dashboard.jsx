import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const userName = "Mahima"; 

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <div className="bg-white shadow-md px-4 sm:px-6 py-4 flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-start sm:items-center">
        <h1 className="text-xl font-bold text-purple-600">EduLocal</h1>

        <button
          onClick={() => navigate("/login")}
          className="bg-red-500 text-white px-4 py-2 rounded-md text-sm"
        >
          Logout
        </button>
      </div>

      {/* Main Section */}
      <div className="p-4 sm:p-6">

        {/* Welcome */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome to Dashboard 🎉
          </h2>

          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Hello, <span className="font-bold text-purple-600">{userName}</span> 👋
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Upload */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Upload Video</h3>
            <p className="text-gray-500 mb-4">
              Share your learning content
            </p>

            <button
              onClick={() => navigate("/upload")}
              className="bg-purple-600 text-white px-4 py-2 rounded-md"
            >
              Upload Now
            </button>
          </div>

          {/* History */}
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">Your History</h3>
            <p className="text-gray-500 mb-4">
              Check your activity
            </p>

            <button
              onClick={() => alert("History coming soon 📜")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              View History
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
