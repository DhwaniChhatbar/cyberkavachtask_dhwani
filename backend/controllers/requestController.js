import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import { io } from "../server.js";

// ==========================
// CREATE REQUEST
// ==========================
export const createRequest = async (req, res) => {
  try {
    const approvalChain = [
      { role: "Tech Coordinator", status: "Pending" },
      { role: "Student Coordinator", status: "Pending" },
      { role: "Faculty Coordinator", status: "Pending" },
    ];

    const request = await Request.create({
      ...req.body,
      createdBy: req.user.id,
      approvalChain,
      currentStage: 0,
      status: "Under Review",
    });

    request.timeline.push({
      action: "Request Created",
      by: req.user.id,
      comment: "Request Submitted",
    });

    await request.save();

    const notification = await Notification.create({
      recipient: req.user.id,
      message: "Request submitted successfully",
      type: "Request",
    });

    io.emit("requestCreated", request);
    io.emit("notification", notification);

    return res.status(201).json(request);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET ALL REQUESTS
// ==========================
export const getAllRequests = async (req, res) => {
  try {
    let requests;

    if (
      req.user.role === "Student Coordinator" ||
      req.user.role === "Faculty Coordinator"
    ) {
      requests = await Request.find()
        .populate("createdBy")
        .sort({ createdAt: -1 });
    } else {
      requests = await Request.find({ createdBy: req.user.id })
        .populate("createdBy")
        .sort({ createdAt: -1 });
    }

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET MY REQUESTS
// ==========================
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ createdBy: req.user.id })
      .populate("createdBy")
      .sort({ createdAt: -1 });

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET REQUEST BY ID
// ==========================
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "createdBy"
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const isOwner =
      request.createdBy._id.toString() === req.user.id;

    const isAdmin =
      req.user.role === "Student Coordinator" ||
      req.user.role === "Faculty Coordinator";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.json(request);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// APPROVE REQUEST
// ==========================
export const approveRequest = async (req, res) => {
  try {
    const { comment = "" } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (
      request.status === "Approved" ||
      request.status === "Rejected"
    ) {
      return res
        .status(400)
        .json({ message: "Request already finalized" });
    }

    const stage = request.currentStage;

    if (!request.approvalChain[stage]) {
      return res.status(400).json({ message: "Invalid stage" });
    }

    if (
      request.approvalChain[stage].role !== req.user.role
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized for this stage" });
    }

    request.approvalChain[stage].status = "Approved";
    request.approvalChain[stage].approvedBy = req.user.id;
    request.approvalChain[stage].comment = comment;
    request.approvalChain[stage].timestamp = new Date();

    request.timeline.push({
      action: req.user.role + " Approved",
      by: req.user.id,
      comment,
    });

    if (stage === request.approvalChain.length - 1) {
      request.status = "Approved";
    } else {
      request.currentStage++;
      request.status = "Under Review";
    }

    await request.save();

    const notification = await Notification.create({
      recipient: request.createdBy,
      message: req.user.role + " approved your request",
      type: "Approval",
    });

    io.emit("requestUpdated", request);
    io.emit("notification", notification);

    return res.json(request);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// REJECT REQUEST
// ==========================
export const rejectRequest = async (req, res) => {
  try {
    const { comment = "" } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (
      request.status === "Approved" ||
      request.status === "Rejected"
    ) {
      return res
        .status(400)
        .json({ message: "Request already finalized" });
    }

    request.status = "Rejected";

    request.timeline.push({
      action: req.user.role + " Rejected",
      by: req.user.id,
      comment,
    });

    await request.save();

    const notification = await Notification.create({
      recipient: request.createdBy,
      message: req.user.role + " rejected your request",
      type: "Rejection",
    });

    io.emit("requestUpdated", request);
    io.emit("notification", notification);

    return res.json(request);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};