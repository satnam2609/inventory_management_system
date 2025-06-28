"use client";

import InvoiceList from "@/components/lists/InvoiceList";
import { getProductsByPagination } from "@/functions/item";
import Header from "@/utils/Header";
import { useState, useEffect } from "react";
import { ConfigProvider, DatePicker, Space, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { getInvoicesByDateRange } from "@/functions/invoice";
import InvoicesList from "@/components/lists/InvoicesList";

type Item = {
  _id: string;
  name: string;
  slug: string;
  price: number;

  minCount: number;
  inventory: number;
};

type SelectedItem = {
  _id: string;
  quantity: number;
};
const { RangePicker } = DatePicker;

const { Title } = Typography;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);

  useEffect(() => {
    getInvoicesByDateRange(
      dateRange.map((date) => (date ? date.toString() : ""))
    )
      .then((res) => {
        if (res.success) {
          setInvoices(res.message);
        }
      })
      .catch((err) => console.log("Invoices fetching failed with error ", err));
  }, [dateRange]);

  return (
    <div className="w-full py-3  flex flex-col gap-10 items-center">
      <div className="flex items-center justify-between w-full">
        <Header
          text="Invoices"
          description="Invoices are the electronic receipt that are generated in every transaction for recording."
          full
          x={0}
          y={0}
        />

        <Space direction="vertical">
          <Title level={5}>Filter by date</Title>
          <ConfigProvider>
            <RangePicker
              value={[dateRange[0], dateRange[1]]}
              onChange={(_, dates: string[]) => {
                const parsed: [Dayjs | null, Dayjs | null] = [
                  dates[0] ? dayjs(dates[0]) : null,
                  dates[1] ? dayjs(dates[1]) : null,
                ];
                setDateRange(parsed);
              }}
            />
          </ConfigProvider>
        </Space>
      </div>
      <div className="w-full">
        <InvoicesList rows={invoices} />
      </div>
    </div>
  );
}
