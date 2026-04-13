import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
console.log("login response:", data);
console.log("login user:", data.user);
      if (!res.ok) {
        alert(data.message);
        return;
      }

      // 🔥 SAVE TOKEN
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));;
      navigate("/dashboard");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 px-4 pt-10 pb-8 sm:pt-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-purple-600">EduLocal</h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Continue your learning journey
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 sm:mt-8 space-y-4 sm:space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* Toggle Button */}
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-3">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-purple-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-purple-600 font-medium">
            Sign up now
          </Link>
        </p>

        <p className="text-xs text-gray-400 text-center mt-6">
          © Demo Admin: admin@edulocal.com / admin123
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
