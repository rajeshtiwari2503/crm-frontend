import React, { useState } from "react";
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
} from "@mui/material";
import { Toaster } from "react-hot-toast";
import { ReactLoader } from "../components/common/Loading";

const RequestList = (props) => {
  const data = props?.data || [];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [activeTab, setActiveTab] = useState("messages");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const messages = data.filter((item) => item.name);
  const services = data.filter((item) => item.applianceType);
  const displayedData = activeTab === "messages" ? messages : services;
  const sortedData = stableSort(displayedData, getComparator(sortDirection, sortBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Toaster />
      <div className="font-bold text-2xl mb-4">Website Service Request Information</div>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-5">
        <div className="flex space-x-4 border-b pb-3">
          <button
            className={`px-4 py-2 text-lg font-semibold ${activeTab === "messages" ? "border-b-4 border-blue-500 text-blue-500" : "text-gray-600"}`}
            onClick={() => setActiveTab("messages")}
          >
            Messages
          </button>
          <button
            className={`px-4 py-2 text-lg font-semibold ${activeTab === "service" ? "border-b-4 border-blue-500 text-blue-500" : "text-gray-600"}`}
            onClick={() => setActiveTab("service")}
          >
            Service Requests
          </button>
        </div>
      </div>

      {!displayedData.length ? (
        <div className="h-[400px] flex justify-center items-center">
          <ReactLoader />
        </div>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {activeTab === "messages" ? (
                    <>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "name"}
                          direction={sortDirection}
                          onClick={() => handleSort("name")}
                        >
                          Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "createdAt"}
                          direction={sortDirection}
                          onClick={() => handleSort("createdAt")}
                        >
                          Created At
                        </TableSortLabel>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>Appliance Type</TableCell>
                      <TableCell>Service Type</TableCell>
                      <TableCell>Pincode</TableCell>
                      <TableCell>Contact Number</TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === "createdAt"}
                          direction={sortDirection}
                          onClick={() => handleSort("createdAt")}
                        >
                          Created At
                        </TableSortLabel>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow key={index} hover>
                    {activeTab === "messages" ? (
                      <>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.message}</TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>{row.applianceType}</TableCell>
                        <TableCell>{row.serviceType}</TableCell>
                        <TableCell>{row.pinCode}</TableCell>
                        <TableCell>{row.contactNumber}</TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={displayedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default RequestList;

function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}