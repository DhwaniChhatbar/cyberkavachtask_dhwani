import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import { io } from "../server.js";
import { logAudit } from "../utils/auditLogger.js";

/**
 * ==========================
 * CREATE REQUEST
 * ==========================
 */
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

    await logAudit({
      user: req.user.id,
      action: "CREATE_REQUEST",
      module: "REQUEST",
      details: title,
    });

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

/**
 * ==========================
 * GET ALL REQUESTS
 * ==========================
 */
export const getAllRequests = async (req, res) => {
  try {
    const role = req.user.role;

    const canViewAll = [
      "Admin",
      "Faculty Coordinator",
      "Student Coordinator",
      "Tech Coordinator",
      "Content Coordinator",
      "Social Media Coordinator",
    ].includes(role);

    const requests = canViewAll
      ? await Request.find()
          .populate("createdBy", "name email role")
          .sort({ createdAt: -1 })
      : await Request.find({ createdBy: req.user.id })
          .populate("createdBy", "name email role")
          .sort({ createdAt: -1 });

    // ✅ AUDIT LOG ADDED
    await logAudit({
      user: req.user.id,
      action: "VIEW_ALL_REQUESTS",
      module: "REQUEST",
      details: "Viewed request list",
    });

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

/**
 * ==========================
 * GET MY REQUESTS
 * ==========================
 */
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      createdBy: req.user.id,
    })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    // ✅ AUDIT LOG ADDED
    await logAudit({
      user: req.user.id,
      action: "VIEW_MY_REQUESTS",
      module: "REQUEST",
      details: "Viewed own requests",
    });

    return res.json(requests);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

/**
 * ==========================
 * GET REQUEST BY ID
 * ==========================
 */
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const role = req.user.role;

    const isOwner =
      request.createdBy._id.toString() === req.user.id;

    const canViewAll = [
      "Admin",
      "Faculty Coordinator",
      "Student Coordinator",
      "Tech Coordinator",
      "Content Coordinator",
      "Social Media Coordinator",
    ].includes(role);

    if (!isOwner && !canViewAll) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // ✅ AUDIT LOG ADDED
    await logAudit({
      user: req.user.id,
      action: "VIEW_REQUEST_BY_ID",
      module: "REQUEST",
      details: req.params.id,
    });

    return res.json(request);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

/**
 * ==========================
 * APPROVE REQUEST
 * ==========================
 */
export const approveRequest = async (req, res) => {
  try {
    const { comment = "" } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const role = req.user.role;

    const approverRoles = [
      "Admin",
      "Faculty Coordinator",
      "Student Coordinator",
      "Tech Coordinator",
      "Content Coordinator",
      "Social Media Coordinator",
    ];

    if (!approverRoles.includes(role)) {
      return res.status(403).json({
        message: "You cannot approve requests",
      });
    }

    if (
      request.status === "Approved" ||
      request.status === "Rejected"
    ) {
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

    if (role !== "Admin" && currentRole !== role) {
      return res.status(403).json({
        message: "Not your approval level",
      });
    }

    request.approvalChain[stage].status = "Approved";
    request.approvalChain[stage].approvedBy = req.user.id;
    request.approvalChain[stage].comment = comment;
    request.approvalChain[stage].timestamp = new Date();

    request.timeline.push({
      action: `${role} Approved`,
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

    await logAudit({
      user: req.user.id,
      action: "APPROVE_REQUEST",
      module: "REQUEST",
      details: req.params.id,
    });

    await Notification.create({
      recipient: request.createdBy,
      message: `${role} approved your request`,
      type: "Approval",
    });

    io.emit("requestUpdated", request);

    return res.json(request);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

/**
 * ==========================
 * REJECT REQUEST
 * ==========================
 */
export const rejectRequest = async (req, res) => {
  try {
    const { comment = "" } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    const role = req.user.role;

    const approverRoles = [
      "Admin",
      "Faculty Coordinator",
      "Student Coordinator",
      "Tech Coordinator",
      "Content Coordinator",
      "Social Media Coordinator",
    ];

    if (!approverRoles.includes(role)) {
      return res.status(403).json({
        message: "You cannot reject requests",
      });
    }

    if (
      request.status === "Approved" ||
      request.status === "Rejected"
    ) {
      return res.status(400).json({
        message: "Request already finalized",
      });
    }

    request.status = "Rejected";

    request.timeline.push({
      action: `${role} Rejected`,
      by: req.user.id,
      comment,
    });

    await request.save();

    await logAudit({
      user: req.user.id,
      action: "REJECT_REQUEST",
      module: "REQUEST",
      details: req.params.id,
    });

    await Notification.create({
      recipient: request.createdBy,
      message: `${role} rejected your request`,
      type: "Rejection",
    });

    io.emit("requestUpdated", request);

    return res.json(request);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};