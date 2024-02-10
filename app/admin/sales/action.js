"use server";

import axios from "axios";

export async function get(id, code) {
  const response = await axios.put(`http://localhost:3000/api/invoices/${id}`, {
    code,
  });

  return response.data.message;
}

export async function sold(id) {
  const response = await axios.post(`http://localhost:3000/api/invoices/${id}`);
  return response.data.message;
}
