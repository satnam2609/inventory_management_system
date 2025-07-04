"use client";

import CategoryList from "@/components/lists/CategoryList";
import CategoryModal from "@/components/modal/CategoryModal";
import {
  getCategories,
  editCategory,
  deleteCateogry,
} from "@/functions/category";
import Header from "@/utils/Header";

import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewCategories, setIsNewCategories] = useState(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    loadCategories()
      .then((res) => setCategories(res))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (isNewCategories) {
      setLoading(true);
      loadCategories()
        .then((res) => setCategories(res))
        .then(() => setLoading(false))
        .catch((err) => console.log(err));
      setIsNewCategories(false);
    }
  }, [isNewCategories]);

  async function loadCategories(): Promise<Category[]> {
    const res = await getCategories();
    if (res.success) {
      return res.message;
    } else {
      console.log("Category fetching failed!");
    }
    return [];
  }

  function handleDelete(slug: string) {
    setLoading(true);
    deleteCateogry(slug).then(() => {
      setLoading(false);
      setIsNewCategories(true);
    });
  }

  function handleEdit(slug: string, value: string) {
    setLoading(true);
    editCategory(slug, value).then(() => {
      setLoading(false);
      setIsNewCategories(true);
    });
  }

  const searched = (search: string) => (c: Category) =>
    c.name.toLowerCase().includes(search) || c.name.includes(search);

  return (
    <div className="w-full py-3  flex flex-col gap-7 items-center">
      <div className="flex items-center justify-between w-full ">
        <Header
          text="Category"
          description="categories related the type of products for efficient management of inventory"
          full={false}
          x={0}
          y={0}
        />

        <CategoryModal
          search={search}
          setNew={setIsNewCategories}
          setSearch={setSearch}
        />
      </div>

      {loading ? (
        <div>Loading..</div>
      ) : (
        <div className="grid grid-cols-3 mt-5 w-full gap-3">
          {categories.filter(searched(search)).map((category) => {
            return (
              <CategoryList
                key={category._id}
                category={category}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                loading={loading}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
