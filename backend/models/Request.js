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
        "Collaboration Request"
      ],
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected"],
      default: "Pending"
    },

    approvalChain: [
      {
        role: {
          type: String,
          required: true
        },

        status: {
          type: String,
          enum: ["Pending", "Approved", "Rejected"],
          default: "Pending"
        },

        approvedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        comment: {
          type: String
        },

        timestamp: {
          type: Date
        }
      }
    ],

    currentStage: {
      type: Number,
      default: 0
    },

    timeline: [
      {
        action: {
          type: String
        },

        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },

        comment: {
          type: String
        },

        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],

    currentLevel: {
      type: String,
      default: "Club Member"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Request", requestSchema);