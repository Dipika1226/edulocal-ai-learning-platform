import { Link } from "react-router-dom";

export default function Signup() {
  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Form submitted");
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl font-bold text-purple-700">EduLocal</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Create Your Account
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Start your learning journey today
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium">
          1
        </div>
        <div className="w-16 h-px bg-gray-300" />
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
          2
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>

        {/* Full name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

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
            placeholder="Create a password"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Confirm password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        {/* Continue */}
        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-md font-medium transition">
          Continue →
        </button>

        {/* Login link */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Back to home */}
      <Link to="/" className="mt-6 text-sm text-gray-500 hover:text-purple-600">
        ← Back to home
      </Link>
    </div>
  );
}
