import Badge from "../models/Badge.js";
import UserBadge from "../models/UserBadge.js";
import Points from "../models/Points.js";

/**
 * MODULE 5 - BADGE ENGINE
 * Evaluates and awards badges based on total points
 */
export const evaluateBadgesForUser = async (userId, eventId = null) => {
  try {
    if (!userId) return;

    console.log("🏅 Badge engine started");

    // =========================
    // TOTAL POINTS CALCULATION
    // =========================
    const result = await Points.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    const totalPoints = result[0]?.totalPoints || 0;

    console.log("⭐ Total points:", totalPoints);

    // =========================
    // GET ACTIVE BADGES
    // =========================
    const badges = await Badge.find({ active: true }).sort({
      minPoints: 1,
    });

    console.log("🎖 Badges found:", badges.length);

    // =========================
    // UNLOCK BADGES
    // =========================
    for (const badge of badges) {
      console.log(
        "Checking:",
        badge.name,
        "Required:",
        badge.minPoints
      );

      if (totalPoints < badge.minPoints) continue;

      const existingBadge = await UserBadge.findOne({
        user: userId,
        badge: badge._id,
      });

      if (existingBadge) {
        console.log("Already has badge:", badge.name);
        continue;
      }

      await UserBadge.create({
        user: userId,
        badge: badge._id,
        event: eventId,
        category: badge.category,
        remarks: `${badge.name} unlocked`,
      });

      console.log(
        `🏅 Badge unlocked: ${badge.name} for user ${userId}`
      );
    }
  } catch (error) {
    console.error("❌ Badge Engine Error:");
    console.error(error);
  }
};

/**
 * GET CURRENT BADGE
 */
export const getCurrentBadgeForUser = async (userId) => {
  try {
    const userBadge = await UserBadge.findOne({
      user: userId,
    })
      .populate("badge")
      .sort({ createdAt: -1 });

    return userBadge?.badge || null;
  } catch (error) {
    console.error("❌ Get Badge Error:", error.message);
    return null;
  }
};