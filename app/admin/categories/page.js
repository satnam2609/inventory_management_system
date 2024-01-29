"use client";
import { useState, useEffect } from "react";
import CategoryList from "@/components/list/Category";
import CategoryModal from "@/components/modal/CategoryModal";
import {
  deleteCateogry,
  editCategory,
  getCategories,
} from "@/functions/category";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { message } from "antd";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  // add state for keyword search filter
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewCategories, setIsNewCategories] = useState(false);

  function loadCategories() {
    setLoading(true);
    getCategories().then((res) => {
      setCategories(res);
      setLoading(false);
    });
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (isNewCategories) {
      loadCategories();
      setIsNewCategories(false);
    }
  }, [isNewCategories]);

  function handleDelete(slug) {
    setLoading(true);
    deleteCateogry(slug).then((res) => {
      message.info(`${res.name} deleted`);
      setLoading(false);
      setIsNewCategories(true);
    });
  }

  function handleEdit(slug, value) {
    setLoading(true);
    editCategory(slug, value).then((res) => {
      message.success(`${res.name} udated`);
      setLoading(false);
      setIsNewCategories(true);
    });
  }

  const searched = (search) => (c) =>
    c.name.toLowerCase().includes(search) || c.name.includes(search);

  return (
    <div className={"h-full w-full"}>
      <FlexBetween className="px-3 py-2">
        <Headers
          text={"Categories"}
          description={
            "The admin and employees can add,remove and update categories..."
          }
          full={false}
        />

        <CategoryModal
          search={search}
          setSearch={setSearch}
          setNew={setIsNewCategories}
        />
      </FlexBetween>

      {/* Searching section */}
      {/* Categories listinh section */}

      <div className="grid grid-cols-3 w-full gap-2 px-3">
        {categories.filter(searched(search)).map((category) => {
          return (
            <CategoryList
              category={category}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              loading={loading}
            />
          );
        })}
      </div>
    </div>
  );
}
