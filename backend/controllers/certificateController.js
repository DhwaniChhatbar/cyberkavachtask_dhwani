import Certificate from "../models/Certificate.js";
import User from "../models/User.js";
import Team from "../models/Team.js";
import crypto from "crypto";
import { generateCertificateId } from "../utils/generateCertificateId.js";
import { createAuditLog } from "./auditLogController.js";

// ==========================
// GENERATE CERTIFICATE
// ==========================
export const generateCertificate = async (req, res) => {
  try {
    const { eventName, user, team } = req.body;

    if (!eventName || (!user && !team)) {
      return res.status(400).json({
        success: false,
        message: "eventName and user/team are required",
      });
    }

    let existingUser = null;
    let existingTeam = null;

    // ==========================
    // USER CERTIFICATE
    // ==========================
    if (user) {
      existingUser = await User.findById(user);

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const existingCertificate = await Certificate.findOne({
        user: existingUser._id,
        eventName: eventName.trim(),
      });

      if (existingCertificate) {
        return res.status(400).json({
          success: false,
          message: "Certificate already exists",
        });
      }
    }

    // ==========================
    // TEAM CERTIFICATE
    // ==========================
    if (team) {
      existingTeam = await Team.findById(team);

      if (!existingTeam) {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }

      const existingCertificate = await Certificate.findOne({
        team: existingTeam._id,
        eventName: eventName.trim(),
      });

      if (existingCertificate) {
        return res.status(400).json({
          success: false,
          message: "Certificate already exists",
        });
      }
    }

    const certificateId = await generateCertificateId();

    const hash = crypto
      .createHash("sha256")
      .update(certificateId + (user || team) + eventName.trim())
      .digest("hex");

    const certificate = await Certificate.create({
      certificateId,
      eventName: eventName.trim(),
      user: user || null,
      team: team || null,
      issuedBy: req.user.id,
      hash,
    });

    // ✅ AUDIT LOG ADDED
    await createAuditLog(
      req.user.name,
      "Certificate",
      `Generated certificate for ${eventName}`
    );

    const populatedCertificate = await Certificate.findById(
      certificate._id
    )
      .populate("user", "name email role")
      .populate("team")
      .populate("issuedBy", "name email");

    return res.status(201).json({
      success: true,
      certificate: {
        ...populatedCertificate.toObject(),
        displayName:
          populatedCertificate.user?.name ||
          populatedCertificate.team?.teamName ||
          "Unknown Participant",
      },
    });
  } catch (err) {
    console.error("CERTIFICATE ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// GET ALL CERTIFICATES
// ==========================
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("user", "name email role")
      .populate("team")
      .populate("issuedBy", "name email")
      .sort({ createdAt: -1 });

    const normalized = certificates.map((c) => ({
      ...c.toObject(),
      displayName:
        c.user?.name || c.team?.teamName || "Unknown Participant",
    }));

    // ✅ AUDIT LOG ADDED
    await createAuditLog(
      req.user.name,
      "Certificate",
      "Viewed all certificates"
    );

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates: normalized,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// VERIFY CERTIFICATE
// ==========================
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: "Certificate ID is required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId,
    })
      .populate("user", "name email role")
      .populate("team")
      .populate("issuedBy", "name email");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    // ✅ AUDIT LOG ADDED
    await createAuditLog(
      req.user?.name || "Public",
      "Certificate",
      `Verified certificate ${certificateId}`
    );

    return res.status(200).json({
      success: true,
      verified: true,
      certificate: {
        ...certificate.toObject(),
        displayName:
          certificate.user?.name ||
          certificate.team?.teamName ||
          "Unknown Participant",
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};