"use server";

import axios from "axios";

export async function getSalesByCategory(category) {
  const response = await axios.post(`http://localhost:3000/api/analytics`, {
    id: category,
  });

  return response.data.resultArray;
}
