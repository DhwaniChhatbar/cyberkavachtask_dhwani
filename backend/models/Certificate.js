import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Participation",
        "Winner",
        "Runner Up",
        "Special",
      ],
      default: "Participation",
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    // Anti-tamper verification hash
    hash: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate individual certificates
certificateSchema.index(
  {
    eventName: 1,
    user: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      user: { $exists: true, $type: "objectId" },
    },
  }
);

// Prevent duplicate team certificates
certificateSchema.index(
  {
    eventName: 1,
    team: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      team: { $exists: true, $type: "objectId" },
    },
  }
);

export default mongoose.model(
  "Certificate",
  certificateSchema
);