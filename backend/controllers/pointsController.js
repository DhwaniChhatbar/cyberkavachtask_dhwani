import Points from "../models/Points.js";
import User from "../models/User.js";

export const assignPoints = async (req, res) => {
  try {
    const { userName, points, category, remarks } = req.body;

    if (!userName || !points) {
      return res.status(400).json({
        message: "userName and points are required",
      });
    }

    // find user
    const user = await User.findOne({ name: userName });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 FIX: MUST ADD assignedBy
    const newPoint = await Points.create({
      user: user._id,
      points: Number(points),
      category,
      remarks,

      assignedBy: req.user?.id, // ✅ REQUIRED FIX
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