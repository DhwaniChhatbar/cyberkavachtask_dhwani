import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // ==========================
    // BASIC DETAILS
    // ==========================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      default: "",
    },

    venue: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================
    // REGISTRATION
    // ==========================
    registrationDeadline: {
      type: Date,
    },

    registrationLink: {
      type: String,
      default: "",
    },

    teamSize: {
      type: Number,
      default: 1,
      min: 1,
    },

    capacity: {
      type: Number,
      default: 100,
      min: 1,
    },

    registrationCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==========================
    // EVENT TYPE
    // ==========================
    eventType: {
      type: String,
      enum: ["Solo", "Team"],
      default: "Solo",
    },

    category: {
      type: String,
      default: "General",
    },

    tags: [
      {
        type: String,
      },
    ],

    // ==========================
    // RULES & MEDIA
    // ==========================
    rules: {
      type: String,
      default: "",
    },

    poster: {
      type: String,
      default: "",
    },

    // ==========================
    // OWNERSHIP
    // ==========================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvalDate: {
      type: Date,
    },

    // ==========================
    // WORKFLOW
    // ==========================
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending Approval",
        "Published",
      ],
      default: "Draft",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // CERTIFICATE CONTROL
    // ==========================
    certificatesEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================
// INDEXES
// ==========================
eventSchema.index({ status: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ createdBy: 1 });

export default mongoose.model("Event", eventSchema);