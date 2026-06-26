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
      trim: true,
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
      trim: true,
    },

    registrations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    teamSize: {
      type: Number,
      default: 1,
      min: 1,
      max: 20,
      set: (v) => Number(v),
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      set: (v) => Number(v),
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
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    rules: {
      type: String,
      default: "",
      trim: true,
    },

    poster: {
      type: String,
      default: "",
      trim: true,
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
      default: null,
    },

    publishedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvalDate: {
      type: Date,
      default: null,
    },

    publishDate: {
      type: Date,
      default: null,
    },

    // ==========================
    // WORKFLOW STATUS
    // ==========================
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending Faculty Review",
        "Faculty Approved",
        "Published",
        "Rejected",
      ],
      default: "Draft",
    },

    // ==========================
    // WORKFLOW FLAGS
    // ==========================
    workflow: {
      submittedByTech: {
        type: Boolean,
        default: false,
      },

      facultyReviewed: {
        type: Boolean,
        default: false,
      },

      studentPublished: {
        type: Boolean,
        default: false,
      },
    },

    // ==========================
    // CERTIFICATES
    // ==========================
    certificatesEnabled: {
      type: Boolean,
      default: false,
    },

    attendanceEnabled: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // COMPLETION
    // ==========================
    isCompleted: {
      type: Boolean,
      default: false,
    },

    attendanceCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// ==========================
// INDEXES
// ==========================
eventSchema.index({ status: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ category: 1 });

export default mongoose.model("Event", eventSchema);