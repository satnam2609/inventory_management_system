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
  const data = await get(product._id, 1);
  const pieData = await sold(product._id);

  return (
    <div className="w-full h-full">
      <FlexBetween className="px-3 py-2">
        <Headers text={product.name} description={product.description} />

        <FlexBetween className="gap-2">
          <p className="text-xl">Revenue by product</p>:
          <p className="text-4xl font-bold text-[#121212]">
            &#8377;{calculateRevenueByProduct(data[0].data)}
          </p>
        </FlexBetween>

        <FlexBetween className="gap-2">
          <p className="text-xl">ROI</p>:
          <p className="text-4xl font-bold text-[#121212]">
            {Math.round(
              (pieData.totalSolds * parseInt(product.price) * 100) /
                pieData.totalInvested
            )}
            %
          </p>
        </FlexBetween>

        <FlexBetween className="gap-2">
          <p className="text-xl">Profit margin</p>:
          <p className="text-4xl font-bold text-[#121212]">
            {calculateProfitMargin(product.price)}%
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
                value: product.count,
                color: "hsl(135, 100%, 27%)",
              },
            ]}
          />
        </div>
      </FlexBetween>
    </div>
  );
}
