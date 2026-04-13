import jwt from "jsonwebtoken";
import User from "../models/User.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, email, password, preferredLanguage } = req.body;
    console.log("signup body:", req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      preferredLanguage,
    });

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login API hit");
    console.log("Email:", email);

    const user = await User.findOne({ email });
    console.log("login db user:", user);
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
      id: user._id,
      username: user.username,
      email: user.email,
       preferredLanguage: user.preferredLanguage,
    },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    console.log("Password Reset OTP:", otp);

    res.json({
  message: "OTP generated successfully",
  otp,
});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !user.resetOtp ||
      user.resetOtp !== otp ||
      !user.resetOtpExpiry ||
      new Date(user.resetOtpExpiry) < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = newPassword;
    user.resetOtp = "";
    user.resetOtpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      preferredLanguage: user.preferredLanguage,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};