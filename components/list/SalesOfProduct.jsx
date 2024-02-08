"use client";

import { useEffect, useState } from "react";
import LineGraph from "../line/LineGraph";
import FlexBetween from "@/utils/FlexBetween";
import { ConfigProvider, DatePicker, Space, Spin } from "antd";
import { Box } from "@mui/material";

const { RangePicker } = DatePicker;

export default function SalesOfProduct({ id, get }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    setLoading(true);
    loadData().then((res) => {
      if (res) {
        setLoading(false);
        setData(res);
      }
    });
  }, [dateRange]);

  async function loadData() {
    const res = await get(id, new Date(dateRange[0]), new Date(dateRange[1]));
    return res;
  }

  return (
    <Box height="55vh" className="col-span-4">
      <FlexBetween className="px-4">
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
            className="px-3"
            defaultValue
            onChange={(_, values) => setDateRange(values)}
          />
        </ConfigProvider>
      </FlexBetween>
      <LineGraph data={data} />
    </Box>
  );
}
