import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import { io } from "../server.js";

// ==========================
// CREATE REQUEST
// ==========================
export const createRequest = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);

    const { title, type, description } = req.body;

    if (!title || !type || !description) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    const request = await Request.create({
      title,
      type,
      description,
      createdBy: req.user.id,
      approvalChain: [
        { role: "Tech Coordinator", status: "Pending" },
        { role: "Student Coordinator", status: "Pending" },
        { role: "Faculty Coordinator", status: "Pending" },
      ],
      currentStage: 0,
      status: "Under Review",
      timeline: [
        {
          action: "Request Created",
          by: req.user.id,
          comment: "Request Submitted",
        },
      ],
    });

    await Notification.create({
      recipient: req.user.id,
      message: "Request submitted successfully",
      type: "Request",
    });

    io.emit("requestCreated", request);

    return res.status(201).json({
      success: true,
      request,
    });
  } catch (err) {
    console.error("CREATE REQUEST ERROR:", err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// GET ALL REQUESTS
// ==========================
export const getAllRequests = async (req, res) => {
  try {
    let requests;

    const role = req.user.role;

    const canViewAll =
      role === "Student Coordinator" ||
      role === "Faculty Coordinator" ||
      role === "Tech Coordinator";

    if (canViewAll) {
      requests = await Request.find()
        .populate("createdBy", "name email role")
        .sort({ createdAt: -1 });
    } else {
      requests = await Request.find({ createdBy: req.user.id })
        .populate("createdBy", "name email role")
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
      .populate("createdBy", "name email role")
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
      "createdBy",
      "name email role"
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const isOwner =
      request.createdBy._id.toString() === req.user.id;

    const isCoordinator =
      req.user.role === "Student Coordinator" ||
      req.user.role === "Faculty Coordinator" ||
      req.user.role === "Tech Coordinator";

    if (!isOwner && !isCoordinator) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    return res.json(request);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// APPROVE REQUEST (ONLY COORDINATORS)
// ==========================
export const approveRequest = async (req, res) => {
  try {
    const { comment = "" } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ❌ BLOCK MEMBERS
    if (req.user.role === "Member" || req.user.role === "Guest") {
      return res.status(403).json({
        message: "Members cannot approve requests",
      });
    }

    if (["Approved", "Rejected"].includes(request.status)) {
      return res.status(400).json({
        message: "Request already finalized",
      });
    }

    const stage = request.currentStage;

    const currentRole = request.approvalChain[stage]?.role;

    if (!currentRole) {
      return res.status(400).json({
        message: "Invalid approval stage",
      });
    }

    if (currentRole !== req.user.role) {
      return res.status(403).json({
        message: "Not authorized for this approval stage",
      });
    }

    request.approvalChain[stage].status = "Approved";
    request.approvalChain[stage].approvedBy = req.user.id;
    request.approvalChain[stage].comment = comment;
    request.approvalChain[stage].timestamp = new Date();

    request.timeline.push({
      action: `${req.user.role} Approved`,
      by: req.user.id,
      comment,
    });

    if (stage === request.approvalChain.length - 1) {
      request.status = "Approved";
    } else {
      request.currentStage += 1;
      request.status = "Under Review";
    }

    await request.save();

    await Notification.create({
      recipient: request.createdBy,
      message: `${req.user.role} approved your request`,
      type: "Approval",
    });

    io.emit("requestUpdated", request);

    return res.json(request);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// REJECT REQUEST (ONLY COORDINATORS)
// ==========================
export const rejectRequest = async (req, res) => {
  try {
    const { comment = "" } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // ❌ BLOCK MEMBERS
    if (req.user.role === "Member" || req.user.role === "Guest") {
      return res.status(403).json({
        message: "Members cannot reject requests",
      });
    }

    if (["Approved", "Rejected"].includes(request.status)) {
      return res.status(400).json({
        message: "Request already finalized",
      });
    }

    request.status = "Rejected";

    request.timeline.push({
      action: `${req.user.role} Rejected`,
      by: req.user.id,
      comment,
    });

    await request.save();

    await Notification.create({
      recipient: request.createdBy,
      message: `${req.user.role} rejected your request`,
      type: "Rejection",
    });

    io.emit("requestUpdated", request);

    return res.json(request);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};