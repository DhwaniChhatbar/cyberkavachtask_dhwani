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
    const { eventName, user } = req.body;

    if (!eventName || !user) {
      return res.status(400).json({
        success: false,
        message: "eventName and user are required",
      });
    }

    const existingUser = await User.findById(user);

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

    const pointsData = await Points.aggregate([
      {
        $match: { user: existingUser._id },
      },
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

    const certificateId = generateCertificateId();

    const hash = crypto
      .createHash("sha256")
      .update(
        certificateId +
          existingUser._id.toString() +
          eventName.trim()
      )
      .digest("hex");

    const certificate = await Certificate.create({
      certificateId,
      eventName: eventName.trim(),
      user: existingUser._id,
      issuedBy: req.user?.id || null,
      hash,
    });

    // 🔥 MINIMAL FIX: return populated-like structure immediately
    const populatedCertificate = await Certificate.findById(certificate._id)
      .populate("user", "name email role")
      .populate("issuedBy", "name email");

    return res.status(201).json({
      success: true,
      certificate: populatedCertificate,
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
      .populate("user", "name email role") // 🔥 minimal improvement
      .populate("issuedBy", "name email")  // 🔥 minimal improvement
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
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
      .populate("user", "name email role") // 🔥 ensure consistent UI
      .populate("issuedBy", "name email");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      certificate,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};