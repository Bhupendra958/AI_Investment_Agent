const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Research = require("../models/Research");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================================
// GET - Admin Stats & Analytics
// ==========================================
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSearches = await Research.countDocuments();

    // Average confidence aggregation
    const confidenceAgg = await Research.aggregate([
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: "$confidence" },
        },
      },
    ]);
    const averageConfidence = confidenceAgg.length > 0 ? Math.round(confidenceAgg[0].avgConfidence) : 0;

    // Popular companies (top 10) aggregation
    const popularCompanies = await Research.aggregate([
      {
        $group: {
          _id: "$company",
          count: { $sum: 1 },
          avgConfidence: { $avg: "$confidence" },
          investCount: {
            $sum: { $cond: [{ $eq: ["$decision", "INVEST"] }, 1, 0] },
          },
          passCount: {
            $sum: { $cond: [{ $eq: ["$decision", "PASS"] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          company: "$_id",
          count: 1,
          avgConfidence: { $round: ["$avgConfidence", 1] },
          investCount: 1,
          passCount: 1,
          _id: 0,
        },
      },
    ]);

    // Recent user signups (last 5)
    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent research runs (last 5)
    const recentSearches = await Research.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalSearches,
        averageConfidence,
        popularCompanies,
        recentUsers,
        recentSearches,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch administrative stats",
      error: error.message,
    });
  }
});

module.exports = router;
