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

type Item = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  cost: number;
  minCount: number;
  inventory: number;
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
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleChangePage(_: unknown, page: number) {
    setPage(page);
  }

  const isThresholdReached = (row: Item): boolean =>
    row.minCount > row.inventory;

  return (
    <>
      {id && (
        <OrderModal
          id={id}
          name={name}
          price={price}
          open={open}
          handleClose={handleClose}
          setFetch={setFetch}
        />
      )}

      
      <Paper sx={{ width: "100%", height: 650, boxShadow: 5, overflow: "hidden", borderRadius: 2 }}>
        <TableContainer sx={{ height: "100%", overflow: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="purchase table">
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
                  rowsPerPageOptions={[]}  
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
