"use client";

import { useEffect, useState } from "react";
import BarChartComponent from "@/components/chart/bar/BarChartComponent";
import PieComponent from "@/components/chart/pie/PieChartComponent";
import Recents from "@/components/lists/Recents";
import {
  getMetrics,
  getRecents,
  getRevenueVisual,
  getSalesByCategoryVisual,
} from "@/functions/analytics";

type MetricData = {
  totalRevenue: number;
  totalCOGS: number;
  margin: number;
  avgInventory: number;
  outOfStocks: number;
  inStocks: number;
  lowStocks: number;
};

export default function AdminPage() {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [barData, setBarData] = useState<any>([]);
  const [pieData, setPieData] = useState<any>([]);
  const [recentData, setRecentData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { message: metricMessage, success } = await getMetrics();
        if (!success) throw new Error("Metrics fetch failed");

        const { message: revenue } = await getRevenueVisual(true);
        const { message: pie } = await getSalesByCategoryVisual();
        const { message: recents } = await getRecents();

        setMetrics(metricMessage);
        setBarData(revenue);
        setPieData(pie);
        setRecentData(recents);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
          <p
            className={`text-start text-4xl ${
              isFirst ? "text-[#e6ebe9]" : "text-[#0d0e0d]"
            }`}
          >
            {isRevenue ? `₹${metric}` : metric}
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading dashboard...</div>;
  if (!metrics) return <div>Try again!</div>;

  const {
    totalRevenue,
    totalCOGS,
    margin,
    avgInventory,
    outOfStocks,
    inStocks,
    lowStocks,
  } = metrics;

  const inventoryTurnoverRatio = totalCOGS / avgInventory;
  const inventoryToSalesRatio = avgInventory / totalRevenue;
  const daysInventoryOutstanding = (avgInventory / totalCOGS) * 365;

  return  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Left Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-4 gap-4">
        <MetricCard
          title="Total Revenue"
          isFirst={true}
          isRevenue={true}
          metric={totalRevenue.toString()}
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
          metric={avgInventory.toString()}
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
          metric={totalCOGS.toString()}
        />
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 row-span-3 h-full">
          <Recents rows={recentData} />
        </div>
      </div>

      {/* Right Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-3 gap-4">
        <div className="row-span-2 bg-white rounded-2xl px-4 py-4">
          <PieComponent data={pieData} />
        </div>

        <div className="row-span-2 grid grid-cols-2 gap-4">
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
            metric={inStocks.toString()}
          />
          <MetricCard
            title="Out of stock"
            isFirst={false}
            isRevenue={false}
            metric={outOfStocks.toString()}
          />
          <MetricCard
            title="Low stock"
            isFirst={false}
            isRevenue={false}
            metric={lowStocks.toString()}
          />
        </div>

        <div className="col-span-1  sm:col-span-2 bg-white rounded-2xl px-4 py-4">
          <BarChartComponent data={barData} />
        </div>
      </div>
    </div>
  

}
