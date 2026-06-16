import express from "express";

import {
createEvent,
getEvents,
getEventById,
updateEvent,
deleteEvent,
sendForApproval,
publishEvent,
} from "../controllers/eventController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../utils/upload.js";

const router = express.Router();

// ==========================
// GET ALL EVENTS
// ==========================
router.get("/", getEvents);

// ==========================
// GET SINGLE EVENT
// ==========================
router.get("/:id", getEventById);

// ==========================
// CREATE EVENT
// ==========================
router.post(
"/",
protect,
upload.single("poster"),
createEvent
);

// ==========================
// UPDATE EVENT
// ==========================
router.put(
"/:id",
protect,
upload.single("poster"),
updateEvent
);

// ==========================
// DELETE EVENT
// ==========================
router.delete(
"/:id",
protect,
deleteEvent
);

// ==========================
// SEND EVENT FOR APPROVAL
// ==========================
router.put(
"/approval/:id",
protect,
sendForApproval
);

// ==========================
// PUBLISH EVENT
// ==========================
router.put(
"/publish/:id",
protect,
publishEvent
);

export default router;
