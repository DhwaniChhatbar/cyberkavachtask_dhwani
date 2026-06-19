import Points from "../models/Points.js";
import User from "../models/User.js";

// =======================
// ASSIGN POINTS
// =======================
export const assignPoints = async (req, res) => {
  try {
    const { userName, points, category, remarks } = req.body;

    if (!userName || !points) {
      return res.status(400).json({
        success: false,
        message: "userName and points are required",
      });
    }

    // Find user
    const user = await User.findOne({ name: userName });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create new points entry
    const newPoint = await Points.create({
      user: user._id,
      points: Number(points),
      category,
      remarks,
      assignedBy: req.user?.id,
    });

    return res.status(201).json({
      success: true,
      message: "Points added successfully",
      data: newPoint,
    });
  } catch (err) {
    // 🔥 VERY IMPORTANT
    console.error("=================================");
    console.error("ASSIGN POINTS ERROR");
    console.error(err);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// GET POINTS HISTORY
// =======================
export const getPointsHistory = async (req, res) => {
  try {
    const history = await Points.find()
      .populate("user", "name")
      .populate("assignedBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    console.error("GET HISTORY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};