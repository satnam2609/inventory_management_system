"use client";

import { getInvoices } from "@/functions/invoice";
import DataTable from "@/utils/DataTable";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import Link from "next/link";
import { useState, useEffect } from "react";
import moment from "moment";
import { ConfigProvider, DatePicker, Space } from "antd";

import InvoiceDetail from "@/components/modal/InvoiceDetail";

const { RangePicker } = DatePicker;

export default function InvoicePage() {
  const [data, setData] = useState([]);
  const [dataLength, setDataLength] = useState(1);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState({
    current: 1,
    pageSize: 6,
    total: dataLength,
  });

  const [filtered, setFiltered] = useState(false);

  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    if (filtered) {
      loadInvoicesWithOutFilter().then(({ invoices, total }) => {
        let newRes;

        newRes = invoices?.map((arrObj, i) => {
          return {
            ...arrObj,
            key: i + 1,
          };
        });
        setData(newRes);
        setDataLength(total);
      });
    }

    loadInvoicesWithOutFilter().then(({ invoices, total }) => {
      let newRes;

      newRes = invoices?.map((arrObj, i) => {
        return {
          ...arrObj,
          key: i + 1,
        };
      });
      setData(newRes);
      setDataLength(total);
    });
  }, [filtered, dateRange, page]);

  console.log(dateRange);

  async function loadInvoicesWithOutFilter() {
    const res = await getInvoices(page.current, dateRange[0], dateRange[1]);

    return {
      invoices: res.invoices,
      total: res.total,
    };
  }

  function handleTableChange(value) {
    setPage({
      ...page,
      current: value.current,
    });

    // `dataSource` is useless since `pageSize` changed
    if (value.pageSize !== page?.pageSize) {
      setData([]);
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      width: "5%",
      render: (text) => <a>{"..." + text.slice(-4)}</a>,
    },
    {
      title: "Employee id",
      dataIndex: "issuedBy",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ordered date",
      dataIndex: "createdAt",
      render: (text) => <a>{moment(text).format("MMMM Do YYYY, h:mm:ss a")}</a>,
    },
    {
      title: "Purchase type",
      dataIndex: "type",
      render: (type) => <p>{type ? "Inventory order" : "Customer sell"}</p>,
    },
    {
      title: "Customer",
      dataInder: "email",
      render: (text) => <a>{text.email}</a>,
    },
    {
      title: "View details",
      dataIndex: "operation",
      render: (_, record) => {
        console.log(record._id);
        return (
          <div>
            <InvoiceDetail id={record._id} />
          </div>
        );
      },
    },
  ];
  return (
    <div className="w-full h-full px-3 py-3">
      <FlexBetween className="px-4 py-2 w-full">
        <Headers
          text={"Invoices"}
          description={
            "Manage and view all your inventory-related transactions with our invoicing system."
          }
        />

        {/* Filter by start date and end date */}
        <FlexBetween className="gap-4">
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
              showTime
              defaultValue
              onChange={(_, values) => setDateRange(values)}
            />
          </ConfigProvider>

          <Link
            href={"/admin/invoices/add-bill"}
            className="bg-[#1ed9a5] px-5 py-3 text-lg font-bold"
          >
            Add bill
          </Link>
        </FlexBetween>
      </FlexBetween>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        handleTableChange={handleTableChange}
        total={dataLength}
      />
    </div>
  );
}
