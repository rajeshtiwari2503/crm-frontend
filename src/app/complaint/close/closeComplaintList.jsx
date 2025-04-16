"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Close, Payment, Print, Search, Visibility } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import AddFeedback from '@/app/feedback/addFeedback';
import logo from "../../../../public/Logo.png"
import axios from 'axios';


const CloseComplaintList = (props) => {

  const { register, handleSubmit, formState: { errors }, reset, getValues,setValue } = useForm();

  const router = useRouter()
  const complaint = props?.data;
  const userData = props?.userData;

  // const data = userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? complaint
  //   : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
  //     : userData?.role === "BRAND EMPLOYEE" ? complaint.filter((item) => item?.brandId === userData.brandId)
  //       : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
  //         : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
  //           : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
  //             : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
  //               : []


  const searchParams = useSearchParams();
  const brandId = searchParams.get('brandId');
  const role = searchParams.get('role');

  const effectiveRole = role || userData?.role;

let data = [];
  if (userData?.role === "ADMIN" && role === "BRAND" && brandId) {
    // Admin overriding to view a brand's complaints
    data = complaint?.filter(item => item?.brandId === brandId);
  } else {
    switch (effectiveRole) {
      case "ADMIN":
      case "EMPLOYEE":
        data = complaint;
        break;
      case "BRAND":
        data = complaint?.filter(item => item?.brandId === userData._id);
        break;
      case "BRAND EMPLOYEE":
        data = complaint?.filter(item => item?.brandId === userData.brandId);
        break;
      case "USER":
        data = complaint?.filter(item => item?.userId === userData._id);
        break;
      case "SERVICE":
        data = complaint?.filter(item => item?.assignServiceCenterId === userData._id);
        break;
      case "TECHNICIAN":
        data = complaint?.filter(item => item?.technicianId === userData._id);
        break;
      case "DEALER":
        data = complaint?.filter(item => item?.dealerId === userData._id);
        break;
      default:
        data = [];
    }
  }


  const [status, setStatus] = useState(false);

  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
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

  // const fitData = data
  // ?.filter(f => f) // ✅ Filters out any falsy values
  // .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const dataSearch = data?.filter((item) => {
    const complaintId = item?._id?.toLowerCase();
    const search = searchTerm.toLowerCase();

    // Handle the complaint ID format and general search terms
    return complaintId?.includes(search) ||
    item?.complaintId?.toLowerCase().includes(search) ||
    item?.productBrand?.toLowerCase().includes(search) ||
    item?.productName?.toLowerCase().includes(search) ||
    item?.subCategoryName?.toLowerCase().includes(search) ||
    item?.categoryName?.toLowerCase().includes(search) ||
    item?.fullName?.toLowerCase().includes(search) ||
    item?.district?.toLowerCase().includes(search) ||
    item?.state?.toLowerCase().includes(search) ||
    item?.assignServiceCenter?.toLowerCase().includes(search) ||
    item?.phoneNumber?.includes(searchTerm)||
    item?.pincode?.includes(searchTerm);
  });
  const sortedData = stableSort(dataSearch, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



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
  const onSubmit = async (data) => {
    try {
      let response = await http_request.patch(`/editComplaint/${id}`, data);
      let { data: responseData } = response;

      setStatus(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = (id) => {
    setConfirmBoxView(true);
    setId(id)
  }

  const handleAdd = () => {
    router.push("/complaint/add")
  }

  const handleDetails = (id) => {
    router.push(`/complaint/details/${id}`)
  }

  const handleEdit = (id) => {
    router.push(`/complaint/edit/${id}`);
  };
  const handleUpdateStatus = async (row) => {
    setId(row)
    setStatus(true)
  }
  const handleUpdateClose = () => {

    setStatus(false)
  }
  const amount = 1;

  const userPayment = async (row) => {
    try {
      const userInfo = localStorage.getItem("user");
      const userData = JSON.parse(userInfo)

      let response = await http_request.post("/payment", { amount: +amount });
      let { data } = response;
      const options = {
        key: "rzp_live_4uXy7FSuag8Sap", // Enter the Key ID generated from the Dashboard
        amount: +amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Servsy", //your business name
        description: "Payment for order",
        image: "/Logo.png",
        order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (orderDetails) {
          try {

            let response = await axios.post("https://lybleycrmserver-production.up.railway.app/paymentVerificationForUser", { response: orderDetails, row, amount });
            let { data } = response;
            if (data?.status === true) {
              ToastMessage(data)
              props?.RefreshData(data)
            }

          } catch (err) {
            console.log(err);
          }
        },
        prefill: {
          name: userData?.user?.name, //your customer's name
          email: userData?.user?.email,
          contact: userData?.user?.contact
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          color: "#3399cc"
        }
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.log(err);
    }
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
      setValue("address", (row?.serviceAddress, row?.serviceLocation));
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
      props?.RefreshData(response?.data)
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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);

  };
  return (
    <div>

      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Close Service Information</div>
        {/* {props?.dashboard===true?""
        : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Complaint</div>
        </div>
        } */}
        <div className="flex items-center mb-3">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search  "
            value={searchTerm}
            onChange={handleSearch}
            className="ml-2 border border-gray-300 rounded-lg py-2 px-3 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
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
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'updatedAt'}
                        direction={sortDirection}
                        onClick={() => handleSort('updatedAt')}
                      >
                        Updated_At
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
                      <TableCell>{new Date(row?.updatedAt).toLocaleString()}</TableCell>
                      <TableCell className="p-0">
                        <div className="flex items-center space-x-2">
                          {userData?.role === "USER" ?
                            <>
                              <div
                                onClick={() => handleUpdateStatus(row)}
                                className="rounded-md p-2 cursor-pointer bg-[#2e7d32] text-black hover:bg-[#2e7d32] hover:text-white"
                              >
                                Give Feedback
                              </div>
                              {row?.payment === 0 ?
                                <div
                                  onClick={() => userPayment(row)}
                                  className="rounded-md p-2 cursor-pointer bg-[#007BFF] text-black hover:bg-[#007BFF] hover:text-white"
                                >
                                  Pay
                                </div>
                                : ""
                              }
                            </>
                            : ""}
                          {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ?
                            <div> {!props?.transactions.some(transaction => transaction.complaintId === row?._id) && (
                              <div
                                onClick={() => handlePaymentStatus(row)}
                                className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                              >
                                <Payment color="success" />
                              </div>
                            )}
                            </div>
                            : ""}
                          <div
                            onClick={() => handleDetails(row?._id)}
                            className="rounded-md p-2  cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                          >
                            <Visibility />
                          </div>
                          {/* <IconButton aria-label="print" onClick={() => handleDetails(row?._id)}>
                          <Print color="primary" />
                        </IconButton>
                        <IconButton aria-label="edit" onClick={() => handleEdit(row?._id)}>
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
              count={dataSearch?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </div>
      }
      <Dialog open={status} onClose={handleUpdateClose}>
        <DialogTitle>  ADD Feedback</DialogTitle>
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

          <AddFeedback complaints={id} onClose={handleUpdateClose} />
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

export default CloseComplaintList;

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
