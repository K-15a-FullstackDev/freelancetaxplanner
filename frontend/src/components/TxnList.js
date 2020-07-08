import React from "react";

export default function TxnList({ items, onEdit, onDelete }) {
  if (!items?.length) return <p>No transactions yet.</p>;
  return (
    <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th align="left">Type</th>
          <th align="right">Amount (₹)</th>
          <th align="left">Category</th>
          <th align="left">Description</th>
          <th align="left">Date</th>
          <th align="left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((t) => (
          <tr key={t._id}>
            <td>{t.type}</td>
            <td align="right">{t.amountINR.toLocaleString("en-IN")}</td>
            <td>{t.category}</td>
            <td>{t.description || "-"}</td>
            <td>{new Date(t.date).toISOString().slice(0, 10)}</td>
            <td>
              <button onClick={() => onEdit(t)}>Edit</button>
              <button style={{ marginLeft: 8 }} onClick={() => onDelete(t._id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
