"use client";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { Add } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  Tooltip,
  CircularProgress,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";

import { useEffect, useState } from "react";
import { createCategory, getCategories } from "@/functions/category";
import { message } from "antd";
import FlexBetween from "@/utils/FlexBetween";
import { addProduct } from "@/functions/products";

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

export default function ProductModal() {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  let initialState = {
    name: "",

    category: "",
    price: "",

    cost: "",

    minCount: "",
  };
  const [values, setValues] = useState(initialState);
  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
  }, []);
  function handleChange(ev) {
    setValues({ ...values, [ev.target.name]: ev.target.value });
    console.log(values);
  }

  function handleSubmit(ev) {
    ev.preventDefault();

    try {
      setLoading(true);
      addProduct(values).then((res) => {
        if (res.success) {
          message.success(`${res.message.name} created!`);
          // setNew(true);
        }
      });

      setLoading(false);
      setValues(initialState);
      handleClose();
    } catch (error) {
      message.error(res.message);
      setLoading(false);
      setValues(initialState);
      handleClose();
    }
  }

  return (
    <div>
      <FlexBetween className="gap-[1rem]">
        <Tooltip title="Add product">
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
              Add product
            </Typography>
            <TextField
              label="Name"
              value={values.name}
              name="name"
              onChange={handleChange}
              className="w-full"
            />

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={values.category}
                label="Category"
                name="category"
                onChange={handleChange}
              >
                {categories?.length > 0 &&
                  categories.map((cat) => {
                    return (
                      <MenuItem value={cat._id} key={cat.slug}>
                        {cat.name}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              name="price"
              value={values.price}
              onChange={handleChange}
              className="w-full"
            />

            <TextField
              label="Threshold value"
              name="minCount"
              value={values.minCount}
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
