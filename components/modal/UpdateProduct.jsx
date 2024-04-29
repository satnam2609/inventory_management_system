"use client";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";

import {
  TextField,
  CircularProgress,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";

import { useEffect, useState } from "react";
import { getCategories } from "@/functions/category";
import { message } from "antd";

import { updateProduct } from "@/functions/products";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  gap: "1rem",
};

export default function UpdateProductModal({
  open,
  setOpen,
  loading,
  setLoading,
  product,
  setNew,
}) {
  const [categories, setCategories] = useState([]);

  const handleClose = () => setOpen(false);

  let initialState = {
    name: "",

    initialInventory: "",
    purchasesDuringPeriod: "",
    category: "",
    price: "",
    minCount: "",
  };
  const [values, setValues] = useState({ ...product });
  useEffect(() => {
    getCategories().then((res) => {
      setCategories(res);
    });
  }, []);

  useEffect(() => {
    setValues({ ...values, ...product });
  }, [product]);

  function handleChange(ev) {
    setValues({ ...values, [ev.target.name]: ev.target.value });
    console.log(values);
  }

  function handleSubmit(ev) {
    ev.preventDefault();

    try {
      setLoading(true);
      updateProduct(values.slug, values).then((res) => {
        message.success(`${res.name} updated!`);
        setNew(true);
      });

      setLoading(false);
      setValues(initialState);
      handleClose();
    } catch (error) {
      message.error("Internal server error");
      setLoading(false);
      setValues(initialState);
      handleClose();
    }
  }

  return (
    <div className="">
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
              Update product
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
