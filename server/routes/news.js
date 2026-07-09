const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Mock Stock Market News with Sentiment analysis
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Generate dates relative to today
    const now = new Date();
    const formatOffset = (hoursOffset) => {
      const d = new Date(now.getTime() - hoursOffset * 60 * 60 * 1000);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const newsArticles = [
      {
        id: "1",
        title: "NVIDIA Unveils Next-Gen AI Blackwell Ultra Chips to High Demand",
        summary: "NVIDIA announced high production volumes for its new Blackwell Ultra GPUs. Leading cloud providers have booked capacity through late 2026, bolstering future revenue projections.",
        company: "NVDA",
        name: "NVIDIA Corporation",
        sentiment: "BULLISH",
        score: 95,
        source: "TechTech News",
        date: formatOffset(1),
        impact: "Highly positive for short-term margins and gross revenues.",
      },
      {
        id: "2",
        title: "Apple Explores Smart Home Robotics in New Consumer Tech Strategy",
        summary: "Following the wind-down of its electric vehicle program, Apple is shifting engineers to home robotics and AI products. Experts debate whether this segment can match phone margins.",
        company: "AAPL",
        name: "Apple Inc.",
        sentiment: "NEUTRAL",
        score: 55,
        source: "Bloomberg Market",
        date: formatOffset(3),
        impact: "Neutral. Represents a long-term R&D transition with execution risks.",
      },
      {
        id: "3",
        title: "Tesla Q2 Deliveries Beats Street Expectations; Production Ramps Up",
        summary: "Tesla reported electric vehicle delivery numbers that surpassed analyst estimates. Gigafactory Shanghai achieved record numbers, offsetting slower growth in Europe.",
        company: "TSLA",
        name: "Tesla, Inc.",
        sentiment: "BULLISH",
        score: 82,
        source: "EV Ledger",
        date: formatOffset(6),
        impact: "Positive sentiment recovery. Reassures investors about volume trajectory.",
      },
      {
        id: "4",
        title: "Microsoft Faces European Commission Antitrust Warnings over Teams Bundling",
        summary: "The European Union warned Microsoft that bundling Teams with Office 365 might breach competition regulations. A potential fine or restructure could be required.",
        company: "MSFT",
        name: "Microsoft Corporation",
        sentiment: "BEARISH",
        score: 30,
        source: "Regulatory Monitor",
        date: formatOffset(12),
        impact: "Slightly negative. Regulatory risks in Europe could lead to minor fines.",
      },
      {
        id: "5",
        title: "Amazon Web Services Commits $15B to Expand Data Centers in Japan",
        summary: "AWS announced massive capital expenditure plans to build out data center infrastructure in Tokyo and Osaka to support the expanding generative AI workloads of corporate clients.",
        company: "AMZN",
        name: "Amazon.com, Inc.",
        sentiment: "BULLISH",
        score: 88,
        source: "Cloud Weekly",
        date: formatOffset(18),
        impact: "Very positive. Solidifies dominant market share in cloud hosting.",
      },
      {
        id: "6",
        title: "Meta Stock Slips 3% Amid Regulatory Scrutiny Over Ad Tracking Systems",
        summary: "Meta Platforms shares fell slightly after the FTC announced updates to its investigation regarding social media advertising practices and teenage user safety protocols.",
        company: "META",
        name: "Meta Platforms, Inc.",
        sentiment: "BEARISH",
        score: 38,
        source: "Wall Street Journal",
        date: formatOffset(24),
        impact: "Slightly negative. Ad-tracking limits could lead to higher acquisition costs.",
      },
    ];

    res.json({ success: true, news: newsArticles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
