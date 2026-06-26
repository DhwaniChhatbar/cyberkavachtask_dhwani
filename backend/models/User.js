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
      unique: true, // Already creates an index
      sparse: true,
      trim: true,
      default: null,
    },

    department: {
      type: String,
      trim: true,
      default: "",
    },

    institute: {
      type: String,
      trim: true,
      default: "",
    },

    year: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
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
// Don't create indexes for email and collegeId again.
// unique:true already creates them.

userSchema.index({ role: 1 });
userSchema.index({ isApproved: 1 });

export default mongoose.model("User", userSchema);