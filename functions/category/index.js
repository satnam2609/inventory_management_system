import axios from "axios";

export const createCategory = async (name) => {
  const res = await axios.post("http://localhost:3000/api/categories", {
    name,
  });

  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get("http://localhost:3000/api/categories");

  return res.data.message;
};

export const deleteCateogry = async (slug) => {
  const res = await axios.delete(
    `http://localhost:3000/api/categories/${slug}`,
    {}
  );
  return res.data.message;
};

export const editCategory = async (slug, name) => {
  const res = await axios.put(`http://localhost:3000/api/categories/${slug}`, {
    name,
  });

  return res.data.message;
};
