import Badge from "../models/Badge.js";
import UserBadge from "../models/UserBadge.js";
import Points from "../models/Points.js";

/**
 * MODULE 5 - BADGE ENGINE
 * Evaluates and awards badges based on total points
 */
export const evaluateBadgesForUser = async (
  userId,
  eventId = null
) => {
  try {
    if (!userId) return;

    // Calculate total points
    const result = await Points.aggregate([
      {
        $match: {
          user: userId,
        },
      },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    const totalPoints = result[0]?.totalPoints || 0;

    // Active badges ordered by minPoints
    const badges = await Badge.find({ active: true }).sort({
      minPoints: 1,
    });

    for (const badge of badges) {
      if (totalPoints < badge.minPoints) continue;

      const existingBadge = await UserBadge.findOne({
        user: userId,
        badge: badge._id,
      });

      if (existingBadge) continue;

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
    console.error("❌ Badge Engine Error:", error.message);
  }
};