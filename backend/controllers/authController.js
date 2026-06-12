import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";


// ==========================
// 🔥 REGISTER
// ==========================
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      isApproved: false,
    });

    res.json({ message: "Registration submitted for approval" });

  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ==========================
// 🔥 LOGIN
// ==========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "Account not approved yet" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ==========================
// 🔥 SEND OTP
// ==========================
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    await sendEmail(
      email,
      "OTP for Password Reset",
      `Your OTP is: ${otp}. It expires in 10 minutes.`
    );

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ==========================
// 🔥 VERIFY OTP
// ==========================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "OTP not generated" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    res.json({ message: "OTP verified successfully" });

  } catch (err) {
    res.status(500).json(err.message);
  }
};


// ==========================
// 🔥 RESET PASSWORD
// ==========================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json(err.message);
  }
};