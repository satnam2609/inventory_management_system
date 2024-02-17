import axios from "axios";

export async function getTotalInvestedAmount() {
  const response = await axios.get("http://localhost:3000/api/invoices");
  return response.data.message;
}

export async function getRevenueOnLineChart(code) {
  const response = await axios.post(
    "http://localhost:3000/api/invoices/sales",
    { code }
  );
  return response.data.message;
}
