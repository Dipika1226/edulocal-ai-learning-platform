import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const languages = [
  { code: "GB", label: "English" },
  { code: "IN", label: "हिंदी (Hindi)" },
  { code: "IN", label: "বাংলা (Bengali)" },
  { code: "IN", label: "తెలుగు (Telugu)" },
  { code: "IN", label: "मराठी (Marathi)" },
  { code: "IN", label: "தமிழ் (Tamil)" },
  { code: "IN", label: "ગુજરાતી (Gujarati)" },
  { code: "IN", label: "ಕನ್ನಡ (Kannada)" },
  { code: "IN", label: "മലയാളം (Malayalam)" },
  { code: "IN", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "IN", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "IN", label: "অসমীয়া (Assamese)" },
];

export default function SignupStep2() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleCreateAccount = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 px-4 pt-12 pb-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600">EduLocal</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Create Your Account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Start your learning journey today
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-medium">
            1
          </span>
          <span className="w-12 h-[2px] bg-purple-600" />
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-medium">
            2
          </span>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 shadow-xl">
          <h3 className="text-sm font-semibold text-gray-800">
            Choose Your Preferred Language
          </h3>
          <p className="mt-2 text-xs text-gray-500">
            Select the language you're most comfortable learning in
          </p>

          <form onSubmit={handleCreateAccount} className="mt-5">
            <div className="grid grid-cols-3 gap-3">
              {languages.map((language) => {
                const isSelected = selectedLanguage === language.label;

                return (
                  <button
                    key={language.label}
                    type="button"
                    onClick={() => setSelectedLanguage(language.label)}
                    className={[
                      "rounded-md border px-3 py-3 text-left transition",
                      isSelected
                        ? "border-purple-500 bg-purple-50 shadow-sm"
                        : "border-gray-300 bg-white hover:border-purple-300 hover:bg-purple-50/40",
                    ].join(" ")}
                  >
                    <span className="block text-xs font-semibold text-gray-800">
                      {language.code}
                    </span>
                    <span className="mt-1 block text-[10px] leading-4 text-gray-600">
                      {language.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="flex items-center justify-center gap-2 rounded-md border border-purple-600 px-4 py-3 text-sm font-medium text-purple-600 transition hover:bg-purple-50"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-md bg-purple-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-purple-700"
              >
                <Check size={16} />
                Create Account
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <Link
          to="/"
          className="block text-center text-sm text-gray-500 mt-6 hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
