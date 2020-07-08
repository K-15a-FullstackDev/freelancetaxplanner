import React, { useEffect, useState } from "react";
import { getMonthly } from "../services/analytics";

export default function MonthlySummary({ year, month, refreshSignal }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await getMonthly({ year, month });
        setData(res);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [year, month, refreshSignal]);

  if (!data) return null;
  const { incomeINR, expenseINR, profitINR } = data;
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 12,
        margin: "12px 0",
        borderRadius: 4,
      }}
    >
      <strong>
        Summary — {year}-{String(month).padStart(2, "0")}
      </strong>
      <div>Income: ₹ {incomeINR.toLocaleString("en-IN")}</div>
      <div>Expense: ₹ {expenseINR.toLocaleString("en-IN")}</div>
      <div>Profit: ₹ {profitINR.toLocaleString("en-IN")}</div>
    </div>
  );
}
