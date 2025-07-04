"use client";

import { createCategory } from "@/functions/category";
import { Add } from "@mui/icons-material";
import {
  Backdrop,
  CircularProgress,
  Fade,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

export default function CategoryModal({
  setNew,
  search,
  setSearch,
}: {
  search: string;
  setNew: Dispatch<SetStateAction<boolean>>;
  setSearch: Dispatch<SetStateAction<string>>;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    setName(ev.target.value);
  }

  function handleSubmit(ev: any) {
    ev.preventDefault();

    try {
      setLoading(true);
      createCategory(name).then((res: any) => {
        if (res.success) {
          setNew(true);
        }
      });

      setLoading(false);
      setName("");
      handleClose();
    } catch (error) {
      setLoading(false);
      setName("");
      handleClose();
    }
  }

  return (
    <div>
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
          <Add fontSize="large" className="text-[#0a0a0a]" />
        </IconButton>
      </Tooltip>

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
              <div className="w-full flex justify-center">
                <CircularProgress className="text-[#020202]" />
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-[#00a785] cursor-pointer hover:bg-[#009675] text-[#fff] transition-colors px-3 py-4 w-full rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
