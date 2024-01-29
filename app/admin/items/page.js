"use client";

import ItemsDisplay from "@/components/datagrid/Items";
import ProductModal from "@/components/modal/ProductModal";
import { getCategories } from "@/functions/category";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FlexBetween from "@/utils/FlexBetween";
import Headers from "@/utils/Header";
import { useEffect, useState } from "react";

export default function ListsPage() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isFiletered, setIsFiltered] = useState(false);
  useEffect(() => {
    getCategories().then((res) => {
      console.log(res);
      setCategories(res);
    });
  }, []);

  return (
    <div className="w-full h-full">
      <FlexBetween className="px-4 py-3">
        <Headers
          text={"Products"}
          description={
            "Admin and employees can view,create,update and remove any product list..."
          }
          full={false}
        />
        <FlexBetween>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Filter
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={category}
              label="Filter product"
              onChange={(ev) => {
                setIsFiltered(true);
                setCategory(ev.target.value);
              }}
            >
              <MenuItem value={""} key={"all"}>
                All
              </MenuItem>
              {categories?.length &&
                categories.map((cat) => {
                  return (
                    <MenuItem value={cat._id} key={cat._id}>
                      {cat.name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <ProductModal />
        </FlexBetween>
      </FlexBetween>

      <div>
        <ItemsDisplay
          category={category}
          isFiletered={isFiletered}
          setIsFiltered={setIsFiltered}
        />
      </div>
    </div>
  );
}
