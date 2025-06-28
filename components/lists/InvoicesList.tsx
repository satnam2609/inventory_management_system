"use client";

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
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Dispatch, SetStateAction, useState } from "react";
import ItemUpdateModal from "../modal/ItemUpdateModal";

export default function InvoicesList({ rows }: { rows: any[] }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [slug, setSlug] = useState<string>("");

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#0a0a0a",
      color: "#ededed",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 5 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Customer</StyledTableCell>
            <StyledTableCell>Grand total</StyledTableCell>
            <StyledTableCell>Transaction Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row._id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell>{row.customer}</TableCell>
              <TableCell>&#8377;{row.grandTotal}</TableCell>

              <TableCell>{row.createdAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
