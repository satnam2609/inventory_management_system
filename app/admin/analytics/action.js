"use server";

import axios from "axios";

export async function getSalesByCategory() {
  const response = await axios.post(`http://localhost:3000/api/analytics`, {
    id: "65a51ad9bee97a698a75c1df",
  });

  return response.data.resultArray;
}
