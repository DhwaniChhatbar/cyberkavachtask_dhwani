import User from "../models/User.js";

// 🔍 SEARCH USERS (for team member adding)
export const searchUsers = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { studentId: { $regex: query, $options: "i" } },
      ],
    }).select("name email studentId role");

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👤 GET ALL USERS (optional admin/debug use)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email studentId role")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👤 GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email studentId role"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};