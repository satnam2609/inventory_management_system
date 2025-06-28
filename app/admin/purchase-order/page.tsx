"use client";

import PurchaseList from "@/components/lists/PurchaseOrderList";
import { getProductsByPagination } from "@/functions/item";
import Header from "@/utils/Header";

import { useEffect, useState } from "react";

type Item = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  cost: number;
  minCount: number;
  inventory: number;
};

export default function InvoicesPage() {
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);



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

  async function loadItems(): Promise<{ products: Item[]; total: number }> {
    const res = await getProductsByPagination(page + 1);

    if (res.success) {
      return res.message;
    } else {
      console.log("Items fetching failed!");
    }

    return { products: [], total: 0 };
  }

  return (
    <div className="w-full py-3  flex flex-col gap-10 items-center">
      <div className="w-full flex items-center justify-between ">
        <Header
          text="Purchase Order"
          description="For filling the stock from the vendors, admin can make purchases."
          full={true}
          x={0}
          y={0}
        />
      </div>

      {loading ? (
        <div>Loading..</div>
      ) : (
        <PurchaseList
          rows={items}
          total={total}
          page={page}
          setPage={setPage}
          setFetch={setIsNewItem}
        />
      )}
    </div>
  );
}
