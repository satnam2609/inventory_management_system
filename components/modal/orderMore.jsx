"use client";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { TextField, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

import { message } from "antd";
import FlexBetween from "@/utils/FlexBetween";
import { useSession } from "next-auth/react";

import { createorder } from "@/functions/po";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  gap: "1rem",
};

export default function OrderMoreModal({ id }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);

  const [grandTotal, setGrandTotal] = useState(0);
  const { data: session } = useSession();

  //
  const [count, setCount] = useState("");
  const [cost, setCost] = useState(0);

  function handleChange(ev) {
    setCount(ev.target.value);
  }

  useEffect(() => {
    setGrandTotal(Math.round(cost) * count);
  }, [count]);

  function handleSubmit(ev) {
    ev.preventDefault();

    try {
      setLoading(true);
      if (cost > 0) {
        createorder(id, count, cost, grandTotal).then((res) => {
          if (res) {
            message.success("Ordered successfully");
          }
        });
      }

      setLoading(false);

      handleClose();
    } catch (error) {
      message.error("Error");
      setLoading(false);
      setBills(initialState);
      handleClose();
    }
  }

  return (
    <div>
      <FlexBetween className="gap-[1rem]">
        <button className="font-bold" onClick={handleOpen}>
          Order
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
            <Typography
              id="transition-modal-title"
              className="w-full flex justify-between items-center"
            >
              Order more <span className="font-bold">{id}</span>
            </Typography>
            <TextField
              label="Cost"
              value={cost}
              onChange={(ev) => setCost(ev.target.value)}
              className="w-full"
            />
            <TextField
              label="Quantity"
              value={count}
              onChange={handleChange}
              className="w-full"
            />

            {grandTotal > 0 ? (
              <div className="w-full flex justify-between items-center">
                <Typography>Grand total:</Typography>
                <Typography className="font-bold">
                  &#8377;{grandTotal}
                </Typography>
              </div>
            ) : null}

            {loading ? (
              <div className="w-full flex justify-center">
                <CircularProgress className="text-[#00e5ff]" />
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-[#00a785] hover:bg-[#009675] text-[#fff] transition-colors px-3 py-4 w-full rounded-lg"
              >
                Submit
              </button>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
