"use client";

import ItemList from "@/components/lists/ItemList";
import ItemModal from "@/components/modal/ItemModal";
import { getCategories } from "@/functions/category";
import {
  deleteProduct,
  getProductsByPagination,
  updateProduct,
} from "@/functions/item";

import Header from "@/utils/Header";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

type Item = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  cost: number;
  minCount: number;
  inventory:number;
  sales:number;
};

type Values = {
  name: string;
  category: string;
  price: number;
  cost: number;
  minCount: number;
};

export default function ItemsPage() {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState<string>("");

  const [isNewItem, setIsNewItem] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    loadCategories()
      .then((res) => setCategories(res))
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  }, [isNewItem]);

  useEffect(() => {
    setLoading(true);
    loadItems()
      .then((res) => {
        setItems(res.products);
        setTotal(res.total);
      })
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  }, [isNewItem, page]);

  async function loadCategories(): Promise<Category[]> {
    const res = await getCategories();
    if (res.success) {
      return res.message;
    } else {
      console.log("Category fetching failed!");
    }
    return [];
  }

  async function loadItems(): Promise<{ products: Item[]; total: number }> {
    const res = await getProductsByPagination(page + 1);

    if (res.success) {
      return res.message;
    } else {
      console.log("Items fetching failed!");
    }

    return { products: [], total: 0 };
  }

  function handleEdit(slug: string, item: Values) {
    setLoading(true);
    updateProduct(slug, item)
      .then((res) => console.log(res))
      .then(() => {
        loadItems()
          .then((res) => {
            setItems(res.products);
            setTotal(res.total);
          })
          .catch((err) => console.log(err))
          .then(() => setLoading(false));
      })
      .catch((err) => {
        setLoading(false);
        console.log("Product deleting error :", err);
      });
  }

  function handleDelete(slug: string) {
    setLoading(true);
    deleteProduct(slug)
      .then((res) => {})
      .then(() => {
        loadItems()
          .then((res) => {
            setItems(res.products);
            setTotal(res.total);
          })
          .catch((err) => console.log(err))
          .then(() => setLoading(false));
      })
      .catch((err) => {
        setLoading(false);
        console.log("Product deleting error :", err);
      });
  }

  const searched = (search: string) => (c: Item) =>
    c.name.toLowerCase().includes(search) || c.name.includes(search);

  return (
    <div className="w-full py-3  flex flex-col gap-10 items-center">
      <div className="w-full flex items-center justify-between ">
        <Header
          text="Goods"
          description="Goods are commodities that needs to be managed and will be used for generating revenue"
          full
          x={0}
          y={0}
        />

        <ItemModal
          search={search}
          setSearch={setSearch}
          setNew={setIsNewItem}
          categories={categories}
        />
      </div>

      {loading ? (
        <div>Loading..</div>
      ) : (
        <ItemList
          categories={categories}
          rows={items.filter(searched(search)).map((item: Item) => item)}
          total={total}
          page={page}
          setPage={setPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
}
