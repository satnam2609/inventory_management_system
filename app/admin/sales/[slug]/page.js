import { getProduct } from "@/functions/products";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { get, sold } from "../action";
import LineGraph from "@/components/line/LineGraph";
import { Card } from "@mui/material";

import SalesOfProduct from "@/components/list/SalesOfProduct";
import { calculateProfitMargin, calculateRevenueByProduct } from "@/utils";
import PieChart from "@/components/pie/PieChart";

export default async function ProductSalePage({ params }) {
  const { slug } = params;
  const product = await getProduct(slug);

  const pieData = await sold(product._id);

  let Revenue = 0,
    GrossProfit = 0,
    COGS = 0;

  //getting the values for the product
  const response = await fetch(`http://localhost:3000/api/products/values`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ id: product._id, startDate: "", endDate: "" }),
  });

  if (response.ok) {
    const { message } = await response.json();
    Revenue = message.revenue;
    GrossProfit = message.grossProfit;
    COGS = message.cogsCost;
  }

  return (
    <div className="w-full h-full">
      <FlexBetween className="px-3 py-2">
        <Headers text={product.name} description={product.description} />

        <FlexBetween className="gap-2">
          <p className="text-xl">Revenue</p>:
          <p className="text-4xl font-bold text-[#121212]">&#8377;{Revenue}</p>
        </FlexBetween>

        <FlexBetween className="gap-2">
          <p className="text-xl">COGS</p>:
          <p className="text-3xl font-bold text-[#121212]">&#8377;{COGS}</p>
        </FlexBetween>

        <FlexBetween className="gap-2">
          <p className="text-xl">Profit margin</p>:
          <p className="text-3xl font-bold text-[#121212]">
            &#8377;{GrossProfit}
          </p>
        </FlexBetween>

        <FlexBetween className="gap-2">
          <p className="text-xl">Gross margin</p>:
          <p className="text-3xl font-bold text-[#121212]">
            {(GrossProfit / Revenue).toFixed(2) * 100}%
          </p>
        </FlexBetween>
        {/* Filter by time series */}
      </FlexBetween>

      <FlexBetween className="grid grid-cols-6 w-full">
        <SalesOfProduct id={product._id} get={get} />
        <div
          style={{
            width: "25vw",
            height: "100%",
          }}
        >
          <PieChart
            data={[
              {
                id: "sold",
                label: "sold",
                value: pieData.totalSolds,
                color: "hsl(149, 100%, 46%)",
              },
              {
                id: "Instock",
                label: "Not sold",
                value: product.initialInventory + product.purchasesDuringPeriod,
                color: "hsl(135, 100%, 27%)",
              },
            ]}
          />
        </div>
      </FlexBetween>
    </div>
  );
}
