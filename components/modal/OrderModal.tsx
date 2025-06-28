"use client";

import { purchaseItem } from "@/functions/invoice";
import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";

type BillValues = {
  product: string;
  quantity: number;
};

export default function OrderModal({
  id,
  name,
  price,
  open,
  handleClose,
  setFetch,
}: {
  id: string;
  name: string;
  price: number;
  open: boolean;
  handleClose: () => void;
  setFetch: Dispatch<SetStateAction<boolean>>;
}) {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  function handleSubmit(ev: any) {
    ev.preventDefault();
    setLoading(true);
    purchaseItem({[id]:quantity})
      .then((res) => {
        if (res.success) {
          setFetch(true);
        }
      })
      .catch((err) => console.log("Purchasing Item failed with error: ", err));

    setLoading(false);
    setQuantity(0)
    handleClose();
  }

  return (
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
      className="w-full"
    >
      <Fade in={open}>
        <div className="absolute translate-y-14 top-[18%] left-[40%] w-[30%] p-4 bg-[#ededed] rounded-xl shadow-2xl flex flex-col items-start gap-4">
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Order Item
          </Typography>

          <div className="flex items-center justify-between w-full">
            <Typography id="transition-modal-title" variant="h2" component="h1">
              {name}
            </Typography>
            <Typography id="transition-modal-title" variant="h6" component="h1">
              ${price}/per item
            </Typography>
          </div>

          <TextField
            label="Quantity"
            value={quantity}
            type="number"
            onChange={(ev: any) => setQuantity(ev.target.value)}
            className="w-full"
          />

          {false ? (
            <div className="w-full flex justify-center">
              <CircularProgress className="text-[#020202]" />
            </div>
          ) : quantity > 0 ? (
            <button
              onClick={handleSubmit}
              className="bg-[#00a785] cursor-pointer hover:bg-[#009675] text-[#fff] transition-colors px-3 py-4 w-full rounded-lg"
            >
              Total: ${price * quantity}
            </button>
          ) : (
            <div
              // onClick={handleSubmit}
              className="bg-[#00a7861c] text-lg text-[#0e0d0d] transition-colors px-3 py-4 w-full rounded-lg"
            >
              Enter quantity to purchase
            </div>
          )}
        </div>
      </Fade>
    </Modal>
  );
}
