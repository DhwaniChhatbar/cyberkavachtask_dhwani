import Certificate from "../models/Certificate.js";
import Points from "../models/Points.js";
import User from "../models/User.js";
import crypto from "crypto";
import { generateCertificateId } from "../utils/generateCertificateId.js";

// ==========================
// GENERATE CERTIFICATE
// ==========================
export const generateCertificate = async (req, res) => {
  try {
    const { eventName, user, team } = req.body; // 🔥 ADDED TEAM SUPPORT (safe)

    if (!eventName || (!user && !team)) {
      return res.status(400).json({
        success: false,
        message: "eventName and user/team are required",
      });
    }

    let existingUser = null;

    if (user) {
      existingUser = await User.findById(user);

      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // eligibility check only for individual users
      const pointsData = await Points.aggregate([
        { $match: { user: existingUser._id } },
        {
          $group: {
            _id: "$user",
            totalPoints: { $sum: "$points" },
          },
        },
      ]);

      const totalPoints = pointsData[0]?.totalPoints || 0;

      if (totalPoints <= 0) {
        return res.status(400).json({
          success: false,
          message: "User is not eligible for certificate",
        });
      }
    }

    const certificateId = await generateCertificateId();

    const hash = crypto
      .createHash("sha256")
      .update(
        certificateId +
          (user || team) +
          eventName.trim()
      )
      .digest("hex");

    const certificate = await Certificate.create({
      certificateId,
      eventName: eventName.trim(),
      user: user || null,
      team: team || null, // 🔥 IMPORTANT FIX
      issuedBy: req.user?.id || null,
      hash,
    });

    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate("user", "name email role")
      .populate("team", "name members")
      .populate("issuedBy", "name email");

    return res.status(201).json({
      success: true,
      certificate: {
        ...populatedCertificate.toObject(),
        displayName:
          populatedCertificate.user?.name ||
          populatedCertificate.team?.name ||
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
      .populate("team", "name members") // 🔥 ADDED
      .populate("issuedBy", "name email")
      .sort({ createdAt: -1 });

    const normalized = certificates.map((c) => ({
      ...c.toObject(),
      displayName:
        c.user?.name ||
        c.team?.name ||
        "Unknown Participant",
    }));

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

    const certificate = await Certificate.findOne({ certificateId })
      .populate("user", "name email role")
      .populate("team", "name members") // 🔥 ADDED
      .populate("issuedBy", "name email");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const normalized = {
      ...certificate.toObject(),
      displayName:
        certificate.user?.name ||
        certificate.team?.name ||
        "Unknown Participant",
    };

    return res.status(200).json({
      success: true,
      verified: true,
      certificate: normalized,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};