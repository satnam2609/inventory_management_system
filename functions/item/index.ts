import axios from "axios";

type Values = {
  name: string;

  category: string;
  price: number;
  cost: number;
  minCount: number;
};

import { BASE } from "@/functions/index";

export const addProduct = async (values: Values) => {
  const res = await axios.post(BASE + "/api/items", {
    name: values.name,
    category: values.category,
    cost: values.cost,
    price: values.price,
    minCount: values.minCount,
  });

  return res.data;
};

export const getProducts = async () => {
  const res = await axios.get(BASE + "/api/items");

  return res.data;
};

export const getProductsByPagination = async (page: number) => {
  const res = await axios.post(BASE + "/api/items/pagination", {
    page,
  });

  return res.data;
};

export const updateProduct = async (slug: string, values: Values) => {
  const res = await axios.put(BASE + `/api/items/${slug}`, {
    name: values.name,
    category: values.category,
    price: values.price,
    count: values.cost,
    minCount: values.minCount,
  });

  return res.data;
};

export const deleteProduct = async (slug: string) => {
  const res = await axios.delete(BASE + `/api/items/${slug}`, {});
  return res.data;
};

export const getProduct = async (slug: string) => {
  const res = await axios.get(BASE + `/api/items/${slug}`);

  return res.data;
};

export const filterProduct = async (slug: string | null) => {
  const res = await axios.get(BASE + `/api/items/filter?search=${slug}`);

  return res.data;
};
