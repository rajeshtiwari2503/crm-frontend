"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Close, Payment, Print, SystemSecurityUpdate, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '../../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const VerificationComplaintList = (props) => {



  const { register, handleSubmit, formState: { errors }, reset, getValues, setValue } = useForm();

  const router = useRouter()

  const complaint = props?.data;

  const userData = props?.userData

  const data = userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? complaint
    : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
      : userData?.role === "BRAND EMPLOYEE" ? complaint.filter((item) => item?.brandId === userData.brandId)
        : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
          : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
            : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
              : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
                : []


  const serviceCenter = props?.technicians
  const [status, setStatus] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [assignTech, setAssignTech] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [loading, setLoading] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const sortedData = stableSort(data, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteComplaint/${id}`);
      let { data } = response;
      setConfirmBoxView(false);
      props?.RefreshData(data)
      ToastMessage(data);
    } catch (err) {
      console.log(err);
    }
  }

  // const onSubmit = async (data) => {

  //   try {
  //     setLoading(true)
  //     let response = await http_request.patch(`/editComplaint/${id}`, data);
  //     let { data: responseData } = response;


  //     setStatus(false)
  //     setAssignTech(false)
  //     props?.RefreshData(responseData)
  //     ToastMessage(responseData);
  //     setLoading(false)
  //     reset()
  //   } catch (err) {
  //     setLoading(false)

  //     console.log(err);
  //   }
  // };

  const onSubmit = async ( ) => {
    const data = getValues();
  
    
   
    if (!data.kilometer || isNaN(data.kilometer) || Number(data.kilometer) < 0) {
      alert("Kilometer must be a positive number");
      return;
    }
  
    if (!data.paymentBrand) {
      alert("Payment Brand is required");
      return;
    }
  
    
  
    if (data.qrCode && data.qrCode.length > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(data.qrCode[0].type)) {
        alert("Invalid QR Code format. Please upload a JPEG or PNG image.");
        return;
      }
    }
  
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("status", data.status);
      formData.append("kilometer", data.kilometer);
      formData.append("paymentBrand", data.paymentBrand);
      formData.append("finalComments", data.finalComments);
      formData.append("empId", userData._id);
      formData.append("empName", userData.name);

      // Append the image file if it's selected
      if (data.partImage && data.partImage[0]) {
        formData.append("partImage", data.partImage[0]);
      }

      let response = await http_request.patch(`/updateFinalVerification/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }, // Important for file uploads
      });

      let { data: responseData } = response;

      setStatus(false);
      setAssignTech(false);
      props?.RefreshData(responseData);
      ToastMessage(responseData);
      setLoading(false);
      reset();
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };



  const handleDetails = (id) => {
    router.push(`/complaint/details/${id}`)
  }


  const handleUpdateStatus = async (row) => {
    setId(row?._id)

    const servicePincode = serviceCenter?.find((f1) => f1?._id === row?.assignServiceCenterId)
     
    
    handleCalculate(row?.pincode, servicePincode?.postalCode)
    setStatus(true)
  }

  const handleUpdateClose = () => {

    setStatus(false)
  }

  const handlePaymentStatus = async (row) => {
    setId(row?._id)
// console.log("row",row);

    if (row) {
      setValue("complaintId", row?._id)
      setValue("serviceCenterName", row?.assignServiceCenter)
      setValue("serviceCenterId", row?.assignServiceCenterId)
      setValue("contactNo", row?.serviceCenterContact)
      setValue("city", row?.district);
      setValue("address", (row?.serviceAddress ,row?.serviceLocation));
    }
    setPaymentStatus(true)
  }

  const handlePaymentClose = () => {

    setPaymentStatus(false)
  }

  const handlePayment = async () => {
    const data = getValues(); // Get all form values
    if (!data.serviceCenterName) {
      alert("Service Center Name is required");
      return;
    }
  
    if (!data.payment || isNaN(data.payment) || Number(data.payment) <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }
  
    if (!data.description) {
      alert("Description is required");
      return;
    }
  
    if (!data.contactNo || !/^\d{10}$/.test(data.contactNo)) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }
  
    if (!data.complaintId) {
      alert("Complaint ID is required");
      return;
    }
  
    if (!data.city) {
      alert("City is required");
      return;
    }
    if (!data.qrCode) {
      alert("QR code is required");
      return;
    }
    
    if (data.qrCode && data.qrCode.length > 0) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(data.qrCode[0].type)) {
        alert("Invalid QR Code format. Please upload a JPEG or PNG image.");
        return;
      }
    }
    // Create FormData
    const formData = new FormData();
    formData.append("serviceCenterName", data.serviceCenterName);
    formData.append("serviceCenterId", data.serviceCenterId);
    formData.append("payment", data.payment);
    formData.append("description", data.description);
    formData.append("contactNo", data.contactNo);
    formData.append("complaintId", data.complaintId);
    formData.append("city", data.city);
    formData.append("address", data.address);
  
    // Append QR code if exists
    if (data.qrCode && data.qrCode.length > 0) {
      formData.append("qrCode", data.qrCode[0]);
    }
  
    setLoading(true);
    try {
      const response = await http_request.post("/addServicePayment", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    
        reset(); // Reset form on success
    ToastMessage(response?.data)
      setPaymentStatus(false)
    } catch (error) {
      console.error("Error processing payment", error);
      setPaymentStatus(false)
      alert("There was an error processing the payment. Please try again.");
    } finally {
      setPaymentStatus(false)
      setLoading(false);
    }
  };
  

  const [distance, setDistance] = useState(null);
  const [error, setError] = useState("");

  const getCoordinates = async (pincode) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: pincode,
            region: "in", // Adding region bias for India
            key: "AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k", // Replace with your API key
          },
        }
      );

      console.log(response.data); // Debugging: log the full response

      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        throw new Error(`No results found for pincode: ${pincode}`);
      }
    } catch (err) {
      console.error(`Error fetching coordinates for ${pincode}:`, err.message);
      throw new Error(`Unable to fetch coordinates for pincode: ${pincode}`);
    }
  };

  const calculateDistance = (coord1, coord2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const earthRadiusKm = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(coord2.lat - coord1.lat);
    const dLng = toRadians(coord2.lng - coord1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.lat)) *
      Math.cos(toRadians(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c; // Distance in kilometers
  };
  const handleCalculate = async (pincode1, pincode2) => {


    setError("");
    setDistance(null);

    if (!pincode1 || !pincode2) {
      setError("Please enter both pincodes.");
      return;
    }
    // console.log(pincode1,pincode2);

    try {
      setLoading(true)
      const coord1 = await getCoordinates(pincode1);
      const coord2 = await getCoordinates(pincode2);

      if (coord1 && coord2) {
        const calculatedDistance = calculateDistance(coord1, coord2);
        setDistance(calculatedDistance.toFixed(2)); // Round to 2 decimal places
        setValue("kilometer", calculatedDistance.toFixed(2));
        setLoading(false)

      } else {
        setLoading(false)

        setError("Unable to fetch coordinates for one or both pincodes.");
      }
    } catch (err) {
      setLoading(false)

      setError(err.message);
    }
  };



  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Verification Service Information</div>
        {/* {props?.dashboard===true?""
        : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Complaint</div>
        </div>
        } */}
      </div>

      {!data?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
        :
        <div className='flex justify-center'>
          <div className=' md:w-full w-[260px]'>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === '_id'}
                      direction={sortDirection}
                      onClick={() => handleSort('_id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === '_id'}
                      direction={sortDirection}
                      onClick={() => handleSort('_id')}
                    >
                      Complaint Id
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'fullName'}
                      direction={sortDirection}
                      onClick={() => handleSort('fullName')}
                    >
                      Customer Name
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'emailAddress'}
                      direction={sortDirection}
                      onClick={() => handleSort('emailAddress')}
                    >
                      Customer Email
                    </TableSortLabel>
                  </TableCell> */}
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'district'}
                      direction={sortDirection}
                      onClick={() => handleSort('district')}
                    >
                      City
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'serviceAddress'}
                      direction={sortDirection}
                      onClick={() => handleSort('serviceAddress')}
                    >
                      Service_Address
                    </TableSortLabel>
                  </TableCell> */}
                  {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'city'}
                      direction={sortDirection}
                      onClick={() => handleSort('city')}
                    >
                     City
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'state'}
                      direction={sortDirection}
                      onClick={() => handleSort('state')}
                    >
                     State
                    </TableSortLabel>
                  </TableCell> */}
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'customerMobile'}
                      direction={sortDirection}
                      onClick={() => handleSort('customerMobile')}
                    >
                      Contact No.
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'categoryName'}
                      direction={sortDirection}
                      onClick={() => handleSort('categoryName')}
                    >
                      Category Name
                    </TableSortLabel>
                  </TableCell> */}
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'productBrand'}
                      direction={sortDirection}
                      onClick={() => handleSort('productBrand')}
                    >
                      Product Brand
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'modelNo'}
                      direction={sortDirection}
                      onClick={() => handleSort('modelNo')}
                    >
                      Model No.
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'serialNo'}
                      direction={sortDirection}
                      onClick={() => handleSort('serialNo')}
                    >
                      Serial No.
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'issueType'}
                      direction={sortDirection}
                      onClick={() => handleSort('issueType')}
                    >
                      Issue Type
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'detailedDescription'}
                      direction={sortDirection}
                      onClick={() => handleSort('detailedDescription')}
                    >
                      Detailed Description
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'errorMessages'}
                      direction={sortDirection}
                      onClick={() => handleSort('errorMessages')}
                    >
                      Error Messages
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'technicianName'}
                      direction={sortDirection}
                      onClick={() => handleSort('technicianName')}
                    >
                      Assign Service Center
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'technicianName'}
                      direction={sortDirection}
                      onClick={() => handleSort('technicianName')}
                    >
                      Technician Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'technicianContact'}
                      direction={sortDirection}
                      onClick={() => handleSort('technicianContact')}
                    >
                      Technician Contact
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'technicianComments'}
                      direction={sortDirection}
                      onClick={() => handleSort('technicianComments')}
                    >
                      Technician Comments
                    </TableSortLabel>
                  </TableCell> */}
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'assignServiceCenter'}
                      direction={sortDirection}
                      onClick={() => handleSort('assignServiceCenter')}
                    >
                      Service Center
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'status'}
                      direction={sortDirection}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortDirection}
                      onClick={() => handleSort('createdAt')}
                    >
                      Created_At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row?.i} hover>
                    <TableCell>{row?.i}</TableCell>
                    <TableCell>{row?.complaintId}</TableCell>
                    <TableCell>{row?.fullName}</TableCell>
                    {/* <TableCell>{row?.emailAddress}</TableCell> */}
                    <TableCell>{row?.district}</TableCell>
                    {/* <TableCell>{row?.serviceAddress}</TableCell> */}
                    {/* <TableCell>{row?.state}</TableCell> */}
                    <TableCell>{row?.phoneNumber}</TableCell>
                    {/* <TableCell>{row?.categoryName}</TableCell> */}
                    <TableCell>
                      {String(row?.productBrand || "").length > 15
                        ? String(row?.productBrand).substring(0, 15) + "..."
                        : row?.productBrand}
                    </TableCell>

                    {/* <TableCell>{row?.modelNo}</TableCell>
                    <TableCell>{row?.serialNo}</TableCell>

                    <TableCell>{row?.issueType}</TableCell>
                    <TableCell>{row?.detailedDescription}</TableCell>
                    <TableCell>{row?.errorMessages}</TableCell>
                    <TableCell>{row?.assignServiceCenter}</TableCell>
                    <TableCell>{row?.assignTechnician}</TableCell>
                    <TableCell>{row?.technicianContact}</TableCell>
                    <TableCell>{row?.comments}</TableCell> */}
                    <TableCell>{row?.assignServiceCenter}</TableCell>
                    <TableCell>{row?.status}</TableCell>
                    <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="p-0">
                      <div className="flex items-center  space-x-1">
                        {/* <div
                          onClick={() => handleUpdateStatus(row?._id)}
                          className="rounded-md p-2 cursor-pointer bg-[#2e7d32] text-black hover:bg-[#2e7d32] hover:text-white"
                        >
                          Update Status
                        </div> */}
                        {userData?.role === "ADMIN" || userData?.role === "SERVICE" || userData?.role === "TECHNICIAN" ?
                          <div
                            onClick={() => handleUpdateStatus(row)}
                            className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                          >
                            <SystemSecurityUpdate />
                          </div>
                          : ""}

                        {/* {userData?.role === "SERVICE"  ?
                          <div
                            onClick={() => handleOrderPart(row?._id)}
                            className="rounded-md p-2 cursor-pointer bg-[#2e7d32] text-black hover:bg-[#2e7d32] hover:text-white"
                          >
                            Order Part
                          </div>
                          : ""}
                        {userData?.role === "ADMIN" ||userData?.role === "EMPLOYEE"||userData?.role === "SERVICE"  || userData?.role === "BRAND" &&userData?.brandSaas==="YES" ?
                          <div
                            onClick={() => handleAssignTechnician(row?._id)}
                            className="rounded-md p-2 cursor-pointer bg-[#2e7d32] text-black hover:bg-[#2e7d32] hover:text-white"
                          >
                            Assign Technician
                          </div>
                          : ""} */}
                        <div
                          onClick={() => handleDetails(row?._id)}
                          className="rounded-md p-2  cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                        >
                          <Visibility />
                        </div>
                         {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE"?
                      <div> {!props?.transactions.some(transaction => transaction.complaintId === row?._id) && (
                        <div
                          onClick={() => handlePaymentStatus(row)}
                          className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                        >
                          <Payment color="success" />
                        </div>
                      )}
                      </div>
                        :""}
                        {/* <IconButton aria-label="edit" onClick={() => handleEdit(row?._id)}>
                          <EditIcon color="success" />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={() => handleDelete(row?._id)}>
                          <DeleteIcon color="error" />
                        </IconButton> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
        </div>
        }
      <Dialog open={status} onClose={handleUpdateClose}>
        <DialogTitle>  Update Status</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleUpdateClose}
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
          {loading === true ?
            <div className='w-[400px] h-[400px] flex justify-center items-center'>
              <ReactLoader />
            </div>
            : <form onSubmit={handleSubmit(onSubmit)}>
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  {...register('status')}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >

                  {/* <option value="IN PROGRESS">In Progress</option>
            <option value="PART PENDING">Awaiting Parts</option> */}

                  <option value="COMPLETED">Final Close</option>
                  {/* <option value="CANCELED">Canceled</option> */}
                </select>
              </div>
              {/* Kilometer Field */}
              <div className="w-[350px] mb-5">
                <label className="block text-sm font-medium text-gray-700">Kilometer</label>
                <input
                  type="number"
                  {...register('kilometer')}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter kilometers"
                />
                {error && <p className="text-red-500 mt-4">{error}</p>}
                {distance && (
                  <p className="text-green-500 mt-4">
                    Distance: {distance} km
                  </p>
                )}
              </div>

              {/* Payment Field */}

              <div className="w-[350px] mb-5">
                <label className="block text-sm font-medium text-gray-700">Payment</label>
                <input
                  type="number"
                  {...register('paymentBrand', {
                    required: 'Payment is required',
                    min: {
                      value: 1,
                      message: 'Payment must be at least 1',
                    },
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter payment amount"
                />
                {errors.paymentBrand && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentBrand.message}</p>
                )}
              </div>
              {/* Final Comments Field */}
              <div className="w-[350px] mb-5">
                <label className="block text-sm font-medium text-gray-700">Final Comments</label>
                <textarea
                  {...register('finalComments', {
                    required: 'Final comments are required',
                    minLength: {
                      value: 10,
                      message: 'Comments must be at least 10 characters long',
                    },
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter your comments"
                  rows={4}
                ></textarea>
                {errors.finalComments && (
                  <p className="text-red-500 text-sm mt-1">{errors.finalComments.message}</p>
                )}
              </div>
              <div className="w-[350px] mb-5">
                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('partImage')}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 file:bg-indigo-500 file:text-white file:px-4 file:py-2 file:rounded-md"
                />

              </div>
              <div>
                {loading === true ?
                  <div className="rounded-lg w-full p-3 mt-3 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Submiting........
                  </div>
                  : <button type="button" onClick={()=>onSubmit()} disabled={loading} className="rounded-lg w-full  p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    Submit
                  </button>
                }
              </div>
            </form>
          }
        </DialogContent>

      </Dialog>
      <Dialog open={paymentStatus} onClose={handlePaymentClose}>
        <DialogTitle>Service Center Payment</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handlePaymentClose}
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
          {loading ? (
            <div className='w-[400px] h-[400px] flex justify-center items-center'>
              <ReactLoader />
            </div>
          ) : (
            <form onSubmit={handleSubmit(handlePayment)} >
              {/* Service Center Name */}
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">Service Center Name</label>
                <input
                  type="text"
                  {...register('serviceCenterName', {
                    required: 'Service Center Name is required',
                  })}
                  readOnly
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter service center name"
                />
                {errors.serviceCenterName && (
                  <p className="text-red-500 text-sm mt-1">{errors.serviceCenterName.message}</p>
                )}
              </div>

              {/* Payment */}
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">Payment</label>
                <input
                  type="text"
                  {...register('payment', {
                    required: 'Payment is required',
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message: 'Invalid payment amount',
                    },
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter payment amount"
                />
                {errors.payment && (
                  <p className="text-red-500 text-sm mt-1">{errors.payment.message}</p>
                )}
              </div>

              {/* Description */}
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters long',
                    },
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter description"

                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Contact Number */}
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="text"
                  {...register('contactNo', {
                    required: 'Contact number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Invalid phone number',
                    },
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter contact number"
                />
                {errors.contactNo && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNo.message}</p>
                )}
              </div>

              {/* Complaint ID */}
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">Complaint ID</label>
                <input
                  type="text"
                  {...register('complaintId', {
                    required: 'Complaint ID is required',
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter complaint ID"
                readOnly
                />
                {errors.complaintId && (
                  <p className="text-red-500 text-sm mt-1">{errors.complaintId.message}</p>
                )}
              </div>

              {/* City */}
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  {...register('city', {
                    required: 'City is required',
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter city"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              {/* Address */}
              <div className='w-[350px] mb-5'>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  {...register('address', {
                    required: 'Address is required',
                  })}
                  className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter address"

                />
                {/* {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )} */}
              </div>



              {/* QR Code Upload */}
              <div className="w-[350px] mb-5">
                <label className="block text-sm font-medium text-gray-700">Upload QR Code</label>
                <input
                  type="file"
                  accept="image/*"
                  {...register('qrCode', {
                    required: 'QR Code is required',
                  })}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 file:bg-indigo-500 file:text-white file:px-4 file:py-2 file:rounded-md"
                />
                {errors.qrCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.qrCode.message}</p>
                )}
              </div>

              <div>

                <button
                  type="submit"
                  disabled={loading}
                  onClick={() => handlePayment()}
                  className="rounded-lg w-full p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Payment Request"}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>



      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
    </div>
  );
};

export default VerificationComplaintList;

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
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
