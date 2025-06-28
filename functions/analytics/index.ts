import axios from "axios";

export const getMetrics = async () => {
  const res = await axios.get("http://localhost:3000/api/analytics");
  return res.data;
};

export const getRevenueVisual = async (isMonth: boolean) => {
    const res=await axios.post("http://localhost:3000/api/analytics/revenue",{
        isMonth
    });

    return res.data;
};


export const getRecents=async()=>{
  const res=await axios.get("http://localhost:3000/api/analytics/item",{});

  return res.data;
}

export const getSalesByCategoryVisual=async()=>{
  const res=await axios.get("http://localhost:3000/api/analytics/contribution",{});

  return res.data;
}

