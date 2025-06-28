"use client";

import { Checkbox } from "@mui/material";
import {
  SetStateAction,
  Dispatch,
  ChangeEvent,
  useState,
  useEffect,
} from "react";

type InvoiceListObject = {
  [id: string]: any;
};

export default function ItemDisplay({
  item,
  list,
  setList,
  setTotal,
}: {
  item: any;
  list: InvoiceListObject;
  setList: Dispatch<SetStateAction<InvoiceListObject>>;
  setTotal: Dispatch<SetStateAction<number>>;
}) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
  setChecked(Boolean(list[item._id]));
}, [list, item._id]);

  console.log("List :", list);
  return (
    <div className="w-full py-3 flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">{item.name}</p>
        <p>{item._id}</p>
      </div>

      <div>
        <Checkbox
          sx={{
            color: "",
            "&.Mui-checked": {
              color: "#f2b10c",
            },
          }}
          checked={checked}
          onChange={(_, checked: boolean) => {
            if (checked) {
              setList({ ...list, [item._id]: 1 });
            } else {
              setList((currentState) => {
                const { [item._id]: _, ...restOfState } = currentState;
                setTotal((total) => total - Number(item.price * item.qty));
                return restOfState;
              });
            }

            setChecked(checked);
          }}
        />
      </div>
    </div>
  );
}
