import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    role: {
      type: String,
      enum: [
        "FacultyCoordinator",
        "StudentCoordinator",
        "TechCoordinator",
        "ContentCoordinator",
        "SocialMediaCoordinator",
        "Member",
        "Guest",
      ],
      default: "Member",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    // 🔥 OTP SYSTEM (ADDED)
    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    // 🔥 OPTIONAL (useful for security)
    resetPasswordToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);