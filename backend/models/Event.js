import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    date: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      default: "",
    },

    venue: {
      type: String,
      default: "",
    },

    registrationDeadline: {
      type: String,
      default: "",
    },

    poster: {
      type: String,
      default: "",
    },

    teamSize: {
      type: Number,
      default: 1,
    },

    rules: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
      },
    ],

    // Event capacity
    capacity: {
      type: Number,
      default: 100,
    },

    // Registration count
    registrationCount: {
      type: Number,
      default: 0,
    },

    // Publish approval workflow
    status: {
      type: String,
      enum: [
        "Draft",
        "Pending Approval",
        "Published",
      ],
      default: "Draft",
    },

    // Coordinator approval info
    approvedBy: {
      type: String,
      default: "",
    },

    approvalDate: {
      type: Date,
    },

    // Public registration link
    registrationLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Event",
  eventSchema
);