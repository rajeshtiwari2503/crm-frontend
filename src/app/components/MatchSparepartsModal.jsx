 "use client";

import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  Card,
  CardMedia,
  Grid,
  CircularProgress,
} from "@mui/material";
import http_request from "../../../http-request"; // Adjust this path as needed

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const MatchedSparePartsModalButton = ({ complaintId }) => {
  const [open, setOpen] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [matchedSpareParts, setMatchedSpareParts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    fetchComplaintAndParts();
  };

  const handleClose = () => {
    setOpen(false);
    setMatchedSpareParts([]);
    setComplaint(null);
    setLoading(false);
  };

  const fetchComplaintAndParts = async () => {
    setLoading(true);
    try {
      const complaintRes = await http_request.get(`/getComplaintById/${complaintId}`);
      const complaintData = complaintRes.data;
      setComplaint(complaintData);

      const partsRes = await http_request.get("/getAllSparepart");
      const parts = partsRes.data || [];

      const matched = parts.filter(part =>
        part.products?.some(product => product.productId === complaintData?.productId)
      );
      setMatchedSpareParts(matched);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
        onClick={handleOpen}
      >
        View SpareParts
      </div>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Matched Spare Parts
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : matchedSpareParts.length === 0 ? (
            <Typography>No spare parts matched for this complaint.</Typography>
          ) : (
            <Grid container spacing={2}>
              {matchedSpareParts.map((part, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography fontWeight="bold">Name: {part.partName}</Typography>
                    <Typography>Part No: {part.partNo}</Typography>
                    <Typography>Brand: {part.brandName}</Typography>

                    {part.images?.length > 0 && (
                     <Box mt={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
                     {part.images.map((img, i) => (
                       <CardMedia
                         key={i}
                         component="img"
                         image={img}
                         alt={`Part ${i}`}
                         sx={{
                           width: '100%',
                           maxWidth: '100%',
                           height: 'auto',
                           borderRadius: 2,
                           border: "1px solid #ccc",
                         }}
                       />
                     ))}
                   </Box>
                   
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box mt={3} textAlign="right">
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MatchedSparePartsModalButton;
