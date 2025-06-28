import axios from "axios";

export const purchaseItem = async (itemsObj: any) => {
  const res = await axios.post("http://localhost:3000/api/invoices/order", {
    itemsObj,
  });

  return res.data;
};

export const createBill = async (user: string, itemsObj: any) => {
  const res = await axios.post("http://localhost:3000/api/invoices/bill", {
    userData:user,
    itemsObj,
  });

  return res.data;
};

export const getInvoicesByDateRange = async (dateRange: string[]) => {
  console.log(dateRange)
  const res = await axios.post("http://localhost:3000/api/invoices", {
    dateRange,
  });

  return res.data;
};
