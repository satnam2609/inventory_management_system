"use client";

import { ResponsiveBar } from "@nivo/bar";

export default function BarChartComponent({ data }: { data: any }) {
  return (
    <ResponsiveBar  
      data={data}
      indexBy="month"
      keys={["revenue"]}
      padding={0.8}
      labelSkipWidth={12}
      labelSkipHeight={12}
      borderRadius={36}
      enableGridY={false}
      colors={["#053625"]}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          translateX: 120,
          itemsSpacing: 3,
          itemWidth: 100,
          itemHeight: 16,
        },
      ]}
      axisBottom={{ legend: "Month", legendOffset: 32 }}
      axisLeft={null}
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
    />
  );
}
