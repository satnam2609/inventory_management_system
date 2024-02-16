"use client";

import { useState, useEffect } from "react";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { getSalesByCategory } from "./action";
import { BarChart } from "@/components/bar/barChart";
import { getCategories } from "@/functions/category";
import { Select } from "antd";

export default function AnalyticPage() {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("65a51ad9bee97a698a75c1df");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res);
      })
      .then(() => {
        loadData().then((res) => {
          setLoading(false);
          setData(res);
        });
      });
  }, [category]);

  async function loadData() {
    const result = await getSalesByCategory(category);
    return result;
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
    </div>
  );
}
