"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
  TextField,
} from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from "react";

interface InvoiceListObject {
  [key: string]: any;
}

 
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0a0a0a",
    color: "#ededed",
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function InvoiceList({
  items,
  itemsObj,
  setItemsObj,
  setTotal,
}: {
  items: any[];
  itemsObj: InvoiceListObject;
  setItemsObj: Dispatch<SetStateAction<InvoiceListObject>>;
  setTotal: Dispatch<SetStateAction<number>>;
}) {
  const calculateTotal = () => {
    const total = items
      .filter((item) => itemsObj.hasOwnProperty(item._id))
      .reduce((sum, row) => {
        const price = Number(row.price) || 0;
        const qty = Number(itemsObj[row._id]) || 0;
        return sum + price * qty;
      }, 0);
    setTotal(total);
  };

  useEffect(() => calculateTotal(), [itemsObj]);

  return (
    <Paper sx={{ width: "100%", height: 490, boxShadow: 5, overflow: "hidden", borderRadius: 2 }}>
      <TableContainer sx={{ height: "100%", overflow: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="invoice table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .filter((item) => itemsObj.hasOwnProperty(item._id))
              .map((row) => (
                <TableRow
                  key={row._id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row._id}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>&#8377;{row.price}</TableCell>
                  <TableCell>
                    <TextField
                      id={`qty-${row._id}`}
                      label="Quantity"
                      type="number"
                      size="small"
                      fullWidth
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                        htmlInput: {
                          min: 1,
                          max: row.inventory,
                        },
                      }}
                      value={
                        Number.isNaN(itemsObj[row._id]) ||
                        itemsObj[row._id] === undefined ||
                        itemsObj[row._id] === null
                          ? ""
                          : itemsObj[row._id]
                      }
                      onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                        ev.preventDefault();
                        const newQty = parseInt(ev.target.value);
                        if (newQty > row.inventory) {
                          alert("The current stock of this item is " + row.inventory);
                          return;
                        }
                        setItemsObj((prev) => ({
                          ...prev,
                          [row._id]: newQty,
                        }));
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
