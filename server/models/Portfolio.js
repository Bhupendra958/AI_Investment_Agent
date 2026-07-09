const mongoose = require("mongoose");

const holdingSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  shares: {
    type: Number,
    required: true,
    min: 0,
  },
  avgBuyPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["BUY", "SELL"],
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  shares: {
    type: Number,
    required: true,
    min: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    cash: {
      type: Number,
      default: 100000, // Starts with $100k virtual cash
    },
    holdings: [holdingSchema],
    transactions: [transactionSchema],
    valueHistory: [
      {
        date: {
          type: Date,
          default: Date.now,
        },
        totalValue: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
