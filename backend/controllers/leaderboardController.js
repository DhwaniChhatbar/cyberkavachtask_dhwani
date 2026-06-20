import Points from "../models/Points.js";
import User from "../models/User.js";
import UserBadge from "../models/UserBadge.js";

export const getLeaderboard = async (req, res) => {
  try {
    // 1. Aggregate points per user
    const leaderboard = await Points.aggregate([
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$points" },
          contributions: { $sum: 1 },
        },
      },
      { $sort: { totalPoints: -1 } },
    ]);

    // Return empty array if no points exist
    if (!leaderboard || leaderboard.length === 0) {
      return res.status(200).json([]);
    }

    const userIds = leaderboard.map((item) => item._id);

    // 2. Fetch users
    const users = await User.find({
      _id: { $in: userIds },
    }).select("name email role");

    // 3. Fetch badges
    const badges = await UserBadge.find({
      user: { $in: userIds },
    }).populate("badge");

    // ===== DEBUG =====
    console.log("========== BADGES ==========");
    console.log(JSON.stringify(badges, null, 2));

    badges.forEach((item) => {
      console.log(
        "USER:",
        item.user.toString(),
        "BADGE:",
        item.badge?.name
      );
    });
    // =================

    // 4. Map users
    const userMap = {};

    users.forEach((user) => {
      userMap[user._id.toString()] = user;
    });

    // 5. Map latest badge
    const badgeMap = {};

    badges.forEach((item) => {
      const userId = item.user.toString();

      if (
        !badgeMap[userId] ||
        new Date(item.awardedAt) >
          new Date(badgeMap[userId].awardedAt)
      ) {
        badgeMap[userId] = item;
      }
    });

    // 6. Build response
    const result = leaderboard.map((item, index) => {
      const userId = item._id.toString();
      const user = userMap[userId];

      return {
        rank: index + 1,

        user: user
          ? {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          : {
              id: null,
              name: "Unknown User",
              email: "",
              role: "unknown",
            },

        totalPoints: item.totalPoints || 0,
        contributions: item.contributions || 0,

        badge: badgeMap[userId]?.badge || null,
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Leaderboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Leaderboard error",
      error: error.message,
    });
  }
};