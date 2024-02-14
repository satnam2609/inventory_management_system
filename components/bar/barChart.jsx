"use client";

import { ResponsiveBar } from "@nivo/bar";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const BarChart = ({ data, productKeys }) => (
  <ResponsiveBar
    data={data}
    keys={Object.keys(data[0]).filter((key) => key !== "month")} // Exclude 'month' key
    indexBy="month"
    margin={{ top: 50, right: 200, bottom: 50, left: 100 }}
    padding={0.3}
    colors={{ scheme: "greens" }}
    enableLabel={false}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Month",
      legendPosition: "middle",
      legendOffset: 32,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 2,
      legend: "Sales",
      legendPosition: "middle",
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    legends={[
      {
        dataFrom: "keys",
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: 0,
        itemsSpacing: 2,
        itemWidth: 100,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
  />
);
