const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

/**
 * GET /analytics/monthly?year=2020&month=3
 * month: 1-12
 * Returns: { year, month, incomeINR, expenseINR, profitINR }
 */
router.get("/monthly", async (req, res) => {
  try {
    const year = Number(req.query.year);
    const month = Number(req.query.month); // 1-12
    if (!year || !month || month < 1 || month > 12) {
      return res
        .status(400)
        .json({ error: "year and month (1-12) are required" });
    }

    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59)); // last day of month

    const docs = await Transaction.find({
      date: { $gte: start, $lte: end },
    });

    const totals = docs.reduce(
      (acc, t) => {
        if (t.type === "income") acc.incomeINR += t.amountINR;
        if (t.type === "expense") acc.expenseINR += t.amountINR;
        return acc;
      },
      { incomeINR: 0, expenseINR: 0 }
    );

    const profitINR = totals.incomeINR - totals.expenseINR;

    res.json({
      year,
      month,
      incomeINR: totals.incomeINR,
      expenseINR: totals.expenseINR,
      profitINR,
    });
  } catch (err) {
    console.error("monthly analytics failed", err);
    res.status(500).json({ error: "monthly analytics failed" });
  }
});

router.get("/yearly", async (req, res) => {
  try {
    const year = Number(req.query.year);
    if (!year) return res.status(400).json({ error: "year is required" });

    const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
    const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

    const docs = await Transaction.find({
      date: { $gte: start, $lte: end },
    });

    const totals = docs.reduce(
      (acc, t) => {
        if (t.type === "income") acc.incomeINR += t.amountINR;
        if (t.type === "expense") acc.expenseINR += t.amountINR;
        return acc;
      },
      { incomeINR: 0, expenseINR: 0 }
    );

    const profitINR = totals.incomeINR - totals.expenseINR;
    const taxRatePercent = Number(process.env.TAX_RATE_PERCENT || 10);
    const estimatedTaxINR =
      profitINR > 0 ? Math.round((profitINR * taxRatePercent) / 100) : 0;

    res.json({
      year,
      incomeINR: totals.incomeINR,
      expenseINR: totals.expenseINR,
      profitINR,
      taxRatePercent,
      estimatedTaxINR,
    });
  } catch (err) {
    console.error("yearly analytics failed", err);
    res.status(500).json({ error: "yearly analytics failed" });
  }
});

module.exports = router;
