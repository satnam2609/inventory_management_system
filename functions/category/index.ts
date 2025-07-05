import axios from "axios";
import { BASE } from "@/functions/index";

export const createCategory = async (name: string) => {
  const res = await axios.post(BASE + "/api/categories", {
    name,
  });

  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(BASE + "/api/categories");

  return res.data;
};

export const deleteCateogry = async (slug: string) => {
  const res = await axios.delete(BASE + `/api/categories/${slug}`, {});
  return res.data.message;
};

export const editCategory = async (slug: string, name: string) => {
  const res = await axios.put(BASE + `/api/categories/${slug}`, {
    name,
  });

  return res.data.message;
};
