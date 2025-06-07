 import React, { useState, useEffect } from "react";
 
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import http_request from "../../../http-request"; // Adjust path as needed
import BrandFeedbackForm from "./addBrandFeedback";
import { Close } from "@mui/icons-material";
import { ReactLoader } from "../components/common/Loading";
import { useUser } from "../components/UserContext";

const BrandFeedbackTable = ({ value }) => {

  const {user}=useUser()
  const [feedbacks, setFeedbacks] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refresh, setRefresh] = useState("");
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  useEffect(() => {
    getAllFeedback();
  }, [refresh]);
 const RefreshData = (data) => {
    setRefresh(data);
  };
  const getAllFeedback = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const role = user?.user?.role;
      const id = user?.user?._id;

      const endpoint =
        role === "ADMIN"
          ? `/getAllBrandFeedback`
          : role === "BRAND"
          ? `/getAllBrandFeedback`
          : role === "SERVICE"
          ? `/getFeedbackByServiceCenterId/${id}`
          : role === "TECHNICIAN"
          ? `/getFeedbackByTechnicianId/${id}`
          : `/getFeedbackByUserId/${id}`;

      const response = await http_request.get(endpoint);
      const { data } = response;

      // const enriched = data.map((item, i) => ({ ...item, i: i + 1 }));
      setFeedbacks(data);
      setSortedData(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

   const data1 = sortedData
    ?.filter((item) => {
      // If user is not ADMIN, filter feedbacks by brandId
      return user?.user?.role === "ADMIN" || item.brandId === user?.user?._id;
    })
    .map((item, index) => ({
      ...item,
      i: index + 1, // serial number
    }));

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortDirection === "asc";
    const newDirection = isAsc ? "desc" : "asc";
    setSortBy(field);
    setSortDirection(newDirection);

    const sorted = [...feedbacks].sort((a, b) => {
      const aField = a[field];
      const bField = b[field];

      if (aField < bField) return newDirection === "asc" ? -1 : 1;
      if (aField > bField) return newDirection === "asc" ? 1 : -1;
      return 0;
    });
    setSortedData(sorted);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = data1.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
 const handleEditModalClose = () => {
    setEditModalOpen(false);
  };


  const handleAdd = (row) => {
  
    setEditModalOpen(true);
  }
  return (
    <>
   <div className="flex justify-between items-center mb-3"> 
  <div className="font-bold text-2xl">Brand Feedback</div>

  <Button
    variant="contained"
    color="primary"
    onClick={() => handleAdd()} // Replace with your logic to open a form/dialog
  >
    Add Feedback
  </Button>
</div>

    {loading ? (
  <div className="flex justify-center items-center py-10">
     <ReactLoader />
  </div>
) : (
  <>
  <>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Brand Name</TableCell>
            <TableCell>Contact Person</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Installation</TableCell>
            <TableCell>Repair</TableCell>
            <TableCell>Spare Part Handling</TableCell>
            <TableCell>Reverse Logistics</TableCell>
            <TableCell>Technical Support</TableCell>
            <TableCell>Timeliness</TableCell>
            <TableCell>Customer Satisfaction</TableCell>
            <TableCell>Major Issues</TableCell>
            <TableCell>Unresolved Escalations</TableCell>
            <TableCell>Improvement Suggestions</TableCell>
            <TableCell>Additional Comments</TableCell>
            <TableCell>Authorized Person</TableCell>
            <TableCell>Signature</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow key={row._id} hover>
              <TableCell>{row?.brandName}</TableCell>
              <TableCell>{row?.contactPerson}</TableCell>
              <TableCell>{row?.designation}</TableCell>
              <TableCell>{row?.phone}</TableCell>
              <TableCell>{row?.email}</TableCell>
              <TableCell>{row?.serviceRatings?.installation}</TableCell>
              <TableCell>{row?.serviceRatings?.repair}</TableCell>
              <TableCell>{row?.serviceRatings?.sparePartHandling}</TableCell>
              <TableCell>{row?.serviceRatings?.reverseLogistics}</TableCell>
              <TableCell>{row?.serviceRatings?.technicalSupport}</TableCell>
              <TableCell>{row?.timeliness}</TableCell>
              <TableCell>{row?.customerSatisfaction}</TableCell>
              <TableCell>{row?.majorIssues}</TableCell>
              <TableCell>{row?.unresolvedEscalations}</TableCell>
              <TableCell>{row?.improvementSuggestions}</TableCell>
              <TableCell>{row?.additionalComments}</TableCell>
              <TableCell>{row?.authorizedPersonName}</TableCell>
              <TableCell>
                {row?.signature ? (
                  <img src={row.signature} alt="Signature" className="h-10 w-auto" />
                ) : (
                  "No Signature"
                )}
              </TableCell>
              <TableCell>{row?.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <TablePagination
      rowsPerPageOptions={[5, 10, 25]}
      component="div"
      count={sortedData.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    /></>
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
            <DialogTitle>{   "Add Feedback"}</DialogTitle>
            <IconButton
              aria-label="close"
              onClick={handleEditModalClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
            <DialogContent>
              <BrandFeedbackForm RefreshData={RefreshData} onClose={handleEditModalClose} />
            </DialogContent>
    
          </Dialog>
  </>
)}

    </>
  );
};

export default BrandFeedbackTable;
