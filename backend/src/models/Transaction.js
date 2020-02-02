const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    amountINR: {
      type: Number,
      required: true,
      min: [0, "amount must be >= 0"],
    },
    category: {
      type: String,
      required: true, // e.g., 'food', 'travel', 'software', 'salary', 'freelance'
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now, // transaction date
    },
  },
  { timestamps: true }
);

// helpful index for monthly queries
TransactionSchema.index({ date: 1 });

module.exports = mongoose.model("Transaction", TransactionSchema);
