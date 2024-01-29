"use client";

import FlexBetween from "@/utils/FlexBetween";
import { Delete, Edit } from "@mui/icons-material";

import { useEffect, useState } from "react";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import {
  IconButton,
  InputBase,
  TextField,
  Tooltip,
  CircularProgress,
} from "@mui/material";

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

export default function CategoryList({
  category,
  handleEdit,
  handleDelete,
  loading,
}) {
  const [name, setName] = useState(category.name);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleChange(ev) {
    setName(ev.target.value);
  }

  return (
    <>
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
              <CircularProgress className="text-[#00e5ff]" />
            ) : (
              <button
                onClick={handleEdit}
                className="bg-[#00a785] hover:bg-[#009675] text-[#fff] transition-colors px-3 py-4 w-full rounded-lg"
              >
                Submit
              </button>
            )}
          </Box>
        </Fade>
      </Modal>

      <FlexBetween className="px-3 w-full  py-2 bg-[#d8fbf7] rounded-md">
        <p>{category.name}</p>
        <div className="flex items-center space-x-2 ">
          <IconButton onClick={handleOpen}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(category.slug)}>
            <Delete />
          </IconButton>
        </div>

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
                variant="h6"
                component="h2"
              >
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
                  onClick={() => {
                    handleEdit(category.slug, name);
                    handleClose();
                  }}
                  className="bg-[#00a785] hover:bg-[#009675] text-[#fff] transition-colors px-3 py-4 w-full rounded-lg"
                >
                  Submit
                </button>
              )}
            </Box>
          </Fade>
        </Modal>
      </FlexBetween>
    </>
  );
}
