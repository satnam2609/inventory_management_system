import LineGraph from "@/components/line/LineGraph";
import { getCategories } from "@/functions/category";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { ConfigProvider, Divider, Statistic } from "antd";
import Link from "next/link";
import { getCategoryWiseRevenue, getTotalRevenue } from "./analytics/action";

import { getRevenueOnLineChart, getTotalInvestedAmount } from "./action";
import { ArrowUpwardOutlined, CurrencyRupee } from "@mui/icons-material";

export default async function AdminPage() {
  const categories = await getCategories();
  const data = await getRevenueOnLineChart(1);
  let totalInvested = 0,
    totalReturned = 0;
  totalReturned = await getTotalRevenue();
  totalInvested = await getTotalInvestedAmount();

  let categoryWiseData = [];

  await Promise.all(
    categories.map(async (category) => {
      const data = await getCategoryWiseRevenue(category._id);
      let percentage = Math.round(
        (data.totalReturned * 100) / data.totalInvested
      );
      let object = {};
      if (percentage) {
        object[category.name] = percentage;
        object[`value`] = data.totalReturned;
        categoryWiseData.push(object);
      }
    })
  );

  return (
    <div className="w-full h-full">
      <FlexBetween className="px-4 py-2">
        <Headers
          text={"Dashboard"}
          description={"Fully interactive dashboard ..."}
        />
        <Link
          href={"/admin/purchase-orders"}
          className="bg-[#009747] hover:bg-[#00b95f] transition-colors px-4 text-white py-2 text-lg"
        >
          Order
        </Link>
      </FlexBetween>

      <div className="grid grid-cols-3 gap-2 mt-4 px-2">
        <div className="col-span-1 grid grid-cols-2 gap-2">
          <div className="bg-[#fff] px-3 py-3 rounded-xl">
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
                title={"Return on investment"}
                value={Math.round((totalReturned * 100) / totalInvested)}
                suffix={"%"}
              />
            </ConfigProvider>
          </div>
          <div className="bg-[#fff] px-3 py-3 rounded-xl">
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
                title={"Total revenue"}
                prefix={<CurrencyRupee />}
                value={totalReturned}
              />
            </ConfigProvider>
          </div>

          <div className="bg-[#fff] col-span-2 px-3 py-3 rounded-xl">
            {categoryWiseData
              .reverse({ value: -1 })
              .slice(0, 3)
              .map((item) => {
                return (
                  <>
                    <FlexBetween>
                      <Statistic
                        title={`ROI on ${Object.keys(item)[0]}`}
                        value={Object.values(item)[0]}
                        suffix={"%"}
                        valueStyle={{ color: "#3f8600" }}
                        prefix={<ArrowUpwardOutlined />}
                      />
                      <Statistic
                        prefix={<CurrencyRupee />}
                        value={item.value}
                      />
                    </FlexBetween>

                    <Divider />
                  </>
                );
              })}
          </div>
        </div>

        <div className="bg-[#fff] col-span-2 rounded-xl py-3">
          <LineGraph data={data} enbaleArea={true} mesh={false} />
        </div>
      </div>
    </div>
  );
}
