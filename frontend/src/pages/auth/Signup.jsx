import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      localStorage.setItem(
        "signupDraft",
        JSON.stringify({
          username: fullName,
          email,
          password,
        }),
      );
      navigate("/signup-step2");
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[13px] font-semibold text-slate-600">
            2
          </div>
        </div>

        <div className="w-full rounded-[28px] border border-white/80 bg-white/90 p-8 shadow-[0_22px_55px_rgba(148,163,184,0.18)] backdrop-blur">
          <h2 className="mb-4 text-[15px] font-semibold text-slate-800">
            Basic Information
          </h2>

          <form onSubmit={handleContinue} className="space-y-4">
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[14px] outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-[14px] outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-11 text-[14px] outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-linear-to-r from-fuchsia-600 to-violet-600 py-3 text-[14px] font-semibold text-white transition hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Continue"}
            </button>
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
