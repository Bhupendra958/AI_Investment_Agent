const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Portfolio = require('../models/Portfolio');

// Simple mock recommendation based on cash balance
router.get('/recommendation', authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user.id });
    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'Portfolio not found' });
    }
    // Mock logic: if cash > 50000 suggest buying a random high‑growth stock
    const recommendation = portfolio.cash > 50000
      ? { action: 'BUY', symbol: 'AAPL', reason: 'Strong cash position' }
      : { action: 'HOLD', reason: 'Maintain current holdings' };
    res.json({ success: true, recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
