"use client";

import { ResponsiveLine } from "@nivo/line";

export default function LineGraph({ data, enbaleArea, grid }) {
  return (
    <ResponsiveLine
      data={data}
      margin={{ top: 50, right: 150, bottom: 50, left: 90 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="cardinal"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: "Date",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      enableArea={enbaleArea}
      areaOpacity={0.05}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 8,
        tickRotation: 0,
        legend: "Sales",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      colors={"hsl(124.9, 100%, 25.5%)"}
      useMesh={true}
      enableGridX={grid}
      enableGridY={grid}
      legends={[
        {
          anchor: "bottom",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, 0)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, 0)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}
