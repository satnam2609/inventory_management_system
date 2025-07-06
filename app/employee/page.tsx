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

import { useState, useEffect } from "react";

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
    <div className="px-3 grid grid-cols-1 sm:grid-cols-4 gap-4 w-full h-full">
  {/* Left: Products Panel */}
  <Card className="flex flex-col items-center h-full gap-10">
    <div className="w-full flex flex-col items-start gap-4 px-4 py-4">
      <p className="text-3xl sm:text-4xl md:text-5xl font-bold">Products</p>
      <TextField
        label="Search"
        value={query}
        onChange={(ev) => setQuery(ev.target.value)}
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined />
            </InputAdornment>
          ),
        }}
      />
    </div>

    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      onClose={() => setOpen(false)}
      message={message}
      key={"top" + "right"}
    />

    {/* Scrollable Product List */}
    <div className="w-full px-4 h-[45vh] sm:h-[60vh] overflow-y-auto">
      {items.map((item: any) => (
        <ItemDisplay
          key={item._id}
          item={item}
          list={invoiceItems}
          setList={setInvoiceItems}
          setTotal={setTotal}
        />
      ))}
    </div>
  </Card>

  {/* Right: Invoice + Total */}
  <div className="sm:col-span-3 px-3 py-4 h-full flex flex-col items-start gap-10 w-full">
    {/* Top Invoice Info */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-6">
      <div className="flex flex-col items-start gap-4">
        <TextField
          variant="standard"
          label="Mobile number"
          value={user}
          onChange={(ev) => setUser(ev.target.value)}
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <p className="text-lg sm:text-xl">Transaction method:</p>
          <p className="text-xl sm:text-2xl font-bold">Cash</p>
        </div>
      </div>

      <div className="flex flex-col items-start">
        <p className="text-xs sm:text-sm text-gray-600">Grand total</p>
        <p className="text-3xl sm:text-4xl font-bold text-green-700">
          ₹{isNaN(total) ? "0" : total}
        </p>
      </div>
    </div>

    {/* Invoice List */}
    <div className="w-full flex flex-col items-start gap-3">
      <p className="text-xl sm:text-2xl font-semibold text-gray-800">
        List of items to be added in the invoice
      </p>
      <InvoiceList
        items={items}
        itemsObj={invoiceItems}
        setItemsObj={setInvoiceItems}
        setTotal={setTotal}
      />
    </div>

    {/* Submit */}
    <Button
      type="button"
      onClick={handleSubmit}
      className="self-start text-lg font-bold"
    >
      Submit
    </Button>
  </div>
</div>

  );
}
