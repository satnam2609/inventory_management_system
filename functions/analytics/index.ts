import axios from "axios";
import { BASE } from "@/functions/index";

export const getMetrics = async () => {
  const res = await axios.get(BASE + "/api/analytics");
  return res.data;
};

export const getRevenueVisual = async (isMonth: boolean) => {
  const res = await axios.post(BASE + "/api/analytics/revenue", {
    isMonth,
  });

  return res.data;
};

export const getRecents = async () => {
  const res = await axios.get(BASE + "/api/analytics/item", {});

  return res.data;
};

export const getSalesByCategoryVisual = async () => {
  const res = await axios.get(BASE + "/api/analytics/contribution", {});

  return res.data;
};
