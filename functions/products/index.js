import axios from "axios";

export const addProduct = async (values) => {
  const res = await axios.post("http://localhost:3000/api/products", {
    name: values.name,
    description: values.description,
    category: values.category,
    price: values.price,
    count: values.count,
    minCount: values.minCount,
  });

  return res.data.message;
};

export const getProducts = async () => {
  const res = await axios.get("http://localhost:3000/api/products");
  return res.data.message;
};

export const getProductsByPagination = async (page) => {
  const res = await axios.post(
    `http://localhost:3000/api/products/pagination`,
    page
  );

  return res;
};

export const deleteProduct = async (slug) => {
  const res = await axios.delete(`http://localhost:3000/api/products/${slug}`);
  return res.data.message;
};

export const updateProduct = async (slug, values) => {
  const res = await axios.put(`http://localhost:3000/api/products/${slug}`, {
    name: values.name,
    description: values.description,
    category: values.category,
    price: values.price,
    count: values.count,
    minCount: values.minCount,
  });
  return res.data.message;
};

export const getProduct = async (slug) => {
  const res = await axios.get(`http://localhost:3000/api/products/${slug}`);
  return res.data.message;
};

export const filteredProducts = async (page, category) => {
  const res = await axios.post("http://localhost:3000/api/products/filter", {
    page,
    category,
  });

  if (res.data.success) {
    return res.data.message;
  }
};
