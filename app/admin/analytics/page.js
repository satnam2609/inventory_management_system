"use client";

import { useState, useEffect } from "react";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";

import {
  getCategoryWiseRevenue,
  getSalesByCategory,
  getTotalRevenue,
} from "./action";
import { BarChart } from "@/components/bar/barChart";
import { getCategories } from "@/functions/category";
import { ConfigProvider, Select, Statistic } from "antd";
import moment from "moment";
import { Card } from "@mui/material";

export default function AnalyticPage() {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("65a51ad9bee97a698a75c1df");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [categoryWiseRevenue, setCategoryWiseRevenue] = useState(0);
  const [investedInThisCategory, setInvestedInThisCategory] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((res) => {
        setCategories(res);
      })
      .then(() => {
        loadData().then((res) => {
          setData(res);
          setLoading(false);
        });
      });
  }, [category]);

  useEffect(() => {
    loadTotalRevenue().then((res) => setTotalRevenue(res));
  }, [category]);

  useEffect(() => {
    loadCategoryWiseRevenue().then((res) =>
      setCategoryWiseRevenue(res.totalReturned)
    );
  }, [category]);

  useEffect(() => {
    loadCategoryWiseRevenue().then((res) =>
      setInvestedInThisCategory(res.totalInvested)
    );
  }, [category]);

  async function loadTotalRevenue() {
    const response = await getTotalRevenue();
    return response;
  }

  async function loadData() {
    const result = await getSalesByCategory(category);
    return result;
  }

  async function loadCategoryWiseRevenue() {
    const result = await getCategoryWiseRevenue(category);
    return result;
  }

  function calculateROI() {
    return parseInt((categoryWiseRevenue * 100) / investedInThisCategory);
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
      </FlexBetween>

      <FlexBetween className="px-3">
        {loading ? (
          <p>...Loading</p>
        ) : (
          <div className="h-[45vh] w-[50vw]">
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

        <div className="flex flex-col space-y-4 items-start justify-end px-4 py-2">
          <ConfigProvider
            theme={{
              components: {
                Statistic: {
                  contentFontSize: 54,
                  titleFontSize: 20,
                },
              },
            }}
          >
            <Statistic title="Total Revenue " value={totalRevenue} />
          </ConfigProvider>

          <ConfigProvider
            theme={{
              components: {
                Statistic: {
                  contentFontSize: 54,
                  titleFontSize: 20,
                },
              },
            }}
          >
            <Statistic
              title="Total Revenue by category"
              value={categoryWiseRevenue}
            />
          </ConfigProvider>

          <ConfigProvider
            theme={{
              components: {
                Statistic: {
                  contentFontSize: 54,
                  titleFontSize: 20,
                },
              },
            }}
          >
            <Statistic
              title={
                categories
                  ? `ROI on ${
                      categories.filter(
                        (cat) => String(cat._id) === category
                      )[0]?.name
                    }`
                  : "ROI"
              }
              value={calculateROI()}
              suffix={"%"}
            />
          </ConfigProvider>
        </div>
      </FlexBetween>
    </div>
  );
}
