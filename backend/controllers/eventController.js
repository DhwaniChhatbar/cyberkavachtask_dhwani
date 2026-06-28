import Event from "../models/Event.js";
import Team from "../models/Team.js";
import { createAuditLog } from "./auditLogController.js";

// ==========================
// ROLE CHECK HELPER
// ==========================
const isRole = (user, roles) => {
  return roles.includes(user?.role);
};

// ==========================
// CREATE EVENT (TECH ONLY)
// ==========================
export const createEvent = async (req, res) => {
  try {
    if (!isRole(req.user, ["Tech Coordinator"])) {
      return res.status(403).json({ message: "Access denied" });
    }

    const existingEvent = await Event.findOne({
      name: req.body.name,
      date: req.body.date,
    });

    if (existingEvent) {
      return res.status(400).json({ message: "Event already exists" });
    }

    const event = await Event.create({
      ...req.body,
      teamSize: Number(req.body.teamSize || 1),
      capacity: Number(req.body.capacity || 50),
      createdBy: req.user.id,
      poster: req.file ? req.file.filename : "",
      status: "Draft",
      registrations: [],
      registrationCount: 0,
      certificatesEnabled: false,
      registrationLink: "",
      approvalStage: "NONE",
    });

    await createAuditLog(req.user.name, "Event", "Created Event");

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// REGISTER EVENT
// ==========================
export const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.registrations) {
      event.registrations = [];
    }

    if (event.registrations.includes(userId)) {
      return res.status(400).json({ message: "Already registered" });
    }

    event.registrations.push(userId);
    event.registrationCount = event.registrations.length;

    await event.save();

    await createAuditLog(req.user.name, "Event", "Registered For Event");

    return res.json({
      success: true,
      message: "Registered successfully",
      registrationCount: event.registrationCount,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// SEND FOR APPROVAL (TECH)
// ==========================
export const sendForApproval = async (req, res) => {
  try {
    if (!isRole(req.user, ["Tech Coordinator"])) {
      return res.status(403).json({ message: "Access denied" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "Draft") {
      return res.status(400).json({
        message: "Only Draft events can be sent for approval",
      });
    }

    event.status = "Pending Faculty Review";
    event.approvalStage = "FACULTY_REVIEW";

    await event.save();

    await createAuditLog(req.user.name, "Event", "Sent Event For Approval");

    return res.json({
      success: true,
      message: "Event sent for faculty approval",
      event,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// APPROVE EVENT (FACULTY)
// ==========================
export const approveEvent = async (req, res) => {
  try {
    if (!isRole(req.user, ["Faculty Coordinator"])) {
      return res.status(403).json({ message: "Access denied" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "Pending Faculty Review") {
      return res.status(400).json({
        message: "Event not in faculty review stage",
      });
    }

    event.status = "Faculty Approved";
    event.approvedBy = req.user.id;
    event.approvalStage = "STUDENT_PUBLISH";

    await event.save();

    await createAuditLog(req.user.name, "Event", "Approved Event");

    return res.json({
      success: true,
      message: "Event approved by faculty",
      event,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// PUBLISH EVENT (STUDENT)
// ==========================
export const publishEvent = async (req, res) => {
  try {
    if (!isRole(req.user, ["Student Coordinator"])) {
      return res.status(403).json({ message: "Access denied" });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "Faculty Approved") {
      return res.status(400).json({
        message: "Faculty approval required first",
      });
    }

    event.status = "Published";
    event.publishDate = new Date();
    event.publishedBy = req.user.id;
    event.certificatesEnabled = true;
    event.approvalStage = "DONE";

    await event.save();

    await createAuditLog(req.user.name, "Event", "Published Event");

    return res.json({
      success: true,
      message: "Event published successfully",
      event,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// UPDATE EVENT
// ==========================
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.status === "Faculty Approved" ||
      event.status === "Published"
    ) {
      return res.status(400).json({
        message: "Cannot edit after approval stage",
      });
    }

    Object.assign(event, {
      ...req.body,
      teamSize: req.body.teamSize
        ? Number(req.body.teamSize)
        : event.teamSize,
      capacity: req.body.capacity
        ? Number(req.body.capacity)
        : event.capacity,
    });

    if (req.file) {
      event.poster = req.file.filename;
    }

    await event.save();

    await createAuditLog(req.user.name, "Event", "Updated Event");

    return res.json({
      success: true,
      event,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET EVENTS
// ==========================
export const getEvents = async (req, res) => {
  try {
    let filter = {};

    const publicRoles = [
      "Member",
      "Content Coordinator",
      "Social Media Coordinator",
    ];

    if (isRole(req.user, publicRoles)) {
      filter = { status: "Published" };
    }

    const events = await Event.find(filter)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name")
      .populate("publishedBy", "name")
      .sort({ createdAt: -1 })
      .lean();

    const safeEvents = events.map((e) => ({
      ...e,
      registrations: e.registrations || [],
      registrationCount:
        e.registrationCount ?? (e.registrations?.length || 0),
    }));

    return res.json(safeEvents);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET PENDING EVENTS
// ==========================
export const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({
      status: {
        $in: [
          "Draft",
          "Pending Faculty Review",
          "Faculty Approved",
        ],
      },
    })
      .populate("createdBy", "name email")
      .populate("approvedBy", "name")
      .populate("publishedBy", "name")
      .sort({ createdAt: -1 });

    return res.json(events);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET EVENT BY ID
// ==========================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name")
      .populate("publishedBy", "name")
      .lean();

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json({
      ...event,
      registrations: event.registrations || [],
      registrationCount:
        event.registrationCount ?? (event.registrations?.length || 0),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// DELETE EVENT
// ==========================
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "Published") {
      return res.status(400).json({
        message: "Cannot delete published event",
      });
    }

    await event.deleteOne();

    await createAuditLog(req.user.name, "Event", "Deleted Event");

    return res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET EVENT USERS
// ==========================
export const getEventUsers = async (req, res) => {
  try {
    const teams = await Team.find({
      event: req.params.id,
    }).populate("leader", "name role");

    const users = teams
      .filter((team) => team.leader)
      .map((team) => ({
        _id: team.leader._id,
        name: team.leader.name,
        role: team.leader.role,
      }));

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};