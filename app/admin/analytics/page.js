"use client";

import { useState, useEffect } from "react";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { getSalesByCategory, getTotalRevenue } from "./action";
import { BarChart } from "@/components/bar/barChart";
import { getCategories } from "@/functions/category";
import { Select } from "antd";
import moment from "moment";

export default function AnalyticPage() {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("65a51ad9bee97a698a75c1df");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res);
      })
      .then(() => {
        loadData()
          .then((res) => {
            setLoading(false);
            setData(res);
          })
          .then(() => {
            loadTotalRevenue().then((res) => setTotalRevenue(res));
          });
      });
  }, [category]);

  async function loadTotalRevenue() {
    const response = await getTotalRevenue();
    return response;
  }

  async function loadData() {
    const result = await getSalesByCategory(category);
    return result;
  }

  function categoryWiseRevenue() {
    const value = data.reduce((result, item) => {
      let monthVals = Array.from({ length: 12 }, (_, index) => index + 1);
      let intermediateArray = Object.values(item).filter((val) =>
        monthVals.includes(moment(val).format("M"))
      );
      result += intermediateArray.reduce(
        (sum, val) => sum + parseFloat(val),
        0
      );
      return result;
    }, 0);

    return value;
  }

  return (
    <div className="w-full h-full ">
      <FlexBetween className="px-4 py-3">
        <Headers
          text={"Analytics"}
          description={
            "View analytics for your sales and financial performance...."
          }
        />

        <button>View Predictions</button>
      </FlexBetween>

      <FlexBetween>
        {loading ? (
          <p>...Loading</p>
        ) : (
          <div className="h-[45vh] w-[45vw]">
            <Select
              value={category}
              options={categories.map((cat) => {
                return {
                  label: cat.name,
                  value: cat._id,
                };
              })}
              onChange={(val) => setCategory(val)}
            />
            <BarChart data={data} />
          </div>
        )}

        <div className="w-full flex flex-col items-center justify-center px-3">
          <div className="flex flex-col items-start">
            <p className="text-sm ">Total Revenue</p>
            <p className="text-6xl font-bold text-[#02543a]">
              &#8377;{totalRevenue}
            </p>
          </div>
          <div className="flex flex-col items-start">
            <p className="text-sm ">Total Revenue by category</p>
            <p className="text-6xl font-bold text-[#02543a]">
              &#8377;{data?.length > 0 ? categoryWiseRevenue() : 0}
            </p>
          </div>
        </div>
      </FlexBetween>
    </div>
  );
}
