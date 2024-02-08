export const calculateProfitMargin = (price) => {
  const retailedPrice = price * 0.85;
  const numerator = price - retailedPrice;
  return Math.round((numerator / retailedPrice) * 100);
};

export const calculateRevenueByProduct = (data) => {
  let totalRevenue = 0;
  data.forEach((d) => {
    totalRevenue += d.y;
  });
  return totalRevenue;
};
