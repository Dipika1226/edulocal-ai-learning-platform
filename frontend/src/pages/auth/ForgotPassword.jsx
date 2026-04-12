import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to send OTP");
        return;
      }

      setGeneratedOtp(data.otp || "");
      setStep(2);
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();
        console.log("Forgot password response:", data);
      if (!res.ok) {
        alert(data.message || "Reset failed");
        return;
      }

      alert("Password reset successful ✅");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-900">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Reset your password securely
        </p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
            <div className="rounded-md bg-purple-50 border border-purple-200 px-4 py-3 text-sm text-purple-700">
              Demo OTP: <span className="font-bold">{generatedOtp}</span>
            </div>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
            />

            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md font-medium transition"
            >
              Reset Password
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="block text-center text-sm text-gray-500 mt-6 hover:underline"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}