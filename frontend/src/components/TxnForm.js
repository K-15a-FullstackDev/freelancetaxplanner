import React, { useState } from "react";
import { createTransaction } from "../services/transactions";

export default function TxnForm({ onCreated }) {
  const [form, setForm] = useState({
    type: "expense",
    amountINR: "",
    category: "",
    description: "",
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
  });
  const [saving, setSaving] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createTransaction({
        ...form,
        amountINR: Number(form.amountINR),
      });
      setForm({
        type: "expense",
        amountINR: "",
        category: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
      });
      onCreated && onCreated();
    } catch (err) {
      console.error(err);
      alert("Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "grid", gap: 8, marginBottom: 16 }}
    >
      <label>
        Type:
        <select name="type" value={form.type} onChange={onChange}>
          <option value="income">income</option>
          <option value="expense">expense</option>
        </select>
      </label>
      <label>
        Amount (₹):
        <input
          name="amountINR"
          type="number"
          value={form.amountINR}
          onChange={onChange}
          required
        />
      </label>
      <label>
        Category:
        <input
          name="category"
          value={form.category}
          onChange={onChange}
          placeholder="e.g., freelance, software, travel"
          required
        />
      </label>
      <label>
        Description:
        <input
          name="description"
          value={form.description}
          onChange={onChange}
        />
      </label>
      <label>
        Date:
        <input name="date" type="date" value={form.date} onChange={onChange} />
      </label>
      <button disabled={saving}>
        {saving ? "Saving…" : "Add Transaction"}
      </button>
    </form>
  );
}
