import Certificate from "../models/Certificate.js";

// ==========================
// 🔥 GENERATE CERTIFICATE
// ==========================
export const generateCertificate = async (req, res) => {
  try {
    const { eventName, user } = req.body;

    // Validation
    if (!eventName || !user) {
      return res.status(400).json({
        message: "eventName and user are required",
      });
    }

    const certificate = await Certificate.create({
      eventName: eventName.trim(),
      user,
      issuedBy: req.user.id,

      // More unique ID (avoid duplicates in production)
      certificateId: `CERT-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`,
    });

    res.status(201).json({
      success: true,
      certificate,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// 🔥 GET ALL CERTIFICATES
// ==========================
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("user")
      .populate("issuedBy")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================
// 🔥 VERIFY CERTIFICATE
// ==========================
export const verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        message: "Certificate ID is required",
      });
    }

    const certificate = await Certificate.findOne({
      certificateId,
    })
      .populate("user")
      .populate("issuedBy");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.json({
      success: true,
      certificate,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};