import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [language, setLanguage] = useState(user?.preferredLanguage || "English");

  const handleLanguageChange = () => {
    const updatedUser = { ...user, preferredLanguage: language };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Language updated successfully");
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">User Info</h3>
        <p><strong>Name:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Language</h3>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-4 py-2 rounded-md w-full"
        >
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>

        <button
          onClick={handleLanguageChange}
          className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-md"
        >
          Save Language
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
      >
        Logout
      </button>
    </div>
  );
}