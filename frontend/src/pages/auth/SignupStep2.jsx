import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupStep2() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState("");
  const [loading, setLoading] = useState(false);
  const [signupData, setSignupData] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("signupData");

    if (!savedData) {
      navigate("/signup");
      return;
    }

    setSignupData(JSON.parse(savedData));
  }, [navigate]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!language) {
      alert("Please select preferred language");
      return;
    }

    if (!signupData) {
      alert("Signup data missing");
      navigate("/signup");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...signupData,
          preferredLanguage: language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      sessionStorage.removeItem("signupData");
      alert("Account created successfully ✅");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600">EduLocal</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Complete Your Profile
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Choose your preferred language
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white text-sm font-medium">
            1
          </span>
          <span className="w-12 h-[2px] bg-gray-300" />
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-medium">
            2
          </span>
        </div>

        <form onSubmit={handleCreateAccount} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Select Preferred Language
          </label>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select language</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}