"use client";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Add } from "@mui/icons-material";
import { Visibility } from "@mui/icons-material";
import {
  IconButton,
  InputBase,
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { createCategory } from "@/functions/category";
import { message } from "antd";
import FlexBetween from "@/utils/FlexBetween";
import { getInvoice } from "@/functions/invoice";
import ProductInInvoice from "../list/ProductInInvoice";
import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  gap: "1rem",
};

export default function InvoiceDetail({ id }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({});

  useEffect(() => {
    loadInvoice().then((res) => {
      if (res) {
        setInvoiceData(res);
      }
    });
  }, []);

  async function loadInvoice() {
    const res = await getInvoice(id);
    return res;
  }

  console.log(invoiceData);

  return (
    <div>
      <FlexBetween className="gap-[1rem]">
        <button className="text-[#00a170]" onClick={() => setOpen(true)}>
          <Visibility />
        </button>
      </FlexBetween>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <FlexBetween className="w-full">
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                ID :{id}
              </Typography>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                {moment(invoiceData?.createdAt).format("MMM Do YY")}
              </Typography>
            </FlexBetween>

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceData?.products?.map((p) => (
                  <ProductInInvoice
                    key={p.product} // Assuming product has an 'id' property
                    product={p.product}
                    quantity={p.quantity}
                    type={invoiceData.type}
                  />
                ))}
              </tbody>
            </table>

            <FlexBetween className="w-full">
              <p>Grand Total:</p>
              <p className="text-2xl font-bold text-[#007244]">
                &#8377;{invoiceData.grandTotal}
              </p>
            </FlexBetween>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
