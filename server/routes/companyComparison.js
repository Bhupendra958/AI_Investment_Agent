const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Mock comparison data for two symbols
router.get('/:symbol1/:symbol2', authMiddleware, (req, res) => {
  const { symbol1, symbol2 } = req.params;
  const data = {
    symbol1: symbol1.toUpperCase(),
    symbol2: symbol2.toUpperCase(),
    comparison: {
      marketCap: {
        [symbol1.toUpperCase()]: Math.round(Math.random() * 500) + 50,
        [symbol2.toUpperCase()]: Math.round(Math.random() * 500) + 50,
      },
      price: {
        [symbol1.toUpperCase()]: (Math.random() * 200).toFixed(2),
        [symbol2.toUpperCase()]: (Math.random() * 200).toFixed(2),
      },
      rating: {
        [symbol1.toUpperCase()]: Math.round(Math.random() * 5) + 1,
        [symbol2.toUpperCase()]: Math.round(Math.random() * 5) + 1,
      },
    },
    generatedAt: new Date(),
  };
  res.json({ success: true, data });
});

module.exports = router;
