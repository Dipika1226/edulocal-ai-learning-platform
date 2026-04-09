import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");

    // 👉 Move to Step 2
    navigate("/signup-step2");
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 px-4 pt-12 pb-8">
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

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <h3 className="text-sm font-semibold text-gray-800">
            Basic Information
          </h3>

          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
          />

          <div className="relative">
            <input
              type="password"
              placeholder="Create a password"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <Eye
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <Eye
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition mt-4"
          >
            Continue →
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
