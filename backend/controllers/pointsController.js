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
        message: "userName and points are required",
      });
    }

    const user = await User.findOne({ name: userName });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

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
    return res.status(500).json({
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

    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};