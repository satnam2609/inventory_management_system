"use client";

import { useEffect, useState } from "react";

import { Popconfirm, Spin, Tooltip, message } from "antd";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  deleteProduct,
  filteredProducts,
  getProductsByPagination,
} from "@/functions/products";
import DataTable from "@/utils/DataTable";
import FlexBetween from "@/utils/FlexBetween";
import UpdateProductModal from "../modal/UpdateProduct";
import Link from "next/link";
import { Add } from "@mui/icons-material";
import OrderMoreModal from "../modal/orderMore";

export default function ItemsDisplay({ isFiletered, setIsFiltered, category }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProd, setSelectedProd] = useState();
  const [isNewProducts, setIsNewProducts] = useState(false);

  const [page, setPage] = useState({
    current: 1,
    pageSize: 6,
    total: total,
  });

  //products that are below or reached at threshold count must be reported via some API
  const [belowThreshold, setBelowThreshold] = useState([]);

  useEffect(() => {
    setLoading(true);

    if (isFiletered && category !== "") {
      loadFilteredProducts().then(({ products, total }) => {
        let newRes;

        newRes = products?.map((arrObj, i) => {
          if (
            arrObj.minCount >=
            arrObj.initialInventory + arrObj.purchasesDuringPeriod
          ) {
            setBelowThreshold((prevVal) => [...prevVal, arrObj]);
          }
          return {
            ...arrObj,
            key: i + 1,
          };
        });
        setData(newRes);
        setTotal(total);
      });
    } else {
      loadProducts().then(({ products, total }) => {
        let newRes;

        newRes = products?.map((arrObj, i) => {
          if (
            arrObj.minCount >=
            arrObj.initialInventory + arrObj.purchasesDuringPeriod
          ) {
            setBelowThreshold((prevVal) => [...prevVal, arrObj]);
          }
          return {
            ...arrObj,
            key: i + 1,
          };
        });
        setData(newRes);
        setTotal(total);
      });
    }

    setLoading(false);
  }, [page, isFiletered, category]);

  async function loadFilteredProducts() {
    const res = await filteredProducts(page.current, category);

    return {
      products: res.products,
      total: res.total,
    };
  }

  console.log(belowThreshold);

  async function loadProducts() {
    const res = await getProductsByPagination({
      page: page.current,
    });

    if (res.data.success) {
      return { products: res.data.products, total: res.data.total };
    }
  }

  async function handleChangeType(type, slug) {
    if (type === "Delete") {
      setLoading(true);
      deleteProduct(slug).then((res) => {
        message.info(`${res.name} deleted!`);
      });

      setLoading(false);
    } else if (type === "Edit") {
      let res = await fetch(`http://localhost:3000/api/products/${slug}`);
      if (res.ok) {
        res = await res.json();
        if (res) {
          setOpenModal(true);
          setSelectedProd(res.message);
        }
      }
    }
  }

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

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
      render: (text, record) => (
        <Link href={`/admin/sales/${record.slug}`}>
          {"..." + text.slice(-4)}
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (
        <a>{text.split("").length > 25 ? text.slice(0, 25) + "..." : text}</a>
      ),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value),
    },

    {
      title: "Price",
      dataIndex: "price",
      render: (text) => <a>&#8377;{text}</a>,
    },
    {
      title: "Cost",
      dataIndex: "cost",
      render: (text) => <a>&#8377;{text}</a>,
    },
    {
      title: "Purchase period",
      dataIndex: "purchasesDuringPeriod",
    },
    {
      title: "Count",
      render: (_, record) => (
        <p>
          {parseInt(record.initialInventory) +
            parseInt(record.purchasesDuringPeriod)}
        </p>
      ),
    },
    {
      title: "Purchased date",
      dataIndex: "createdAt",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        data.length >= 1 ? (
          <FlexBetween>
            <a>
              <OrderMoreModal id={record._id} price={record.cost} />
            </a>
            <Popconfirm
              okButtonProps={{
                style: { backgroundColor: "#424242" },
              }}
              title="Sure to Edit?"
              onConfirm={() => {
                handleChangeType("Edit", record.slug);
              }}
            >
              <a>
                <EditOutlinedIcon />
              </a>
            </Popconfirm>

            <Popconfirm
              okButtonProps={{
                style: { backgroundColor: "#424242" },
              }}
              title="Sure to delete?"
              onConfirm={() => handleChangeType("Delete", record.slug)}
            >
              <a>
                <DeleteOutlineOutlinedIcon />
              </a>
            </Popconfirm>
          </FlexBetween>
        ) : null,
    },
  ];

  return (
    <div className="w-full px-3 ">
      {loading ? (
        <Spin />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          page={page}
          handleTableChange={handleTableChange}
          total={total}
        />
      )}
      <UpdateProductModal
        loading={loading}
        open={openModal}
        product={selectedProd}
        setLoading={setLoading}
        setNew={setIsNewProducts}
        setOpen={setOpenModal}
      />
    </div>
  );
}
