"use client";

import { Add } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  styled,
  tableCellClasses,
  TableFooter,
  TablePagination,
} from "@mui/material";

import { Dispatch, SetStateAction, useState } from "react";
import OrderModal from "../modal/OrderModal";

type Item = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  cost: number;
  minCount: number;
  inventory:number;
};

export default function PurchaseList({
  rows,
  total,
  page,
  setPage,
  setFetch,
}: {
  rows: Item[];
  total: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setFetch: Dispatch<SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);
  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0a0a0a",
      color: "#ededed",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  function handleChangePage(_: unknown, page: number) {
    setPage(page);
  }

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const isThresholdReached = (row: any): boolean =>
    row.minCount > row.inventory;

  return (
    <>
      {id ? (
        <OrderModal
          id={id}
          name={name}
          price={price}
          open={open}
          handleClose={handleClose}
          setFetch={setFetch}
        />
      ) : (
        ""
      )}
      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Cost</StyledTableCell>
              <StyledTableCell>Inventory</StyledTableCell>
              <StyledTableCell>Threshold</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  bgcolor: isThresholdReached(row) ? "#ebcacb" : "#e0ffc4",
                }}
              >
                <TableCell component="th" scope="row">
                  {row._id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>${row.price}</TableCell>
                <TableCell>${row.cost}</TableCell>
                <TableCell>{row.inventory}</TableCell>
                <TableCell>{row.minCount}</TableCell>
                <TableCell>
                  <Tooltip title="Purchase">
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        setId(row._id);
                        setName(row.name);
                        setPrice(row.cost);
                        handleOpen();
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                count={total}
                rowsPerPage={8}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]} // removes dropdown
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
