import axios from "axios";
 

export const getMetrics = async () => {
  const res = await axios.get("/api/analytics");
  return res.data;
};

export const getRevenueVisual = async (isMonth: boolean) => {
  const res = await axios.post("/api/analytics/revenue", {
    isMonth,
  });

  return res.data;
};

export const getRecents = async () => {
  const res = await axios.get("/api/analytics/item", {});

  return res.data;
};

export const getSalesByCategoryVisual = async () => {
  const res = await axios.get("/api/analytics/contribution", {});

  return res.data;
};
