import axios from "axios";
 
export const createCategory = async (name: string) => {
  const res = await axios.post( "/api/categories", {
    name,
  });

  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get( "/api/categories");

  return res.data;
};

export const deleteCateogry = async (slug: string) => {
  const res = await axios.delete( `/api/categories/${slug}`, {});
  return res.data.message;
};

export const editCategory = async (slug: string, name: string) => {
  const res = await axios.put( `/api/categories/${slug}`, {
    name,
  });

  return res.data.message;
};
