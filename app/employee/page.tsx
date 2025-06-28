"use client";

import ItemDisplay from "@/components/invoice/ItemDisplay";
import InvoiceList from "@/components/lists/InvoiceList";
import { createBill } from "@/functions/invoice";
import { filterProduct } from "@/functions/item";
import { SearchOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";

import { useState, useEffect, ChangeEvent } from "react";

interface InvoiceListObject {
  [key: string]: number;
}

export default function EmployeePage() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceListObject>({});
  const [user, setUser] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTimeout(() => loadFilteredItems().then((arr) => setItems(arr)), 800);
  }, [query,message]);

  async function loadFilteredItems() {
    const res = await filterProduct(query);

    if (res.success) {
      return res.message;
    } else {
      return [];
    }
  }

  function handleSubmit(ev: any) {
    ev.preventDefault();
    if (user === "") {
      alert("Please enter the mobile number ");
      return;
    }
    createBill(user, invoiceItems)
      .then((res) => {
        if (res.success) {
          setOpen(true);
          setMessage("Invoice created with id:" + res.message);
        } else {
          setOpen(true);
          setMessage("Invoice billing failed with message :" + res.message);
        }
      })
      .catch((err) => console.error(err));
    setInvoiceItems({});
    setUser("")
    setTotal(0);
  }

  return (
    <div className="px-3 py-4 grid grid-cols-4 w-full gap-2 h-full">
      <Card className="flex flex-col items-center gap-14 h-full">
        <div className="w-full flex flex-col items-start gap-4 px-4 py-4">
          <p className="text-6xl font-bold text-start ">Products</p>
          <TextField
            label="Search"
            value={query}
            onChange={(ev: any) => setQuery(ev.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlined />
                  </InputAdornment>
                ),
              },
            }}
            variant="standard"
          />
        </div>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={() => setOpen(false)}
          message={message}
          key={"top" + "right"}
        />

        <div className="w-full px-4">
          {items.map((item: any) => {
            return (
              <ItemDisplay
                key={item._id}
                item={item}
                list={invoiceItems}
                setList={setInvoiceItems}
                setTotal={setTotal}
              />
            );
          })}
        </div>
      </Card>

      <div className="col-span-3 px-3 py-3 h-full flex flex-col items-center gap-10 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start justify-between gap-3">
            <TextField id="variant" variant="standard" label="Mobile number" value={user} onChange={(ev)=>setUser(ev.target.value)}/>

            <div className="flex items-center justify-between gap-3">
              <p className="text-4xl">Transaction method : </p>
              <p className="text-4xl font-bold">Cash </p>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <p className="text-sm">Grand total </p>
            <p className="text-5xl font-bold">
              &#8377;{isNaN(total) ? "0" : total}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-2">
          <p className="text-[#353333] text-3xl font-bold">
            List of items to be added in the invoice
          </p>
          <InvoiceList
            items={items}
            itemsObj={invoiceItems}
            setItemsObj={setInvoiceItems}
            setTotal={setTotal}
          />
        </div>

        <Button type="button" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
