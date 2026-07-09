const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Simple static workflow steps
router.get('/', authMiddleware, (req, res) => {
  const steps = [
    'Gather company data',
    'Run AI analysis',
    'Generate investment decision',
    'Store research record',
    'Provide recommendation',
  ];
  res.json({ success: true, workflow: steps });
});

module.exports = router;
