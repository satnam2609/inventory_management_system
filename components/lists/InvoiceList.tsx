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
  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0a0a0a",
      color: "#ededed",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

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
    <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 5 }}>
      <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Price</StyledTableCell>

            <StyledTableCell>Actions</StyledTableCell>
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
                    id="outlined-number"
                    label="Number"
                    type="number"
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
                    variant="outlined"
                    onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                      ev.preventDefault();
                      const newQty = parseInt(ev.target.value);
                      if (newQty> row.inventory){
                        alert("The current stock of this item is "+ row.inventory);
                        return;
                      }
                      setItemsObj((currentState) => {
                        const updatedState = { ...currentState };
                        updatedState[row._id] = newQty;
                        return updatedState;
                      });
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
