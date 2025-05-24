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
import { ReactLoader } from "../components/common/Loading";

const CityWiseComplaintList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("TOTAL");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setloading] = React.useState(false);

  useEffect(() => {
    fetchComplaintData();
  }, []);

  const fetchComplaintData = async () => {
    try {

      setloading(true)
      const response = await http_request.get("/getComplaintCountByCityState");
      setData(response.data.data);
      setloading(false)
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setloading(false)
    }
  };

  // Sorting Function
  const handleSortRequest = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const uniqueStates = [...new Set(data.map(item => item.state).filter(Boolean))];
  const uniqueCities = [...new Set(data.filter(item => selectedState ? item.state === selectedState : true).map(item => item._id.city).filter(Boolean))];


  const filteredData = data.filter(item => {
    const matchesState = selectedState ? item.state === selectedState : true;
    const matchesCity = selectedCity ? item._id.city === selectedCity : true;
    return matchesState && matchesCity;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[orderBy] || 0;
    const bValue = b[orderBy] || 0;
    return order === "asc" ? aValue - bValue : bValue - aValue;
  });




  // const sortedData=data
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
        Complaint Count by City & State
      </Typography>
      {loading === true ? (
        <div className="flex items-center justify-center h-[80vh]">
          <ReactLoader />
        </div>
      ) : <div className='md:w-full w-[260px]'>
        <div className="flex justify-between gap-4 p-2">
          <div className="w-full">
            <label className="text-sm font-semibold">State:</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedCity(""); // Reset city when state changes
              }}
              className="ml-2 border px-2 py-1 text-sm rounded"
            >
              <option value="">All</option>
              {uniqueStates.map((state, index) => (
                <option key={index} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="text-sm font-semibold">City:</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="ml-2 border px-2 py-1 text-sm rounded"
            >
              <option value="">All</option>
              {uniqueCities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        {!sortedData?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> Data not available !</div>
          : <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: "#09090b" }}>
                <TableRow>
                  {[
                    { label: "State", key: "state" },
                    { label: "City", key: "_id.city" },

                    { label: "T", key: "TOTAL" },
                    { label: "P ", key: "PENDING" },
                    { label: "I.P. ", key: "INPROGRESS" },
                    { label: "P.P. ", key: "PART_PENDING" },
                    { label: "C.S.P. ", key: "CUSTOMER_SIDE_PENDING" },
                    { label: "A ", key: "ASSIGN" },
                    { label: "C", key: "CANCEL" },

                    { label: "F.V. ", key: "FINAL_VERIFICATION" },
                    { label: "Close", key: "COMPLETE" },
                  ].map(({ label, key }) => (
                    <TableCell key={key} sx={{
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
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.state || "N/A"}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px", width: "200px" }}>{item._id.city || "N/A"}</TableCell>

                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.TOTAL || 0}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.PENDING || 0}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.INPROGRESS || 0}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.PART_PENDING || 0}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.CUSTOMER_SIDE_PENDING || 0}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.ASSIGN || 0}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.CANCEL || 0}</TableCell>

                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.FINAL_VERIFICATION || 0}</TableCell>
                    <TableCell sx={{ fontSize: 12, padding: "4px" }}>{item.COMPLETE || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        }
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredData?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ fontSize: 12 }}
        />
      </div>
      }
    </Paper>
  );
};

export default CityWiseComplaintList;
