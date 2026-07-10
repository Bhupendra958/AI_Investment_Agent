const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");
const { GoogleGenAI } = require("@google/genai");

// Helper to initialize Gemini Chat
function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
}

// Get user chat history
router.get("/", authMiddleware, async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) {
      // Create empty chat
      chat = await Chat.create({
        user: req.user.id,
        messages: [
          {
            sender: "ai",
            text: "Hello! I am your AI Investment Assistant. Ask me anything about stock analysis, market trends, portfolio strategies, or risk assessment!",
            timestamp: new Date(),
          },
        ],
      });
    }
    res.json({ success: true, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Post a new chat message and get AI response
router.post("/message", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    let chat = await Chat.findOne({ user: req.user.id });
    if (!chat) {
      chat = new Chat({ user: req.user.id, messages: [] });
    }

    // Save user message
    chat.messages.push({
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    });

    let aiReply = "";

    try {
      const ai = getGeminiClient();
      
      // Build a prompt that context-sensitizes Gemini to act as an investment assistant
      const systemPrompt = `You are a professional, expert AI Financial & Investment Advisor. 
The user is asking: "${text.trim()}".
Provide an insightful, clear, and quantitative-minded response containing concrete details, advice on how to research companies, or educational details about financial metrics (like P/E ratio, ROE, margins).
Keep your formatting clean and professional using bullet points. Do not include random market disclaimers on every single line, keep the response under 300 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: systemPrompt,
      });
      aiReply = response.text;

    } catch (apiError) {
      console.log("Gemini Chat API Error, falling back to local analysis:", apiError.message);
      
      // Educational fallback responses for standard questions if API key fails or errors out
      const query = text.toLowerCase();
      if (query.includes("pe") || query.includes("p/e") || query.includes("valuation")) {
        aiReply = "The Price-to-Earnings (P/E) ratio compares a company's share price to its earnings per share (EPS). A high P/E ratio could mean that a stock's price is high relative to earnings and possibly overvalued, or it indicates investors expect high growth rates in the future. Generally, compare a company's P/E to peers in the same industry to determine relative value.";
      } else if (query.includes("risk") || query.includes("diversif")) {
        aiReply = "Diversification is a risk management strategy that mixes a wide variety of investments within a portfolio. The rationale behind this technique is that a portfolio constructed of different kinds of assets will, on average, yield higher long-term returns and lower the risk of any individual holding. Consider spreading investments across sectors (e.g., Tech, Healthcare, Energy).";
      } else if (query.includes("apple") || query.includes("aapl")) {
        aiReply = "Apple Inc. (AAPL) is characterized by robust profit margins, high consumer loyalty, a dominant ecosystem (iOS), and solid cash flow. However, risks include supply chain concentrations, antitrust regulations worldwide, and high dependence on iPhone cycles. Make sure to review their services segment growth.";
      } else {
        aiReply = "That is an excellent question! When evaluating this, consider checking the company's annual revenue growth, debt-to-equity ratio, and operating margin trends relative to its industry. A healthy balance sheet (low debt, high cash reserves) usually provides a buffer during market volatility.";
      }
    }

    // Save AI reply
    chat.messages.push({
      sender: "ai",
      text: aiReply.trim(),
      timestamp: new Date(),
    });

    await chat.save();
    res.json({ success: true, messages: chat.messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Clear chat history
router.post("/clear", authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });
    if (chat) {
      chat.messages = [
        {
          sender: "ai",
          text: "Chat cleared. Ask me anything about stock analysis, market trends, portfolio strategies, or risk assessment!",
          timestamp: new Date(),
        },
      ];
      await chat.save();
    }
    res.json({ success: true, messages: chat ? chat.messages : [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
