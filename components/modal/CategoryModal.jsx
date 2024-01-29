"use client";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Add } from "@mui/icons-material";
import {
  IconButton,
  InputBase,
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { createCategory } from "@/functions/category";
import { message } from "antd";
import FlexBetween from "@/utils/FlexBetween";

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

export default function CategoryModal({ setNew, search, setSearch }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  function handleChange(ev) {
    setName(ev.target.value);
  }

  function handleSubmit(ev) {
    ev.preventDefault();

    try {
      setLoading(true);
      createCategory(name).then((res) => {
        if (res.success) {
          message.success(`${res.message.name} created!`);
          setNew(true);
        }
      });

      setLoading(false);
      setName("");
      handleClose();
    } catch (error) {
      message.error(res.message);
      setLoading(false);
      setName("");
      handleClose();
    }
  }

  return (
    <div>
      <FlexBetween className="gap-[1rem]">
        <TextField
          variant="standard"
          label="Search for category"
          value={search}
          onChange={(ev) => {
            setSearch(ev.target.value);
            console.log(search);
          }}
        />
        <Tooltip title="Add category">
          <IconButton onClick={handleOpen}>
            <Add fontSize="large" className="text-[#00573a]" />
          </IconButton>
        </Tooltip>
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
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Create category
            </Typography>
            <TextField
              label="Name"
              value={name}
              onChange={handleChange}
              className="w-full"
            />

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
