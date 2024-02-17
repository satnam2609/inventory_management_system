"use client";

import { useEffect, useState } from "react";
import LineGraph from "../line/LineGraph";
import FlexBetween from "@/utils/FlexBetween";
import { Select } from "antd";
import { Box } from "@mui/material";

export default function SalesOfProduct({ id, get }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(1);

  useEffect(() => {
    setLoading(true);
    loadData().then((res) => {
      if (res) {
        setLoading(false);
        setData(res);
      }
    });
  }, [code]);

  async function loadData() {
    const res = await get(id, code);
    return res;
  }

  return (
    <Box height="55vh" className="col-span-4">
      <FlexBetween className="px-4">
        <Select
          defaultValue={1}
          onChange={(val) => setCode(val)}
          style={{ width: 120 }}
          options={[
            { value: 1, label: "Daily" },
            { value: 2, label: "Monthly" },
            { value: 4, label: "Yearly" },
          ]}
        />
      </FlexBetween>
      <LineGraph data={data} enbaleArea={false} grid={true} />
    </Box>
  );
}
