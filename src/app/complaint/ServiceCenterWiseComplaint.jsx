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

const ServiceCenterWiseComplaintList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("TOTAL");

  useEffect(() => {
    fetchComplaintData();
  }, []);

  const fetchComplaintData = async () => {
    try {
      const response = await http_request.get("/getComplaintCountByServiceCenter");
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  // Sorting Function
  const handleSortRequest = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = data

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
      Service Center wise Complaint  
    </Typography>
    <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
      <Table size="small">
        <TableHead sx={{ backgroundColor: "#bae6fd" }}>
          <TableRow>
            {[
                  { label: " Service Center",  key: "_id.assignServiceCenter" },
              { label: "City", key: "city" },
            
              { label: "Total", key: "TOTAL" },
              { label: "Pending", key: "PENDING" },
              { label: "In Progress", key: "INPROGRESS" },
              { label: "Part Pending", key: "PART_PENDING" },
              { label: "Assigned", key: "ASSIGN" },
              { label: "Canceled", key: "CANCEL" },
             
              { label: "Final Verif.", key: "FINAL_VERIFICATION" },
              { label: "Completed", key: "COMPLETE" },
            ].map(({ label, key }) => (
              <TableCell key={key} sx={{ fontSize: 12, padding: "4px" }}>
                <TableSortLabel
                  active={orderBy === key}
                  direction={orderBy === key ? order : "asc"}
                  onClick={() => handleSortRequest(key)}
                  sx={{ fontSize: 12 }}
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
                 <TableCell sx={{ fontSize: 12, padding: "4px"  }}>{item?.assignServiceCenter || "N/A"}</TableCell>
              <TableCell sx={{ fontSize: 12, padding: "4px",width:"200px" }}>{item?.city || "N/A"}</TableCell>
             
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

export default ServiceCenterWiseComplaintList;
