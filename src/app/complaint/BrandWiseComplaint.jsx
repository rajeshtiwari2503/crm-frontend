import React, { useEffect, useState } from "react";
import http_request from '.././../../http-request'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Typography,
} from "@mui/material";

const BrandWiseComplaintList = ({brandData}) => {
   const data=brandData;
   
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("TOTAL");
 

  // Sorting Function
  const handleSortRequest = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData =  data

  // Pagination
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
// console.log("sortedData",sortedData);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 1 }}>
    <Typography variant="h6" sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }} gutterBottom>
      Brand Wise Complaint 
    </Typography>
    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: "#09090b"  }}>
          <TableRow>
            {[
                  { label: "Brand", key: "productBrand" },
                  { label: "T", key: "TOTAL" },
                  { label: "P ", key: "PENDING" },
                  { label: "I.P. ", key: "INPROGRESS" },
                  { label: "P.P. ", key: "PART_PENDING" },
                  { label: "A ", key: "ASSIGN" },
                  { label: "C", key: "CANCEL" },
                 
                  { label: "F.V. ", key: "FINAL_VERIFICATION" },
                  { label: "Close", key: "COMPLETE" },
            ].map(({ label, key }) => (
              <TableCell key={key}   sx={{
                fontSize: 12,
                padding: "4px",
                color: "white", // White text for all header cells
                transition: "background-color 0.3s, color 0.3s",
              }}>
                <TableSortLabel
                  active={orderBy === key}
                  direction={orderBy === key ? order : "asc"}
                  onClick={() => handleSortRequest(key)}
                  sx={{
                    fontSize: 12,
                    color: "white !important", // White text
                    "& .MuiTableSortLabel-icon": {
                      color: "white !important", // White sort arrow
                    },
                  }}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
            <TableRow key={index}>
                 <TableCell sx={{ fontSize: 12, padding: "4px"  }}>{item.productBrand || "N/A"}</TableCell> 
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.TOTAL || 0}</TableCell>
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.PENDING || 0}</TableCell>
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.INPROGRESS || 0}</TableCell>
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.PART_PENDING || 0}</TableCell>
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.ASSIGN || 0}</TableCell>
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.CANCEL || 0}</TableCell>
             
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.FINAL_VERIFICATION || 0}</TableCell>
              <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.COMPLETE || 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      rowsPerPageOptions={[5, 10, 20]}
      component="div"
      count={data.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      sx={{ fontSize: 12 }}
    />
  </Paper>
);
};

export default BrandWiseComplaintList;
