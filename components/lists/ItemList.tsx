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



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0a0a0a",
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

export default function ItemList({
  categories,
  rows,
  total,
  page,
  setPage,
  handleEdit,
  handleDelete,
}: {
  categories: any[];
  rows: any[];
  total: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  handleEdit: (slug: string, item: any) => void;
  handleDelete: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [slug, setSlug] = useState<string>("");

  function handleChangePage(_: unknown, page: number) {
    setPage(page);
  }

  const isThresholdReached = (row: any): boolean =>
    row.minCount > row.inventory;

  return (
    <>
      {open && (
        <ItemUpdateModal
          categories={categories}
          slug={slug}
          open={open}
          handleClose={handleClose}
          handleEdit={handleEdit}
        />
      )}

      <Paper sx={{ width: "100%", height: 650, boxShadow: 5, overflow: "hidden", borderRadius: 2 }}>
        <TableContainer sx={{ height: "100%", overflow: "auto" }}>
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Cost</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
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
                    bgcolor: isThresholdReached(row) ? "#f57d81" : "#e0ffc4",
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row._id}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>&#8377;{row.price}</TableCell>
                  <TableCell>&#8377;{row.cost}</TableCell>
                  <TableCell>{row.category.name}</TableCell>
                  <TableCell>{row.inventory}</TableCell>
                  <TableCell>{row.minCount}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          setSlug(row.slug);
                          handleOpen();
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(row.slug)}
                      >
                        <DeleteIcon />
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
