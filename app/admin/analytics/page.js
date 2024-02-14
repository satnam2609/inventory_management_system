import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { getSalesByCategory } from "./action";
import { BarChart } from "@/components/bar/barChart";

export default async function AnalyticPage() {
  const data = await getSalesByCategory();
  const productKeys = data.reduce((keys, categoryData) => {
    return keys.concat(
      Object.keys(categoryData).filter((key) => key !== "month")
    );
  }, []);
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

      <div className="h-[45vh] w-[45vw]">
        <BarChart data={data} productKeys={productKeys} />
      </div>
    </div>
  );
}
