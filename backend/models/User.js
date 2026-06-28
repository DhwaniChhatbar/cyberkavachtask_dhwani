import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ======================
    // BASIC DETAILS
    // ======================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, // Already creates an index
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // ======================
    // COLLEGE DETAILS
    // ======================
    collegeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    institute: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================
    // ROLE
    // ======================
    role: {
      type: String,
      enum: [
        "Faculty Coordinator",
        "Student Coordinator",
        "Tech Coordinator",
        "Content Coordinator",
        "Social Media Coordinator",
        "Member",
        "Guest",
      ],
      default: "Guest",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    // ======================
    // AUTHENTICATION
    // ======================
    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ======================
// INDEXES
// ======================
// email already unique indexed
// collegeId already unique indexed

userSchema.index({ role: 1 });
userSchema.index({ isApproved: 1 });

export default mongoose.model("User", userSchema);