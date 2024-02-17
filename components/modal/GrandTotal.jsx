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

export default function GrandTotalModal({
  open,
  setOpen,
  grandTotal,
  handleConfirm,
}) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
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
            {grandTotal > 0 ? (
              <div className="w-full flex justify-between items-center">
                <Typography>Grand total:</Typography>
                <Typography className="font-bold">
                  &#8377;{grandTotal}
                </Typography>
              </div>
            ) : null}

            <button
              onClick={handleConfirm}
              className="bg-[#00a785] hover:bg-[#009675] text-[#fff] transition-colors px-3 py-4 w-full rounded-lg"
            >
              Sure
            </button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
