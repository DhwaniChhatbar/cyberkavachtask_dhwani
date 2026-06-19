import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "Event Permission",
        "Resource Request",
        "Budget Approval",
        "Social Media Approval",
        "Content Approval",
        "Certificate Approval",
        "Collaboration Request",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected"],
      default: "Pending",
    },

    approvalChain: [
      {
        role: {
          type: String,
          required: true,
        },

        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending",
        },

        approvedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },

        comment: {
          type: String,
          default: "",
        },

        timestamp: {
          type: Date,
          default: null,
        },
      },
    ],

    currentStage: {
      type: Number,
      default: 0,
    },

    timeline: [
      {
        action: {
          type: String,
          required: true,
        },

        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        comment: {
          type: String,
          default: "",
        },

        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    currentLevel: {
      type: String,
      default: "Club Member",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Request", requestSchema);