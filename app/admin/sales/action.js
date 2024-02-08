"use server";

import axios from "axios";

export async function get(id, startDate, endDate) {
  const response = await axios.put(`http://localhost:3000/api/invoices/${id}`, {
    startDate,
    endDate,
  });

  return response.data.message;
}
