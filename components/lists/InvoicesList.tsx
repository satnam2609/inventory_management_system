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
} from "@mui/material";

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

export default function InvoicesList({ rows }: { rows: any[] }) {
  return (
    <Paper
      sx={{
        width: "100%",
        height: 650,
        boxShadow: 5,
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <TableContainer sx={{ height: "100%", overflow: "auto" }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Grand Total</StyledTableCell>
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
    </Paper>
  );
}
