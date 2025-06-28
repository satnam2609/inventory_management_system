"use client";
import { getProduct } from "@/functions/item";
import {
  Backdrop,
  CircularProgress,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";

type Values = {
  name: string;
  category: string;
  price: number;
  cost: number;
  minCount: number;
};

export default function ItemUpdateModal({
  slug,
  categories,
  open,
  handleClose,
  handleEdit,
}: {
  slug: string;
  open: boolean;
  categories: any[];
  handleClose: () => void;
  handleEdit: (slug: string, value: Values) => void;
}) {
  const [values, setValues] = useState<Values>({
    name: "",
    category: "",
    price: 0,
    cost: 0,
    minCount: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    loadProduct()
      .then((res) => {
        if (res.success) {
          setValues(res.message);
        }
      })
      .catch((err) => console.log("Product fetching failed!"));

    setLoading(false);
  }, []);

  async function loadProduct() {
    const res = await getProduct(slug);

    return res;
  }

  if (loading) {
    return <div>Wait a minute...</div>;
  }

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();
    setValues({ ...values, [ev.target.name]: ev.target.value });
  }

  function handleSubmit(ev: any) {
    ev.preventDefault();
    handleEdit(slug, values);
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
    >
      <Fade in={open}>
        <div className="absolute translate-y-14 top-[18%] left-[45%] p-4 bg-[#ededed] rounded-xl shadow-2xl flex flex-col items-start gap-4 w-[20%]">
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Update an Item
          </Typography>
          <TextField
            label="Name"
            value={values.name}
            name="name"
            variant="standard"
            onChange={handleChange}
            className="w-full"
          />

          <FormControl sx={{ width: "100%" }} variant="standard">
            <InputLabel id="demo-customized-select-label">Category</InputLabel>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={values.category}
              name="category"
              onChange={(ev) =>
                setValues({ ...values, category: ev.target.value })
              }
            >
              {categories &&
                categories.map((category: any) => {
                  return (
                    <MenuItem value={category._id}>{category.name}</MenuItem>
                  );
                })}
            </Select>
          </FormControl>

          <TextField
            label="M.Price in &#8377;"
            value={values.price}
            name="price"
            onChange={handleChange}
            variant="standard"
            className="w-full"
            type="number"
          />
          <TextField
            label="R.Price in &#8377;"
            value={values.cost}
            name="cost"
            onChange={handleChange}
            variant="standard"
            className="w-full"
            type="number"
          />

          <TextField
            label="Threshold Count"
            value={values.minCount}
            name="minCount"
            onChange={handleChange}
            variant="standard"
            className="w-full"
            type="number"
          />

          {false ? (
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
  );
}
