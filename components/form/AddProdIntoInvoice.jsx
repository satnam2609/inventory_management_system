"use client";

import { useState, useEffect } from "react";
import { InputNumber, Table } from "antd";
import {
  IconButton,
  TextField,
  Tooltip,
  CircularProgress,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
} from "@mui/material";
import {
  filteredProducts,
  getProductsByPagination,
} from "@/functions/products";
import DataTable from "@/utils/DataTable";

import { Add, Cancel } from "@mui/icons-material";

import FlexBetween from "@/utils/FlexBetween";
import { getCategories } from "@/functions/category";

export default function AddProdIntoInvoice({
  products,
  setProducts,
  open,
  setGrandTotal,
}) {
  const [category, setCategory] = useState();
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFiletered, setIsFiltered] = useState(false);

  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState({
    current: 1,
    pageSize: 6,
    total: total,
  });

  useEffect(() => {
    loadCategories().then((res) => setCategories(res));
  }, []);

  useEffect(() => {
    setLoading(true);

    if (isFiletered && category !== "") {
      loadFilteredProducts().then(({ products, total }) => {
        let newRes;

        newRes = products?.map((arrObj, i) => {
          return {
            ...arrObj,
            quantity: 1,
            include: false,
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
          return {
            ...arrObj,
            quantity: 1,
            include: false,
            key: i + 1,
          };
        });
        setData(newRes);
        setTotal(total);
      });
    }

    setLoading(false);
  }, [page, isFiletered, open, category]);

  async function loadCategories() {
    return await getCategories();
  }

  async function loadFilteredProducts() {
    const res = await filteredProducts(page.current, category);

    return {
      products: res.products,
      total: res.total,
    };
  }

  async function loadProducts() {
    const res = await getProductsByPagination({
      page: page.current,
    });

    if (res.data.success) {
      return { products: res.data.products, total: res.data.total };
    }
  }

  function handleChange(ev) {
    ev.preventDefault();
    setCategory(ev.target.value);

    setIsFiltered(true);
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

  function handleClick(value, record, key) {
    if (value) {
      setGrandTotal(
        (prevVal) =>
          prevVal + parseInt(record.quantity) * parseInt(record.price)
      );
      setProducts((prevData) => [
        ...prevData,
        {
          key: key,
          product: record._id,
          price: record.price,
          quantity: record.quantity,
          category: record.category,
        },
      ]);
    } else {
      const filtered = products.filter((item) => item.key != key);
      setGrandTotal((prevVal) => prevVal - parseFloat(record.price));
      setProducts(filtered);
    }

    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    const item = newData[index];
    newData[index] = { ...item, include: value };
    setData(newData);
  }

  function handleQuantityChange(value, key) {
    let product = products.find((product) => product.key == key);
    if (product.quantity >= value) {
      setGrandTotal(
        (prevVal) => parseFloat(prevVal) - value * parseFloat(product.price)
      );
    } else {
      setGrandTotal(
        (prevVal) => parseFloat(prevVal) + value * parseFloat(product.price)
      );
    }
    product.quantity = value;
    setProducts([...products]);

    const newData = [...data];
    const index = newData.findIndex((item) => key === item.key);
    const item = newData[index];
    newData[index] = { ...item, quantity: value };
    setData(newData);
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",

      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
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
      title: "Count",
      dataIndex: "count",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text, record) => {
        if (record.include) {
          return (
            <FlexBetween>
              <InputNumber
                min={1}
                defaultValue={text}
                onChange={(value) => handleQuantityChange(value, record.key)}
              />
              <button
                onClick={() => handleClick(!record.include, record, record.key)}
              >
                <Cancel />
              </button>
            </FlexBetween>
          );
        } else {
          return (
            <button
              onClick={() => handleClick(!record.include, record, record.key)}
            >
              <Add />
            </button>
          );
        }
      },
    },
  ];

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-2 gap-5 px-2 py-1">
        <div className="">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              name="category"
              onChange={handleChange}
            >
              <MenuItem value={""} key={"none"}>
                All
              </MenuItem>
              {categories?.length > 0 &&
                categories.map((cat) => {
                  return (
                    <MenuItem value={cat._id} key={cat.slug}>
                      {cat.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>

        <TextField
          variant="standard"
          label="Search product name"
          value={search}
          onChange={(ev) => {
            setSearch(ev.target.value);
            console.log(search);
          }}
        />
      </div>

      <div className="px-3 w-full h-full">
        <DataTable
          columns={columns}
          data={data}
          loading={loading}
          page={page}
          handleTableChange={handleTableChange}
          total={total}
        />
      </div>
    </div>
  );
}
