import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import { createAuditLog } from "./auditLogController.js";

// ==========================
// 🔥 REGISTER
// ==========================
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      collegeId,
      phone,
      year,
      department,
      institute,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role ||
      !collegeId
    ) {
      return res.status(400).json({
        message: "Name, email, password, role and college ID are required",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { collegeId }],
    });

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? "User already exists"
            : "College ID already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      collegeId,
      phone,
      year,
      department,
      institute,
      isApproved: true,
    });

    await createAuditLog(
      newUser.name,
      "Authentication",
      "Registered"
    );

    console.log("User registered:", email);

    return res.status(201).json({
      message: "Registration submitted for approval",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// 🔥 LOGIN
// ==========================
export const login = async (req, res) => {
  console.log("🔥 LOGIN ROUTE HIT");
  console.log("BODY:", req.body);

  try {
    const { email, password } = req.body;

    console.log("Email:", email);

    if (!email || !password) {
      console.log("❌ Missing email or password");

      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    console.log("User found:", user);

    if (!user) {
      console.log("❌ User not found");

      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid credentials");

      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    await createAuditLog(
      user.name,
      "Authentication",
      "Logged In"
    );

    console.log("✅ Login successful:", user.email);

    return res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    console.log("❌ LOGIN ERROR:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// 🔥 SEND OTP
// ==========================
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
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

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// 🔥 VERIFY OTP
// ==========================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({
        message: "OTP not generated",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// 🔥 RESET PASSWORD
// ==========================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};