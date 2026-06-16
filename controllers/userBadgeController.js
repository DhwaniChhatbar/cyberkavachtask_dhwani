import UserBadge from "../models/UserBadge.js";

// ======================
// GET BADGES OF LOGGED-IN USER
// ======================
export const getMyBadges = async (req, res) => {
  try {
    const badges = await UserBadge.find({
      user: req.user.id,
    })
      .populate("badge")
      .populate("event", "name")
      .sort({
        awardedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: badges.length,
      badges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET BADGES OF ANY USER
// ======================
export const getUserBadges = async (req, res) => {
  try {
    const badges = await UserBadge.find({
      user: req.params.userId,
    })
      .populate("badge")
      .populate("event", "name")
      .sort({
        awardedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: badges.length,
      badges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET ALL USER BADGES
// ======================
export const getAllUserBadges = async (req, res) => {
  try {
    const badges = await UserBadge.find()
      .populate("user", "name email role")
      .populate("badge")
      .populate("event", "name")
      .sort({
        awardedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: badges.length,
      badges,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};