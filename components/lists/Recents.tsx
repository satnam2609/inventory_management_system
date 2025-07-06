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
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function Recents({ rows }: { rows: any[] }) {
  const theme = useTheme();
  const isLaptop = useMediaQuery(theme.breakpoints.down("lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const dynamicHeight = isLaptop ? 280 : 379;

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#053625",
    color: "#ededed",
    fontSize: "0.75rem", // base
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.875rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.75rem",
    [theme.breakpoints.up("sm")]: {
      fontSize: "0.875rem",
    },
    [theme.breakpoints.up("md")]: {
      fontSize: "1rem",
    },
  },
}));

  return (
    <Paper
      sx={{
        width: "100%",
        height: dynamicHeight,
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableContainer
        sx={{
          height: "100%",
          overflowY: "auto",
        }}
      >
        <Table stickyHeader aria-label="recent transactions table">
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
              <TableRow key={row._id}>
                <TableCell>{row._id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>&#8377;{row.cost}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{row.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
