import BarChartComponent from "@/components/chart/bar/BarChartComponent";
import PieComponent from "@/components/chart/pie/PieChartComponent";
import Recents from "@/components/lists/Recents";
import {
  getMetrics,
  getRecents,
  getRevenueVisual,
  getSalesByCategoryVisual,
} from "@/functions/analytics";
import Header from "@/utils/Header";
import { Card } from "@mui/material";

export default async function AdminPage() {
  const { message: metricMessage, success } = await getMetrics();

  if (success) {
    const {
      totalRevenue,
      totalCOGS,
      margin,
      avgInventory,
      outOfStocks,
      inStocks,
      lowStocks,
    } = metricMessage;

    const inventoryTurnoverRatio = totalCOGS / avgInventory;
    const inventoryToSalesRatio = avgInventory / totalRevenue;
    const daysInventoryOutstanding = (avgInventory / totalCOGS) * 365;

    const { message } = await getRevenueVisual(true);

    const { message: data } = await getRecents();

    const { message: pieData } = await getSalesByCategoryVisual();

    function MetricCard({
      title,
      metric,
      isRevenue,
      isFirst,
    }: {
      title: string;
      metric: string;
      isRevenue: boolean;
      isFirst: boolean;
    }) {
      return (
        <div
          className={`${
            isFirst ? "bg-[#053625]" : "bg-[#ffffff]"
          } px-9 py-8 rounded-2xl flex flex-col items-center gap-4 h-full`}
        >
          <p
            className={`${
              isFirst ? "text-[#abb1af]" : "text-[#0d0e0d]"
            } text-start text-md w-full`}
          >
            {title}
          </p>
          <div className="w-full">
            {isRevenue ? (
              <p
                className={`text-start text-4xl ${
                  isFirst ? "text-[#e6ebe9]" : "text-[#0d0e0d]"
                }`}
              >
                &#8377;{metric}
              </p>
            ) : (
              <p
                className={`text-start text-4xl ${
                  isFirst ? "text-[#e6ebe9]" : "text-[#0d0e0d]"
                }`}
              >
                {metric}
              </p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-3 py-6 w-full h-full">
        <div className="grid grid-cols-3 grid-rows-4 gap-3 items-center  ">
          <MetricCard
            title="Total Revenue"
            isFirst={true}
            isRevenue={true}
            metric={totalRevenue}
          />

          <MetricCard
            title="Profit margin"
            isFirst={false}
            isRevenue={false}
            metric={margin + "%"}
          />

          <MetricCard
            title="Average inventory"
            isFirst={false}
            isRevenue={true}
            metric={avgInventory}
          />

          <MetricCard
            title="Sales ratio"
            isFirst={false}
            isRevenue={false}
            metric={inventoryToSalesRatio.toFixed(2)}
          />

          <MetricCard
            title="Days Outstanding"
            isFirst={false}
            isRevenue={false}
            metric={daysInventoryOutstanding.toFixed(2)}
          />

          <MetricCard
            title="Cost of Goods Sold"
            isFirst={false}
            isRevenue={true}
            metric={totalCOGS}
          />

          <div className="col-span-3 row-span-3 h-full">
            <Recents rows={data} />
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-3 gap-3 w-full">
          <div className="row-span-2 bg-[#fff] rounded-2xl px-3">
            <PieComponent data={pieData} />
          </div>

          <div className="row-span-2 grid grid-cols-2 gap-3">
            <MetricCard
              title="Turnover Ratio"
              isFirst={false}
              isRevenue={false}
              metric={inventoryTurnoverRatio.toFixed(2)}
            />

            <MetricCard
              title="Available stock"
              isFirst={false}
              isRevenue={false}
              metric={inStocks}
            />

            <MetricCard
              title="Out of stock"
              isFirst={false}
              isRevenue={false}
              metric={outOfStocks}
            />

            <MetricCard
              title="Low stock"
              isFirst={false}
              isRevenue={false}
              metric={lowStocks}
            />
          </div>

          <div className="col-span-2 row-span-1 bg-[#fff] rounded-2xl">
            <BarChartComponent data={message} />
          </div>
        </div>
      </div>
    );
  }

  return <div>Try again!</div>;
}
