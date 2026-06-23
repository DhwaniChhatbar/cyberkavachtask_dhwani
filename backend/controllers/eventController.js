import Event from "../models/Event.js";

// ==========================
// CREATE EVENT (TECH ONLY)
// ==========================
export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== "Tech Coordinator") {
      return res.status(403).json({
        message: "Only Tech Coordinator can create events",
      });
    }

    const existingEvent = await Event.findOne({
      name: req.body.name,
      date: req.body.date,
    });

    if (existingEvent) {
      return res.status(400).json({
        message: "Event already exists",
      });
    }

    const event = await Event.create({
      ...req.body,
      createdBy: req.user.id,
      poster: req.file ? req.file.filename : "",
      status: "Draft",
      registrationCount: 0,
      certificatesEnabled: false,
      registrationLink: "",
    });

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// SEND FOR APPROVAL
// ==========================
export const sendForApproval = async (req, res) => {
  try {
    if (req.user.role !== "Tech Coordinator") {
      return res.status(403).json({
        message: "Only Tech Coordinator can send events for approval",
      });
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

    await event.save();

    return res.json({
      success: true,
      message: "Event sent to Faculty Coordinator",
      event,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// APPROVE EVENT
// ==========================
export const approveEvent = async (req, res) => {
  try {
    if (req.user.role !== "Faculty Coordinator") {
      return res.status(403).json({
        message: "Only Faculty Coordinator can approve events",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "Pending Faculty Review") {
      return res.status(400).json({
        message: "Event must be pending faculty review",
      });
    }

    event.status = "Approved by Faculty";
    event.approvedBy = req.user.id;

    await event.save();

    return res.json({
      success: true,
      message: "Event approved by Faculty",
      event,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// ==========================
// PUBLISH EVENT
// ==========================
export const publishEvent = async (req, res) => {
  try {
    if (req.user.role !== "Student Coordinator") {
      return res.status(403).json({
        message: "Only Student Coordinator can publish events",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status !== "Approved by Faculty") {
      return res.status(400).json({
        message: "Event must be approved by Faculty first",
      });
    }

    event.status = "Published";
    event.publishDate = new Date();
    event.certificatesEnabled = true;
    event.publishedBy = req.user.id;

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

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.status === "Approved by Faculty" ||
      event.status === "Published"
    ) {
      return res.status(400).json({
        message: "Cannot edit event after approval stage",
      });
    }

    Object.assign(event, req.body);

    if (req.file) {
      event.poster = req.file.filename;
    }

    await event.save();

    return res.json(event);
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

    if (
      req.user.role === "Member" ||
      req.user.role === "Content Coordinator" ||
      req.user.role === "Social Media Coordinator"
    ) {
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
      status: { $ne: "Published" },
    })
      .populate("createdBy", "name email")
      .populate("approvedBy", "name")
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
      return res.status(404).json({
        message: "Event not found",
      });
    }

    return res.json(event);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// DELETE EVENT
// ==========================
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.status === "Published") {
      return res.status(400).json({
        message: "Cannot delete published event",
      });
    }

    await event.deleteOne();

    return res.json({
      message: "Event deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

// ==========================
// COMPLETE EVENT
// ==========================
export const completeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    event.isCompleted = true;

    await event.save();

    return res.json({
      success: true,
      message: "Event marked as completed",
      event,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};