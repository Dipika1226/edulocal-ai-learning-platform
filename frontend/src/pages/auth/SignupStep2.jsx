import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const languageOptions = [
  { code: "GB", value: "English", label: "English" },
  { code: "IN", value: "Hindi", label: "हिंदी (Hindi)" },
  { code: "IN", value: "Bengali", label: "বাংলা (Bengali)" },
  { code: "IN", value: "Telugu", label: "తెలుగు (Telugu)" },
  { code: "IN", value: "Marathi", label: "मराठी (Marathi)" },
  { code: "IN", value: "Tamil", label: "தமிழ் (Tamil)" },
  { code: "IN", value: "Gujarati", label: "ગુજરાતી (Gujarati)" },
  { code: "IN", value: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
  { code: "IN", value: "Malayalam", label: "മലയാളം (Malayalam)" },
  { code: "IN", value: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
  { code: "IN", value: "Odia", label: "ଓଡ଼ିଆ (Odia)" },
  { code: "IN", value: "Assamese", label: "অসমীয়া (Assamese)" },
];

export default function SignupStep2() {
  const navigate = useNavigate();
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!preferredLanguage) {
      alert("Please select your preferred language");
      return;
    }

    const draft = JSON.parse(localStorage.getItem("signupDraft") || "{}");

    if (!draft.username || !draft.email || !draft.password) {
      alert("Please complete step 1 first");
      navigate("/signup");
      return;
    }

    try {
      setLoading(true);

      const signupRes = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        alert(signupData.message || "Signup failed");
        return;
      }

      const profileRes = await fetch(
        "http://localhost:5000/api/auth/complete-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${signupData.token}`,
          },
          body: JSON.stringify({
            preferredLanguage,
          }),
        },
      );

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        alert(profileData.message || "Profile completion failed");
        return;
      }

      localStorage.setItem("token", signupData.token);
      localStorage.setItem("user", JSON.stringify(profileData.user));
      localStorage.removeItem("signupDraft");

      alert("Account created successfully ✅");
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup step 2 error:", error);
      alert("Unable to create account right now");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.10),transparent_32%),radial-gradient(circle_at_bottom,rgba(45,212,191,0.12),transparent_30%),linear-gradient(135deg,#fbf7ff_0%,#ffffff_52%,#f3fbfb_100%)] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-purple-600">EduLocal</h1>
        </div>

        <h1 className="text-center text-[30px] font-semibold leading-tight text-slate-900">
          Create Your Account
        </h1>
        <p className="mt-2 text-center text-[13px] leading-5 text-slate-500">
          Start your learning journey today
        </p>

        <div className="mb-8 mt-6 flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-[13px] font-semibold text-white">
            1
          </div>
          <div className="h-0.5 w-16 bg-purple-200" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-[13px] font-semibold text-white">
            2
          </div>
        </div>

        <div className="w-full rounded-[26px] border border-white/80 bg-white/90 p-6 shadow-[0_22px_55px_rgba(148,163,184,0.18)] backdrop-blur sm:p-7">
          <h2 className="text-[15px] font-semibold text-slate-800">
            Choose Your Preferred Language
          </h2>
          <p className="mb-5 mt-2 text-[13px] leading-5 text-slate-500">
            Select the language you're most comfortable learning in
          </p>

          <form onSubmit={handleCreateAccount}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {languageOptions.map((language) => {
                const isSelected = preferredLanguage === language.value;

                return (
                  <button
                    key={language.value}
                    type="button"
                    onClick={() => setPreferredLanguage(language.value)}
                    className={[
                      "rounded-xl border px-3 py-3 text-left transition",
                      isSelected
                        ? "border-purple-600 bg-purple-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-purple-300 hover:bg-purple-50/40",
                    ].join(" ")}
                  >
                    <span className="block text-[12px] font-semibold text-slate-900">
                      {language.code}
                    </span>
                    <span className="mt-2 block text-[12px] leading-4 text-slate-700">
                      {language.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="rounded-xl border border-purple-500 px-4 py-3 text-[14px] font-medium text-purple-600 transition hover:bg-purple-50"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 px-4 py-3 text-[14px] font-medium text-white transition hover:shadow-lg disabled:opacity-60"
              >
                {loading ? "Creating..." : "✓ Create Account"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-[13px] text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <Link
          to="/"
          className="mt-6 text-[13px] text-slate-500 hover:text-purple-600"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
