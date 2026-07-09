const mongoose = require("mongoose");

const researchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    decision: {
      type: String,
      enum: ["INVEST", "PASS"],
      required: true,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    reason: {
      type: String,
      required: true,
    },

    summary: {
      type: String,
      required: true,
    },

    factors: [
      {
        type: String,
      },
    ],

    modelUsed: {
      type: String,
      default: "gemini-2.5-flash",
    },

    searchTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Research", researchSchema);