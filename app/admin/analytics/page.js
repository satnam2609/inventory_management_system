"use client";

import { useState, useEffect } from "react";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";

import { getSalesByCategory } from "./action"; //getValuesForCategory
import { BarChart } from "@/components/bar/barChart";
import { getCategories } from "@/functions/category";
import { ConfigProvider, Select, Statistic } from "antd";

export default function AnalyticPage() {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [category, setCategory] = useState("6612b39b5e19e3707d3ce72a");
  // const [totalCOGS, setTotalCOGS] = useState(0);
  // const [totalRevenue, setTotalRevenue] = useState(0);

  // const [totalGrossProfit, setTotalGrossProfit] = useState(0);
  const [loading, setLoading] = useState(false);

  const [slug, setSlug] = useState("");

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
    // .then(() => {
    //   getValues().then((res) => {
    //     setTotalRevenue(res.totalRevenue);

    //     setTotalGrossProfit(res.totalGrossProfit);
    //     setTotalCOGS(res.totalCogsCost);
    //     setLoading(false);
    //   });
    // });
  }, [category]);

  async function loadData() {
    const result = await getSalesByCategory(category);
    return result;
  }

  // async function getValues() {
  //   const res = await getValuesForCategory(slug);
  //   const { totalRevenue, totalCogsCost, totalGrossProfit, totalAvgInventory } =
  //     res;
  //   return { totalRevenue, totalCogsCost, totalGrossProfit };
  // }
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
          <div className="h-[60vh] w-[70vw]">
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

        {/* <div className="flex flex-col space-y-4 items-start justify-end px-4 py-2">
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
            <Statistic title="Total COGS" value={totalCOGS} />
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
            <Statistic title="Total Gross Profit" value={totalGrossProfit} />
          </ConfigProvider>
        </div> */}
      </FlexBetween>
    </div>
  );
}
