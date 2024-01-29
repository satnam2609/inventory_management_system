"use client";

import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import AddProdIntoInvoice from "@/components/form/AddProdIntoInvoice";
import { TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { message } from "antd";
import { createBill } from "@/functions/invoice";
import { useRouter } from "next/navigation";

export default function AddBillPage() {
  const [email, setEmail] = useState("");
  const [products, setProducts] = useState([]);
  const [bill, setBill] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setBill({
      products,
      email,
      grandTotal,
      type: false,
    });
  }, [products, email]);

  async function handleConfirm() {
    if (products.length >= 1 && email !== "") {
      setLoading(true);

      createBill(bill)
        .then((res) => {
          console.log(res);
          setLoading(false);
          setBill({});

          router.replace("/admin/invoices");
        })
        .catch((err) => {
          message.error(err);
          console.log(err);
          setLoading(false);
          setBill({});
        });
    } else {
      message.warning("Please fill all fields");
    }
  }
  return (
    <div className="w-full px-4 py-2">
      <FlexBetween>
        <Headers
          text={"Add Bill"}
          description={
            "Track and manage your financial transactions seamlessly."
          }
        />

        <FlexBetween className="space-x-4">
          <TextField
            value={email}
            variant="standard"
            type="email"
            label="Email of buyer"
            onChange={(ev) => setEmail(ev.target.value)}
          />

          <button
            className="bg-[#121212] px-4 py-3 text-[#fff]"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </FlexBetween>
      </FlexBetween>

      {/* Form  */}
      <AddProdIntoInvoice
        products={products}
        setProducts={setProducts}
        setGrandTotal={setGrandTotal}
      />
    </div>
  );
}
