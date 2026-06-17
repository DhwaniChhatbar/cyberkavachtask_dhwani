import Points from "../models/Points.js";
import User from "../models/User.js";
import UserBadge from "../models/UserBadge.js";

export const getLeaderboard = async (req, res) => {
  try {
    // Aggregate points per user
    const leaderboard = await Points.aggregate([
      {
        $group: {
          _id: "$user",
          totalPoints: {
            $sum: "$points",
          },
          contributions: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalPoints: -1,
        },
      },
    ]);

    if (!leaderboard.length) {
      return res.status(200).json([]);
    }

    // User IDs
    const userIds = leaderboard.map((item) => item._id);

    // Fetch user details
    const users = await User.find({
      _id: { $in: userIds },
    }).select("name email role");

    // Fetch badges
    const badges = await UserBadge.find({
      user: { $in: userIds },
    }).populate("badge");

    // Create user lookup
    const userMap = {};

    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    // Create badge lookup (latest badge)
    const badgeMap = {};

    badges.forEach((item) => {
      const userId = item.user.toString();

      if (
        !badgeMap[userId] ||
        item.awardedAt > badgeMap[userId].awardedAt
      ) {
        badgeMap[userId] = item;
      }
    });

    // Build leaderboard response
    const result = leaderboard.map((item, index) => {
      const userId = item._id.toString();

      return {
        rank: index + 1,

        user:
          userMap[userId] || {
            name: "Unknown User",
            email: "",
            role: "unknown",
          },

        totalPoints: item.totalPoints,

        contributions: item.contributions,

        badge: badgeMap[userId]?.badge || null,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Leaderboard error",
      error: error.message,
    });
  }
};