"use client";

const API = "http://15.206.174.36:8000/predict-sales/";

import OrderMoreModal from "@/components/modal/orderMore";
import { getRecentOrders, getThresholds } from "@/functions/po";
import DataTable from "@/utils/DataTable";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { useState, useEffect } from "react";
import { DatePicker, ConfigProvider } from "antd";
import moment from "moment";
import { filteredProducts } from "@/functions/products";

const { RangePicker } = DatePicker;

export default function POPage() {
  const [data, setData] = useState([]);

  const [dataLength, setDataLength] = useState(1);
  const [dateRange, setDateRange] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState({
    current: 1,
    pageSize: 6,
    total: dataLength,
  });

  const [demadValues, setDemandValues] = useState([]);

  async function loadFilteredProducts() {
    const res = await filteredProducts(page.current, "");

    return {
      products: res.products,
      total: res.total,
    };
  }

  async function getDemandValues() {
    let response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start_date: dateRange[0] ? dateRange[0] : moment().format("YYYY-MM-DD"),
        end_date: dateRange[1] ? dateRange[1] : moment().format("YYYY-MM-DD"),
      }),
    });

    if (response.ok) {
      let resultArray = await response.json();
      return resultArray;
    }
  }

  console.log("DateRange", dateRange);

  useEffect(() => {
    loadFilteredProducts().then(({ products, total }) => {
      let newRes;

      newRes = products
        ?.map((arrObj, i) => {
          return {
            ...arrObj,
            key: i + 1,
          };
        })
        .sort((a, b) => {
          return (
            a.initialInventory +
            a.purchasesDuringPeriod -
            b.initialInventory -
            b.purchasesDuringPeriod
          );
        });
      setData(newRes);
      setDataLength(total);
    });
  }, [page.current]);

  useEffect(() => {
    getDemandValues().then((res) => {
      setDemandValues(res);
    });
  }, [dateRange, page.current]);

  console.log(data);

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

  const columns = (isAll) => [
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
      render: (text, record) =>
        record.minCount >=
        record.initialInventory + record.purchasesDuringPeriod ? (
          <p className="text-[red]">
            {record.initialInventory + record.purchasesDuringPeriod}
          </p>
        ) : (
          <p className="text-[black]">
            {record.initialInventory + record.purchasesDuringPeriod}
          </p>
        ),
    },
    {
      title: "MF date",
      dataIndex: "createdAt",
    },
    {
      title: "Demand",
      dataIndex: "key",
      render: (index) => <p>{demadValues[index + 5 * (page.current - 1)]}</p>,
    },
    {
      title: "Minimum count",
      dataIndex: "minCount",
    },

    {
      title: "Operation",
      dataIndex: "operation",
      render: (_, record) => (
        <div>
          <OrderMoreModal id={record._id} category={record.category} />
        </div>
      ),
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
          defaultValue
          onChange={(_, values) => setDateRange(values)}
        />
      </ConfigProvider>

      {data ? (
        <div className="w-full px-3 py-3">
          <p>Products that crossed threshold quantity</p>
          <DataTable
            columns={columns(false)}
            data={data}
            total={dataLength}
            handleTableChange={handleTableChange}
            page={page}
          />
        </div>
      ) : (
        ""
      )}

      {/* {products ? (
        <div className="w-full px-3 py-3">
          <p>Order more any products from the table</p>
          <DataTable
            columns={columns(true)}
            data={products}
            total={itemsLength}
            handleTableChange={handleTableChangeForAll}
            page={_page}
          />
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
}
