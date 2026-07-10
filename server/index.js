require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const googleAuthRoutes = require("./routes/googleAuth");
const researchRoutes = require("./routes/research");
const adminRoutes = require("./routes/admin");
const watchlistRoutes = require("./routes/watchlist");
const portfolioRoutes = require("./routes/portfolio");
const chatRoutes = require("./routes/chat");
const newsRoutes = require("./routes/news");
const companyComparisonRoutes = require("./routes/companyComparison");
const portfolioRecommendationRoutes = require("./routes/portfolioRecommendation");
const workflowRoutes = require("./routes/workflow");

const connectDB = require("./config/db");

const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-investment-agent-orpin.vercel.app"
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/google", googleAuthRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/compare", companyComparisonRoutes);
app.use("/api/portfolio-recommendation", portfolioRecommendationRoutes);
app.use("/api/workflow", workflowRoutes);

// Static uploads
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
    res.send("🚀 AI Investment Research Backend Running");
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
