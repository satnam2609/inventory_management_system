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

export default function Recents({ rows }: { rows: any[] }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [slug, setSlug] = useState<string>("");

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#053625",
      color: "#ededed",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  return (
    <TableContainer component={Paper} sx={{ width: "100%",height:"100%", boxShadow: 5,borderRadius:"10px" }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>

            <StyledTableCell>Cost</StyledTableCell>

            <StyledTableCell>Quantity</StyledTableCell>

            <StyledTableCell>Transaction Date</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell>{row.name}</TableCell>

              <TableCell>&#8377;{row.cost}</TableCell>

              <TableCell>{row.qty}</TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
