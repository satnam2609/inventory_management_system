"use client";

import { Typography } from "@mui/material";

export default function Headers({ text, description, full, x, y }) {
  return (
    <div className={`${full ? "w-full" : ""} px-${x} py-${y}"`}>
      <Typography fontSize={"3rem"} color={"#00573a"} className="font-bold">
        {text}
      </Typography>
    </div>
  );
}
