"use server";

import axios from "axios";

export async function getSalesByCategory(category) {
  const response = await axios.post(`http://localhost:3000/api/analytics`, {
    id: category,
  });

  return response.data.resultArray;
}

export async function getTotalRevenue() {
  const response = await axios.get("http://localhost:3000/api/analytics");
  return response.data.message;
}

export async function getCategoryWiseRevenue(id) {
  const response = await axios.post(
    `http://localhost:3000/api/analytics/${id}`,
    {}
  );
  return response.data.message;
}
