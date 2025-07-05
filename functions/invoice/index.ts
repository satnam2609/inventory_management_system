import axios from "axios";
import { BASE } from "@/functions/index";

export const purchaseItem = async (itemsObj: any) => {
  const res = await axios.post(BASE + "/api/invoices/order", {
    itemsObj,
  });

  return res.data;
};

export const createBill = async (user: string, itemsObj: any) => {
  const res = await axios.post(BASE + "/api/invoices/bill", {
    userData: user,
    itemsObj,
  });

  return res.data;
};

export const getInvoicesByDateRange = async (dateRange: string[]) => {
  console.log(dateRange);
  const res = await axios.post(BASE + "/api/invoices", {
    dateRange,
  });

  return res.data;
};
