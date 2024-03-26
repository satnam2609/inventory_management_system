import axios from "axios";

export const getThresholds = async (page) => {
  const res = await axios.post(
    "http://localhost:3000/api/purchase-order/threshold",
    { page: page }
  );
  return res.data.message;
};

export const createorder = async (id, quantity, cost, grandTotal) => {
  const res = await axios.post("http://localhost:3000/api/purchase-order", {
    id: id,
    quantity: quantity,
    cost: cost,
    grandTotal: grandTotal,
  });

  return res.data.message;
};

export const getRecentOrders = async (page) => {
  const res = await axios.post(
    "http://localhost:3000/api/purchase-order/purchased",
    {
      page,
    }
  );

  if (res.data.success) {
    return res.data.message;
  }
};
