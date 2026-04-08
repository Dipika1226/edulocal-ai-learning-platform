import { Link, useNavigate } from "react-router-dom";

export default function SignupStep2() {
  const navigate = useNavigate();

  const handleCreateAccount = (e) => {
    e.preventDefault();
    alert("Account Created Successfully ");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 flex flex-col items-center justify-center px-4">
      
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-2xl font-bold text-purple-700">EduLocal</span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-gray-900">
        Complete Your Profile
      </h1>
      <p className="text-gray-500 mt-1 mb-6">
        Add some more details to continue
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-medium">
          1
        </div>
        <div className="w-16 h-px bg-gray-300" />
        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-medium">
          2
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="font-semibold text-gray-800 mb-4">
          Additional Information
        </h2>

        <form onSubmit={handleCreateAccount}>
          
          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-md font-medium transition"
          >
            Create Account →
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Back */}
      <Link to="/signup" className="mt-6 text-sm text-gray-500 hover:text-purple-600">
        ← Back to Step 1
      </Link>
    </div>
  );
}