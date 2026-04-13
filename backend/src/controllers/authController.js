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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        preferredLanguage: user.preferredLanguage,
        profileCompleted: user.profileCompleted,
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
        preferredLanguage: user.preferredLanguage || "English",
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const { phoneNumber, address, preferredLanguage } = req.body;

    if (!preferredLanguage) {
      return res.status(400).json({ message: "Preferred language is required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.phoneNumber = phoneNumber || user.phoneNumber || "";
    user.address = address || user.address || "";
    user.preferredLanguage = preferredLanguage;
    user.profileCompleted = true;

    await user.save();

    res.json({
      message: "Profile completed successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        preferredLanguage: user.preferredLanguage,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
