const express = require("express");
const router = express.Router();
const Watchlist = require("../models/Watchlist");
const authMiddleware = require("../middleware/authMiddleware");

// Get all watchlisted companies for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const list = await Watchlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, watchlist: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add stock to watchlist
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { symbol, name } = req.body;
    if (!symbol || !name) {
      return res.status(400).json({ success: false, message: "Symbol and Name are required" });
    }

    // Check if duplicate
    const existing = await Watchlist.findOne({ user: req.user.id, symbol: symbol.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "Company is already in your watchlist" });
    }

    const item = await Watchlist.create({
      user: req.user.id,
      symbol: symbol.toUpperCase(),
      name,
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete stock from watchlist
router.delete("/:symbol", authMiddleware, async (req, res) => {
  try {
    const deleted = await Watchlist.findOneAndDelete({
      user: req.user.id,
      symbol: req.params.symbol.toUpperCase(),
    });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Stock not found in watchlist" });
    }

    res.json({ success: true, message: "Stock removed from watchlist successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
