require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const transactionsRouter = require("./routes/transactions");
app.use("/transactions", transactionsRouter);

// health route
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// TODO: mount /transactions routes in Step 1
// const transactionsRouter = require('./routes/transactions');
// app.use('/transactions', transactionsRouter);

const PORT = process.env.PORT || 4002;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`FreelanceTaxPlanner API running on http://localhost:${PORT}`);
  });
});
