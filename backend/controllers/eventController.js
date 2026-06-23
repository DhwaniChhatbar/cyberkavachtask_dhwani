import Event from "../models/Event.js";

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
      createdBy: req.user.id,
      poster: req.file ? req.file.filename : "",
      status: "Draft",
      registrationCount: 0,
      certificatesEnabled: false,
      registrationLink: "",
      approvalStage: "NONE",
    });

    return res.status(201).json(event);
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
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.status !== "Draft") {
      return res.status(400).json({
        message: "Only Draft events can be sent for approval",
      });
    }

    event.status = "Pending Faculty Review";
    event.approvalStage = "FACULTY_REVIEW";

    await event.save();

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
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.status !== "Pending Faculty Review") {
      return res.status(400).json({
        message: "Event not in faculty review stage",
      });
    }

    event.status = "Faculty Approved";
    event.approvedBy = req.user.id;
    event.approvalStage = "STUDENT_PUBLISH";

    await event.save();

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
    if (!event) return res.status(404).json({ message: "Event not found" });

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
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (
      event.status === "Faculty Approved" ||
      event.status === "Published"
    ) {
      return res.status(400).json({
        message: "Cannot edit after approval stage",
      });
    }

    Object.assign(event, req.body);

    if (req.file) {
      event.poster = req.file.filename;
    }

    await event.save();

    return res.json({
      success: true,
      event,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// GET EVENTS (ROLE BASED)
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
      .sort({ createdAt: -1 });

    return res.json(events);
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
        $in: ["Draft", "Pending Faculty Review", "Faculty Approved"],
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
      .populate("publishedBy", "name");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.json(event);
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
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.status === "Published") {
      return res.status(400).json({
        message: "Cannot delete published event",
      });
    }

    await event.deleteOne();

    return res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};