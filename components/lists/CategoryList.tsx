"use client";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

import { useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Backdrop,
  CircularProgress,
  Fade,
  Modal,
  TextField,
  Typography,
} from "@mui/material";

export default function CategoryList({
  category,
  handleEdit,
  handleDelete,
  loading,
}: {
  category: Category;
  handleEdit: Function;
  handleDelete: Function;
  loading: boolean;
}) {
  const [name, setName] = useState(category.name);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleChange(ev: any) {
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
          <div className="absolute translate-y-14 top-[18%] left-[85%] p-4 bg-[#ededed] rounded-xl shadow-2xl flex flex-col items-start gap-4">
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
              <CircularProgress className="text-[#0a0a0a]" />
            ) : (
              <button
                onClick={() => handleEdit(category.slug, name)}
                className="bg-[#00a785] hover:bg-[#009675] text-[#fff] transition-colors px-3 py-4 w-full rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </Fade>
      </Modal>
      <div className="bg-[#0a0a0a3f] rounded-2xl flex items-center justify-between px-4 py-3 w-full">
        <div>
          <p className="text-[#0a0a0a] font-bold text-xl">{category.name}</p>
          <p className="text-[#0a0a0a80] text-sm">{category._id}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button className="cursor-pointer" onClick={() => handleOpen()}>
            <EditIcon />
          </button>

          <button
            className="cursor-pointer"
            onClick={() => handleDelete(category.slug)}
          >
            <DeleteIcon />
          </button>
        </div>
      </div>
    </>
  );
}
