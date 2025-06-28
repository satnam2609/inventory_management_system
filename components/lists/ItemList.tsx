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

  const isThresholdReached = (row: any): boolean =>
    row.minCount > row.inventory;

  return (
    <>
      {/* Modal */}
      {open ? (
        <ItemUpdateModal
          categories={categories}
          slug={slug}
          open={open}
          handleClose={handleClose}
          handleEdit={handleEdit}
        />
      ) : (
        ""
      )}
      {/* Data grid */}

      <TableContainer component={Paper} sx={{ width: "100%", boxShadow: 5 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                rowsPerPageOptions={[]} // removes dropdown
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
