const express = require("express");
const router = express.Router();
const Portfolio = require("../models/Portfolio");
const authMiddleware = require("../middleware/authMiddleware");

// Helper to get or initialize a portfolio for a user
async function getOrCreatePortfolio(userId) {
  let portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) {
    portfolio = await Portfolio.create({
      user: userId,
      cash: 100000,
      holdings: [],
      transactions: [],
      valueHistory: [{ date: new Date(), totalValue: 100000 }],
    });
  }
  return portfolio;
}

// Get portfolio details
router.get("/", authMiddleware, async (req, res) => {
  try {
    const portfolio = await getOrCreatePortfolio(req.user.id);
    res.json({ success: true, portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Buy shares
router.post("/buy", authMiddleware, async (req, res) => {
  try {
    const { symbol, name, shares, price } = req.body;
    if (!symbol || !name || !shares || !price || shares <= 0 || price <= 0) {
      return res.status(400).json({ success: false, message: "Invalid purchase details" });
    }

    const portfolio = await getOrCreatePortfolio(req.user.id);
    const totalCost = shares * price;

    if (portfolio.cash < totalCost) {
      return res.status(400).json({ success: false, message: "Insufficient cash balance to purchase" });
    }

    // Deduct cash
    portfolio.cash -= totalCost;

    // Check if user already holds this stock
    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.symbol.toUpperCase() === symbol.toUpperCase()
    );

    if (holdingIndex >= 0) {
      // Average out the buy price: (total old value + cost) / total shares
      const existing = portfolio.holdings[holdingIndex];
      const totalShares = existing.shares + Number(shares);
      const avgPrice = ((existing.shares * existing.avgBuyPrice) + totalCost) / totalShares;
      
      existing.shares = totalShares;
      existing.avgBuyPrice = Number(avgPrice.toFixed(2));
    } else {
      // Add new holding
      portfolio.holdings.push({
        symbol: symbol.toUpperCase(),
        name,
        shares: Number(shares),
        avgBuyPrice: Number(price),
      });
    }

    // Add to transaction log
    portfolio.transactions.push({
      type: "BUY",
      symbol: symbol.toUpperCase(),
      shares: Number(shares),
      price: Number(price),
      date: new Date(),
    });

    // Update history tracker
    const currentHoldingsVal = portfolio.holdings.reduce((sum, h) => sum + h.shares * price, 0);
    const totalVal = portfolio.cash + currentHoldingsVal;
    portfolio.valueHistory.push({
      date: new Date(),
      totalValue: Number(totalVal.toFixed(2)),
    });

    await portfolio.save();
    res.json({ success: true, message: "Purchase completed", portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sell shares
router.post("/sell", authMiddleware, async (req, res) => {
  try {
    const { symbol, shares, price } = req.body;
    if (!symbol || !shares || !price || shares <= 0 || price <= 0) {
      return res.status(400).json({ success: false, message: "Invalid sale details" });
    }

    const portfolio = await getOrCreatePortfolio(req.user.id);

    const holdingIndex = portfolio.holdings.findIndex(
      (h) => h.symbol.toUpperCase() === symbol.toUpperCase()
    );

    if (holdingIndex === -1) {
      return res.status(400).json({ success: false, message: "You do not own this stock" });
    }

    const holding = portfolio.holdings[holdingIndex];
    if (holding.shares < shares) {
      return res.status(400).json({ success: false, message: `Insufficient shares. You only own ${holding.shares} shares.` });
    }

    // Update holdings
    holding.shares -= Number(shares);
    const proceeds = shares * price;
    portfolio.cash += proceeds;

    // Log transaction
    portfolio.transactions.push({
      type: "SELL",
      symbol: symbol.toUpperCase(),
      shares: Number(shares),
      price: Number(price),
      date: new Date(),
    });

    // Remove holding if shares hit 0
    if (holding.shares <= 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }

    // Update value history
    const currentHoldingsVal = portfolio.holdings.reduce((sum, h) => sum + h.shares * price, 0);
    const totalVal = portfolio.cash + currentHoldingsVal;
    portfolio.valueHistory.push({
      date: new Date(),
      totalValue: Number(totalVal.toFixed(2)),
    });

    await portfolio.save();
    res.json({ success: true, message: "Sale completed", portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reset portfolio
router.post("/reset", authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (portfolio) {
      portfolio.cash = 100000;
      portfolio.holdings = [];
      portfolio.transactions = [];
      portfolio.valueHistory = [{ date: new Date(), totalValue: 100000 }];
      await portfolio.save();
    }
    res.json({ success: true, message: "Portfolio reset completed", portfolio });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
