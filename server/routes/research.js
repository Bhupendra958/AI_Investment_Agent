const express = require("express");
const router = express.Router();

const analyzeCompany = require("../services/geminiService");
const authMiddleware = require("../middleware/authMiddleware");
const Research = require("../models/Research");

// ================================
// POST - Research a Company
// ================================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { company } = req.body;

    if (!company || company.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const result = await analyzeCompany(company.trim());

    // Save research to MongoDB
    const savedResearch = await Research.create({
      user: req.user.id,
      company: result.company,
      decision: result.decision,
      confidence: result.confidence,
      reason: result.reason,
      summary: result.summary,
      factors: result.factors,
      modelUsed: result.modelUsed,
      searchTime: result.searchTime,
    });

    res.status(200).json({
      success: true,
      message: "Research Completed",
      data: savedResearch,
      ...result,
    });

  } catch (error) {
    console.log("Research Error:", error);

    const isRateLimitError =
      error.status === 429 ||
      error.code === "RATE_LIMIT" ||
      error.name === "RateLimitQuotaExhaustedError";

    const isConfigError = error.code === "GEMINI_API_KEY_INVALID";

    res.status(isRateLimitError ? 429 : isConfigError ? 500 : 502).json({
      success: false,
      message: isRateLimitError
        ? "Gemini API quota exceeded. Please wait for your quota to reset or use an API key with more quota."
        : isConfigError
          ? error.message
          : "AI Research Failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});


// ================================
// GET All Research History
// ================================

router.get("/", authMiddleware, async (req, res) => {

  try {

    const history = await Research.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: history.length,
      history,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch history",
    });

  }

});


// ================================
// GET Single Research
// ================================

router.get("/:id", authMiddleware, async (req, res) => {

  try {

    const research = await Research.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!research) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.json({
      success: true,
      research,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});


// ================================
// DELETE Research
// ================================

router.delete("/:id", authMiddleware, async (req, res) => {

  try {

    const deleted = await Research.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Research not found",
      });
    }

    res.json({
      success: true,
      message: "Research deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

});

module.exports = router;
