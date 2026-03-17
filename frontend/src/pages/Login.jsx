import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl font-bold text-purple-700">EduLocal</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
      <p className="text-gray-500 mt-1 mb-8">Continue your learning journey</p>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Remember / Forgot */}
        <div className="flex items-center justify-between text-sm mb-6">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="rounded" />
            Remember me
          </label>

          <button className="text-purple-600 hover:underline">
            Forgot password?
          </button>
        </div>

        {/* Button */}
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-md font-medium transition">
          Sign In
        </button>

        {/* Signup link */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign up now
          </Link>
        </p>

        {/* Demo creds */}
        <p className="text-xs text-gray-400 text-center mt-4">
          © Demo Admin: admin@edulocal.com / admin123
        </p>
      </div>

      {/* Back to home */}
      <Link to="/" className="mt-6 text-sm text-gray-500 hover:text-purple-600">
        ← Back to home
      </Link>
    </div>
  );
}
