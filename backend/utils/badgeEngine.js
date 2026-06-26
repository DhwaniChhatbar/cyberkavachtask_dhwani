import mongoose from "mongoose";
import Badge from "../models/Badge.js";
import UserBadge from "../models/UserBadge.js";
import Points from "../models/Points.js";

/**
 * MODULE 5 - BADGE ENGINE
 */
export const evaluateBadgesForUser = async (userId, eventId = null) => {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // =========================
    // TOTAL POINTS CALCULATION
    // =========================
    const result = await Points.aggregate([
      { $match: { user: userObjectId } },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$points" },
        },
      },
    ]);

    const totalPoints = result?.[0]?.totalPoints || 0;

    // =========================
    // GET ACTIVE BADGES
    // =========================
    const badges = await Badge.find({ active: true }).sort({
      minPoints: 1,
    });

    // =========================
    // UNLOCK BADGES
    // =========================
    for (const badge of badges) {
      if (totalPoints < badge.minPoints) continue;

      const existingBadge = await UserBadge.findOne({
        user: userObjectId,
        badge: badge._id,
      });

      if (existingBadge) continue;

      // atomic safety check (prevents race duplicates)
      await UserBadge.updateOne(
        { user: userObjectId, badge: badge._id },
        {
          $setOnInsert: {
            user: userObjectId,
            badge: badge._id,
            event: eventId,
            category: badge.category,
            remarks: `${badge.name} unlocked`,
          },
        },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("❌ Badge Engine Error:", error.message);
  }
};

/**
 * GET CURRENT BADGE
 */
export const getCurrentBadgeForUser = async (userId) => {
  try {
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) return null;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userBadge = await UserBadge.findOne({
      user: userObjectId,
    })
      .populate("badge")
      .sort({ createdAt: -1 });

    return userBadge?.badge || null;
  } catch (error) {
    console.error("❌ Get Badge Error:", error.message);
    return null;
  }
};