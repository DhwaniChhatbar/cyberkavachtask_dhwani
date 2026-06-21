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
    registrationDeadline: Date,

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

    tags: [{ type: String }],

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

    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvalDate: Date,
    publishDate: Date,

    // ==========================
    // WORKFLOW CONTROL (IMPORTANT)
    // ==========================
    status: {
      type: String,
      enum: [
        "Draft",                  // Tech creating
        "Pending Faculty Review", // sent by Tech
        "Approved by Faculty",    // Faculty approved
        "Pending Publish",        // sent to Student
        "Published",              // LIVE
        "Rejected",               // optional safety
      ],
      default: "Draft",
    },

    // ==========================
    // ROLE TRACKING (STRICT FLOW)
    // ==========================
    workflow: {
      submittedByTech: { type: Boolean, default: false },
      facultyReviewed: { type: Boolean, default: false },
      studentPublished: { type: Boolean, default: false },
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // CERTIFICATES
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