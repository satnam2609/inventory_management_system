"use client";

import OrderMoreModal from "@/components/modal/orderMore";
import { getRecentOrders, getThresholds } from "@/functions/po";
import DataTable from "@/utils/DataTable";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { useState, useEffect } from "react";
export default function POPage() {
  const [data, setData] = useState([]);

  const [dataLength, setDataLength] = useState(1);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState({
    current: 1,
    pageSize: 5,
    total: dataLength,
  });

  useEffect(() => {
    loadThresholds().then(({ invoices, total }) => {
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
  }, []);
  async function loadThresholds() {
    const res = await getThresholds(page.current);

    return {
      invoices: res.thresholds,
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
      title: "Name",
      dataIndex: "name",
      render: (text) => (
        <a>{text.split("").length > 15 ? text.slice(0, 15) + "..." : text}</a>
      ),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
      width: "12%",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (text) => <a>&#8377;{text}</a>,
    },
    {
      title: "Count",
      dataIndex: "count",
      render: (text) => <p className="text-[red]">{text}</p>,
    },
    {
      title: "MF date",
      dataIndex: "createdAt",
    },
    {
      title: "Minimum count",
      dataIndex: "minCount",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) =>
        data.length >= 1 ? (
          <div>
            <OrderMoreModal
              id={record._id}
              price={record.price}
              category={record.category}
            />
          </div>
        ) : null,
    },
  ];

  return (
    <div className="w-full h-full">
      <FlexBetween className="px-3 py-3">
        <Headers
          text={"Purchase order"}
          description={
            "Simplifying Transactions, Enhancing Efficiency, and Ensuring Seamless Procurement Experiences!...."
          }
        />
      </FlexBetween>

      {data ? (
        <div className="w-full px-3 py-3">
          <p>Products that crossed threshold quantity</p>
          <DataTable
            loading={loading}
            columns={columns}
            data={data}
            total={dataLength}
            handleTableChange={handleTableChange}
            page={page}
          />
        </div>
      ) : (
        <div>NO products</div>
      )}
    </div>
  );
}
