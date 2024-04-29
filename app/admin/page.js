"use client";
import { getCategories } from "@/functions/category";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { ConfigProvider, DatePicker, Divider, Statistic } from "antd";
import Link from "next/link";
import { getRevenueOnLineChart, getTotalInvestedAmount } from "./action";
import { CurrencyRupee } from "@mui/icons-material";
import { useEffect, useState } from "react";
import LineGraph from "@/components/line/LineGraph";

const { RangePicker } = DatePicker;

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [totalCOGS, setTotalCOGS] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAverageInventory, setTotalAverageInventory] = useState(0);
  const [totalGrossProfit, setTotalGrossProfit] = useState(0);
  const [netSalesUnit, setNetSalesUnit] = useState(0);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    loadData().then((res) => setData(res));
  }, []);

  useEffect(() => {
    loadCategories().then((res) => setCategories(res));
  }, [dateRange]);

  useEffect(() => {
    loadValues().then((message) => {
      setTotalRevenue(message.netRevenue);
      setTotalAverageInventory(message.netAvgInventory);
      setTotalCOGS(message.netCogsCost);
      setTotalGrossProfit(message.netGrossProfit);
    });
  }, [dateRange]);

  useEffect(() => {
    loadSalesUnit().then((val) => setNetSalesUnit(val));
  }, [dateRange]);

  async function loadData() {
    return await getRevenueOnLineChart(1);
  }

  async function loadCategories() {
    return await getCategories();
  }

  async function loadValues() {
    const response = await fetch("http://localhost:3000/api/analytics", {
      method: "PUT",
      headers: {
        Content: "application/json",
      },
      body: JSON.stringify({
        startDate: dateRange[0] ? dateRange[0] : "",
        endDate: dateRange[1] ? dateRange[1] : "",
      }),
    });
    if (response.ok) {
      const { message } = await response.json();
      return message;
    }
  }

  async function loadSalesUnit() {
    const response = await fetch("http://localhost:3000/api/invoices/sales", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        startDate: dateRange[0] ? dateRange[0] : "",
        endDate: dateRange[1] ? dateRange[1] : "",
      }),
    });

    if (response.ok) {
      const { message } = await response.json();
      return message;
    }
  }

  return (
    <div className="w-full px-3 h-full">
      <FlexBetween className="px-4 py-2">
        <Headers
          text={"Dashboard"}
          description={"Fully interactive dashboard ..."}
        />
        <Link
          href={"/admin/purchase-orders"}
          className="bg-[#1b5737] hover:bg-[#204e38] rounded-2xl transition-colors px-4 text-white py-2 text-lg"
        >
          Order
        </Link>
      </FlexBetween>

      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              padding: 20,
            },
          },
        }}
      >
        <RangePicker
          defaultValue
          onChange={(_, values) => setDateRange(values)}
        />
      </ConfigProvider>

      <div className="grid grid-cols-6 gap-3 py-5 h-full ">
        <div className="grid grid-cols-2 col-span-2 h-full  grid-rows-4 gap-4">
          <div className="bg-[#fff] rounded-2xl px-3 py-2">
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Total Revenue"}
                value={totalRevenue}
                prefix={<CurrencyRupee />}
              />
            </ConfigProvider>
          </div>
          <div className="bg-[#fff] rounded-2xl px-3 py-2">
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Margin"}
                value={((totalGrossProfit * 100) / totalRevenue).toFixed(1)}
                suffix={"%"}
              />
            </ConfigProvider>
          </div>
          <div className="bg-[#fff] rounded-2xl px-3 py-2">
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Total Gross profit"}
                value={totalGrossProfit}
                prefix={<CurrencyRupee />}
              />
            </ConfigProvider>
          </div>
          <div className="bg-[#fff]   rounded-2xl px-3 py-2">
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Inventory to Sales Ratio"}
                value={
                  netSalesUnit
                    ? (totalAverageInventory / netSalesUnit).toFixed(2)
                    : 0
                }
              />
            </ConfigProvider>
          </div>

          <div className="bg-[#fff] rounded-2xl px-3 py-2">
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Inventory turnover"}
                value={(totalCOGS / totalAverageInventory).toFixed(2)}
              />
            </ConfigProvider>
          </div>
          <div className="bg-[#fff] rounded-2xl px-3 py-2">
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Days inventory outstanding"}
                value={(365 / (totalCOGS / totalAverageInventory)).toFixed(2)}
              />
            </ConfigProvider>
          </div>
          <div className="bg-[#fff] col-span-2 rounded-2xl px-3 py-2">
            <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Total COGS"}
                value={totalCOGS.toFixed(2)}
                prefix={<CurrencyRupee />}
              />
            </ConfigProvider>
          </div>
        </div>
        <div className="bg-[#fff] col-span-4   h-full rounded-xl py-3">
          <LineGraph data={data} enbaleArea={true} grid={false} />
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="col-span-1 grid grid-cols-2 gap-2">
          <div className="bg-[#fff] px-3 py-3 rounded-xl">
            {/* <ConfigProvider
              theme={{
                components: {
                  Statistic: {
                    contentFontSize: 34,
                    titleFontSize: 14,
                  },
                },
              }}
            >
              <Statistic
                title={"Total revenue"}
                prefix={<CurrencyRupee />}
                value={totalRevenue}
              />
        //     </ConfigProvider> */
}
//   </div>
// </div>
// <div className="bg-[#fff] px-3 py-3 rounded-xl">
//   {/* <ConfigProvider
//     theme={{
//       components: {
//         Statistic: {
//           contentFontSize: 34,
//           titleFontSize: 14,
//         },
//       },
//     }}
//   >
//     <Statistic
//       title={"Total Gross profit"}
//       prefix={<CurrencyRupee />}
//       value={totalGrossProfit}
//     />
//   </ConfigProvider> */}
// </div>

// <div className="bg-[#fff] px-3 py-3 rounded-xl">
{
  /* <ConfigProvider
            theme={{
              components: {
                Statistic: {
                  contentFontSize: 34,
                  titleFontSize: 14,
                },
              },
            }}
          >
            <Statistic
              title={"Total COGS"}
              prefix={<CurrencyRupee />}
              value={totalCOGS}
            />
          </ConfigProvider> */
}
//   </div>
// </div> */}
