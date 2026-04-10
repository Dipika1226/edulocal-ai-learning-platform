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
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
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

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: fullName,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully ✅");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert("Backend se connection nahi ho raha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-purple-600">EduLocal</h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Create Your Account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Start your learning journey today
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white text-sm font-medium">
            1
          </span>
          <span className="w-12 h-[2px] bg-gray-200" />
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 text-sm">
            2
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Basic Information
          </h3>

          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <div
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Continue →"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium">
            Sign in
          </Link>
        </p>

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