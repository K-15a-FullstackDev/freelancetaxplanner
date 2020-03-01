const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Basic payload validator (keeps 2020 MVP simple)
function validatePayload(body) {
  const errors = [];
  if (!["income", "expense"].includes(body.type))
    errors.push("type must be income|expense");
  if (body.amountINR == null || isNaN(Number(body.amountINR)))
    errors.push("amountINR must be a number");
  if (!body.category || typeof body.category !== "string")
    errors.push("category is required");
  return errors;
}

// CREATE
router.post("/", async (req, res) => {
  try {
    const errors = validatePayload(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const doc = await Transaction.create({
      type: req.body.type,
      amountINR: Number(req.body.amountINR),
      category: req.body.category.trim(),
      description: (req.body.description || "").trim(),
      date: req.body.date ? new Date(req.body.date) : new Date(),
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error("create failed", err);
    res.status(500).json({ error: "create failed" });
  }
});

// READ (all) — optional filters: ?from=YYYY-MM-DD&to=YYYY-MM-DD&type=income|expense
router.get("/", async (req, res) => {
  try {
    const q = {};
    if (req.query.type && ["income", "expense"].includes(req.query.type)) {
      q.type = req.query.type;
    }
    if (req.query.from || req.query.to) {
      q.date = {};
      if (req.query.from) q.date.$gte = new Date(req.query.from);
      if (req.query.to) q.date.$lte = new Date(req.query.to);
    }
    const docs = await Transaction.find(q).sort({ date: -1, _id: -1 });
    res.json(docs);
  } catch (err) {
    console.error("list failed", err);
    res.status(500).json({ error: "list failed" });
  }
});

// READ (one)
router.get("/:id", async (req, res) => {
  try {
    const doc = await Transaction.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (err) {
    console.error("get failed", err);
    res.status(500).json({ error: "get failed" });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const errors = validatePayload(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const update = {
      type: req.body.type,
      amountINR: Number(req.body.amountINR),
      category: req.body.category.trim(),
      description: (req.body.description || "").trim(),
    };
    if (req.body.date) update.date = new Date(req.body.date);

    const doc = await Transaction.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!doc) return res.status(404).json({ error: "not found" });
    res.json(doc);
  } catch (err) {
    console.error("update failed", err);
    res.status(500).json({ error: "update failed" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const del = await Transaction.findByIdAndDelete(req.params.id);
    if (!del) return res.status(404).json({ error: "not found" });
    res.status(204).end();
  } catch (err) {
    console.error("delete failed", err);
    res.status(500).json({ error: "delete failed" });
  }
});

module.exports = router;
