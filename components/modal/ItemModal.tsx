"use client";

import { addProduct } from "@/functions/item";
import { Add } from "@mui/icons-material";
import {
  Backdrop,
  CircularProgress,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type Values = {
  name: string;
  category: string;
  price: number;
  cost: number;
  minCount: number;
};

export default function ItemModal({
  search,
  setSearch,
  setNew,
  categories,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  setNew: Dispatch<SetStateAction<boolean>>;
  categories: any[];
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [loading, setLoading] = useState(false);

  let initialState: Values = {
    name: "",
    category: "",
    price: 0,
    cost: 0,
    minCount: 0,
  };

  const [values, setValues] = useState<Values>(initialState);

  function handleChange(ev: ChangeEvent<HTMLInputElement>) {
    ev.preventDefault();
    setValues({ ...values, [ev.target.name]: ev.target.value });
  }

  function handleSubmit(ev: any) {
    ev.preventDefault();

    try {
      setLoading(true);
      addProduct(values).then((res) => {
        if (res.success) {
          setNew(true);
        }
      });

      setLoading(false);
      setValues(initialState);
      handleClose();
    } catch (error) {
      setLoading(false);
      setValues(initialState);
      handleClose();
    }
  }

  return (
    <div className="flex items-center justify-between">
      <TextField
        variant="standard"
        label="Search for an item"
        value={search}
        onChange={(ev) => {
          setSearch(ev.target.value);
          console.log(search);
        }}
      />

      <Tooltip title="Add Item">
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
          <div className="absolute translate-y-14 top-[18%] left-[85%] px-6 py-4 bg-[#ededed] rounded-xl shadow-2xl flex flex-col items-start gap-4">
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Create new Item
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
              <InputLabel id="demo-customized-select-label">
                Category
              </InputLabel>
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
