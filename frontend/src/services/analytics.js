import api from "../api";

export async function getMonthly({ year, month }) {
  const { data } = await api.get("/analytics/monthly", {
    params: { year, month },
  });
  return data;
}

export async function getYearly({ year }) {
  const { data } = await api.get("/analytics/yearly", { params: { year } });
  return data;
}
