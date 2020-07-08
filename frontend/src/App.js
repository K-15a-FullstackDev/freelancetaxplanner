import React, { useEffect, useState } from "react";
import TxnForm from "./components/TxnForm";
import TxnList from "./components/TxnList";
import MonthlySummary from "./components/MonthlySummary";
import {
  listTransactions,
  deleteTransaction,
  updateTransaction,
} from "./services/transactions";

export default function App() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [year, setYear] = useState(2020);
  const [month, setMonth] = useState(3); // show March 2020 by default (matches your data)
  const [refreshKey, setRefreshKey] = useState(0);

  async function refresh() {
    const data = await listTransactions({
      from: `${year}-${String(month).padStart(2, "0")}-01`,
    });
    setItems(data);
    setRefreshKey((k) => k + 1); // bump to recompute monthly summary
  }

  useEffect(() => {
    refresh();
  }, [year, month]);

  async function onDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteTransaction(id);
    refresh();
  }

  async function onSaveEdit() {
    const { _id, ...payload } = editing;
    payload.amountINR = Number(payload.amountINR);
    await updateTransaction(_id, payload);
    setEditing(null);
    refresh();
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1>FreelanceTaxPlanner (2020)</h1>
      <p>Base currency: INR (₹)</p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label>
          Year:{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>
        <label>
          Month:{" "}
          <input
            type="number"
            min="1"
            max="12"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          />
        </label>
        <button onClick={refresh}>Refresh</button>
      </div>

      <MonthlySummary year={year} month={month} refreshSignal={refreshKey} />

      <h3>Add Transaction</h3>
      <TxnForm onCreated={refresh} />

      {editing && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: 12,
            borderRadius: 4,
            marginBottom: 16,
          }}
        >
          <h3>Edit Transaction</h3>
          <label>
            Type:
            <select
              value={editing.type}
              onChange={(e) => setEditing({ ...editing, type: e.target.value })}
            >
              <option value="income">income</option>
              <option value="expense">expense</option>
            </select>
          </label>
          <label style={{ marginLeft: 8 }}>
            Amount (₹):
            <input
              type="number"
              value={editing.amountINR}
              onChange={(e) =>
                setEditing({ ...editing, amountINR: e.target.value })
              }
            />
          </label>
          <label style={{ marginLeft: 8 }}>
            Category:
            <input
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
            />
          </label>
          <label style={{ marginLeft: 8 }}>
            Description:
            <input
              value={editing.description || ""}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
          </label>
          <label style={{ marginLeft: 8 }}>
            Date:
            <input
              type="date"
              value={new Date(editing.date).toISOString().slice(0, 10)}
              onChange={(e) => setEditing({ ...editing, date: e.target.value })}
            />
          </label>
          <div style={{ marginTop: 8 }}>
            <button onClick={onSaveEdit}>Save</button>
            <button style={{ marginLeft: 8 }} onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <TxnList items={items} onEdit={setEditing} onDelete={onDelete} />
    </div>
  );
}
