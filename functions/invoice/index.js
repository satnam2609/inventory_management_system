import axios from "axios";

export const createBill = async (bill) => {
  const res = await axios.post("http://localhost:3000/api/invoices", bill);
  if (res.data.success) {
    return res.data.message;
  } else {
    return res.data.message;
  }
};

export const getInvoices = async (page, startDate, endDate) => {
  const res = await axios.put("http://localhost:3000/api/invoices", {
    page: page,
    startDate,
    endDate,
  });

  return res.data.message;
};

export const getInvoice = async (id) => {
  const res = await axios.get(`http://localhost:3000/api/invoices/${id}`);
  return res.data.message;
};
