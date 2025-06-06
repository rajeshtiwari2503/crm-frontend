"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle, Select, MenuItem, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, AssignmentTurnedIn, Close, Comment, Print, Search, SystemSecurityUpdate, Visibility } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import MatchedSparePartsModalButton from '@/app/components/MatchSparepartsModal';
import UpdateComplaintModal from '../UpdateComplaintModel';


const ScheduleComplaintList = (props) => {



  const [filterSer, setFilterSer] = useState("")


  const serviceCenter = filterSer === "" ? props?.serviceCenter : filterSer


  const complaint = props?.data;
  const userData = props?.userData


  // const filteredData = userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? complaint
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

  let filteredData = [];
  if (userData?.role === "ADMIN" && role === "BRAND" && brandId) {
    // Admin overriding to view a brand's complaints
    filteredData = complaint?.filter(item => item?.brandId === brandId);
  } else {
    switch (effectiveRole) {
      case "ADMIN":
      case "EMPLOYEE":
        filteredData = complaint;
        break;
      case "BRAND":
        filteredData = complaint?.filter(item => item?.brandId === userData._id);
        break;
      case "BRAND EMPLOYEE":
        filteredData = complaint?.filter(item => item?.brandId === userData.brandId);
        break;
      case "USER":
        filteredData = complaint?.filter(item => item?.userId === userData._id);
        break;
      case "SERVICE":
        filteredData = complaint?.filter(item => item?.assignServiceCenterId === userData._id);
        break;
      case "TECHNICIAN":
        filteredData = complaint?.filter(item => item?.technicianId === userData._id);
        break;
      case "DEALER":
        filteredData = complaint?.filter(item => item?.dealerId === userData._id);
        break;
      default:
        filteredData = [];
    }
  }
  const { register, handleSubmit, formState: { errors }, getValues, reset, setValue, watch } = useForm();
  const router = useRouter()


  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [assign, setAssign] = useState(false);
  const [status, setStatus] = useState(false);
  const [order, setOrder] = useState(false);
  const [updateCommm, setUpdateCommm] = useState(false);
  const [id, setId] = useState("");
  const [selectedService, setSelectedService] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);

  };

  const data = filteredData?.filter((item) => {
    const complaintId = item?.complaintId?.toLowerCase();
    const search = searchTerm.toLowerCase();

    // Handle the complaint ID format and general search terms
    return complaintId?.includes(search) ||
      item?._id.toLowerCase().includes(search) ||
      item?.phoneNumber?.includes(searchTerm);
  });


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
  const handleDelete = (id) => {
    setConfirmBoxView(true);
    setId(id)
  }

  const handleAdd = () => {
    router.push("/complaint/create")
  }

  const handleDetails = (id) => {
    router.push(`/complaint/details/${id}`)
  }

  const handleEdit = (id) => {
    router.push(`/complaint/edit/${id}`);
  };


  const handleAssignServiceCenter = async (id) => {
    setId(id);

    const filterCom = complaint?.find((f) => f?._id === id);

    if (!filterCom?.pincode) {
      console.log("Pincode not found in the complaint");
      return;
    }

    const targetPincode = filterCom?.pincode.trim(); // Trim the complaint pincode

    // const serviceCenter1 = props?.serviceCenter?.filter((f) => {
    //   if (Array.isArray(f?.pincodeSupported)) {

    //     return f.pincodeSupported.some((pincodeString) => {

    //       const supportedPincodes = pincodeString.split(',').map(p => p.trim());

    //       return supportedPincodes.includes(targetPincode);
    //     });
    //   }
    //   return false;
    // });
    const serviceCenter1 = props?.serviceCenter?.filter((center) => {
      // Ensure pincodeSupported is an array and check for alternative field names
      const pincodeList = center?.pincodeSupported || center?.postalCode || [];

      if (Array.isArray(pincodeList)) {
        return pincodeList.some((pincodeString) => {
          const supportedPincodes = pincodeString.split(',').map(p => p.trim());
          return supportedPincodes.includes(targetPincode);
        });
      }

      return false;
    });
    setFilterSer(serviceCenter1)
    // console.log(serviceCenter1, "Filtered service centers with matching pincode");

    if (serviceCenter1.length === 0) {
      console.log("No service centers found for the given pincode.");
    }

    setAssign(true);
  };





  const handleUpdateStatus = async (id) => {
    setId(id)
    setStatus(true)
  }
  const handleUpdateClose = () => {

    setStatus(false)
  }
  const handleOrderPart = async (id) => {
    // setId(id)
    // setValue("ticketID", id)
    // setOrder(true)
    router.push(`/inventory/order/request/${id}`);
  }
  const handleAssignClose = () => {

    setAssign(false)
  }

  const handleOrderClose = () => {

    setOrder(false)
  }
  const handleUpdateCommentClose = () => {

    setUpdateCommm(false)
  }
  const handleUpdatedCommm = (id) => {
    setId(id)
    setUpdateCommm(true)
  }
  const handleServiceChange = (event) => {
    // if (status === true) {
    //   setValue("status", event.target.value)
    //   // console.log(event.target.value);
    // }

    const selectedId = event.target.value;


    const selectedServiceCenter = serviceCenter.find(center => center._id === selectedId);
    setSelectedService(selectedId);

    // if (selectedServiceCenter?.serviceCenterType  === "Independent") {
    setValue('status', "ASSIGN");
    // } 

    setValue('assignServiceCenterId', selectedServiceCenter?._id);
    setValue('assignServiceCenter', selectedServiceCenter?.serviceCenterName);
    setValue('serviceCenterContact', selectedServiceCenter?.contact);
    setValue('assignServiceCenterTime', new Date());

  };

  const asignCenter = async () => {
    try {
      const data = getValues();
      setLoading(true);

      const reqdata = { empId: userData._id, empName: userData.name, status: data?.status, assignServiceCenterId: data?.assignServiceCenterId, serviceCenterContact: data?.serviceCenterContact, assignServiceCenter: data?.assignServiceCenter, assignServiceCenterTime: data?.assignServiceCenterTime }
      // console.log(reqdata);

      let response = await http_request.patch(`/editComplaint/${id}`, reqdata);

      let { data: responseData } = response;

      setAssign(false)
      setStatus(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
      setLoading(false);
      setSelectedService("")
      reset()
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const handleVerifyOtp = () => {
    if (enteredOtp === generatedOtp) {
      setOtpVerified(true);
      alert("OTP Verified!");
    } else {
      alert("Invalid OTP");
    }
  };

  const compStatus = watch("status");

  const sendOTP = async (id) => {
    try {
      const response = await http_request.post("/send-otp", { complaintId: id });
      const { data } = response;
      if (response.data.success) {
        setGeneratedOtp(data?.otp);
        setOtpSent(true);
        ToastMessage({ status: true, msg: "OTP sent successfully!" })

      } else {
        console.log("Failed to send OTP. Please try again.");
        ToastMessage({ status: false, msg: "Failed to send OTP. Please try again." })
      }
    } catch (error) {
      console.log("Error sending OTP: " + error.response?.data?.message || error.message);
    }
  };
  const onSubmit = async (data) => {

    if (userData?.role === "SERVICE" && data?.status === "FINAL VERIFICATION" && !otpVerified) {
      alert("Please verify OTP before submitting.");
      return;
    }
    try {
      setLoading(true);


      const reqdata = assign === true ? { empId: userData._id, empName: userData.name, status: "ASSIGN", assignServiceCenterId: data?.assignServiceCenterId, assignServiceCenter: data?.assignServiceCenter, serviceCenterContact: data?.serviceCenterContact, assignServiceCenterTime: data?.assignServiceCenterTime } : { status: data?.status, empId: userData._id, empName: userData.name }
      // console.log(reqdata);

      let response = await http_request.patch(`/editComplaint/${id}`, reqdata);
      if (data?.comments) {
        updateComment({ comments: data?.comments })
      }
      let { data: responseData } = response;

      setAssign(false)
      setStatus(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
      setLoading(false);
      reset()
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };
  const partOrder = async (data) => {
    try {
      setLoading(true);

      let response = await http_request.post(`/addOrder`, data);
      let { data: responseData } = response;
      setOrder(false)
      props?.RefreshData(responseData)
      reset()
      ToastMessage(responseData);
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };
  const updateComment = async (data) => {
    try {
      setLoading(true);

      const sndStatusReq = { sndStatus: data.comments, empId: userData._id, empName: userData.name }
      const response = await http_request.patch(`/updateComplaintComments/${id}`,
        sndStatusReq
      );
      let { data: responseData } = response;
      setUpdateCommm(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
      setLoading(false);
      reset()
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };
  const preStatus = ["In Progress", "Part Pending", "Completed"]
  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Schedule Upcomming Service Information</div>
        {userData?.role === "SERVICE" || userData?.role === "TECHNICIAN" ?
          ""
          :
          <div onClick={handleAdd} className="flex cursor-pointer rounded-lg p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <Add style={{ color: "white" }} />
            <div className=' ml-2 '>Add Service Request</div>
          </div>
        }
      </div>
      <div className="flex items-center mb-3">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by ID"
          value={searchTerm}
          onChange={handleSearch}
          className="ml-2 border border-gray-300 rounded-lg py-2 px-3 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      {!data?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> Data not available !</div>
        :
        <>

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
                      <div className="flex items-center space-x-2">
                        {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ?
                          <div
                            onClick={() => handleUpdateStatus(row?._id)}
                            className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                          >
                            <SystemSecurityUpdate />
                          </div>
                          : userData?.role === "SERVICE" || userData?.role === "TECHNICIAN" ?
                            <UpdateComplaintModal complaintId={row?._id}    RefreshData={  props?.RefreshData} />
                            :
                            ""}

                        {userData?.role === "SERVICE" || userData?.role === "TECHNICIAN" ?
                          <div
                            onClick={() => handleOrderPart(row?._id)}
                            className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                          >
                            Order Part
                          </div>
                          : ""}
                        {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" || userData?.role === "BRAND" && userData?.brandSaas === "YES" ?
                          <div
                            onClick={() => handleAssignServiceCenter(row?._id)}
                            className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                          >
                            <AssignmentTurnedIn />
                          </div>
                          : ""}
                        {(userData?.role === "ADMIN" || userData?.role === "EMPLOYEE") &&
                          (row?.status === "PENDING" || row?.status === "ASIGN" || row?.status === "PART PENDING" || row?.status === "IN PROGRESS") ? (
                          <div
                            onClick={() => {
                              // Debugging
                              handleUpdatedCommm(row?._id);
                            }}
                            className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                          >
                            <Comment />
                          </div>
                        ) : null}

                        {/* <IconButton aria-label="view" onClick={() => handleDetails(row?._id)}>
                          <Visibility color="primary" />
                        
                        </IconButton> */}
                        {userData?.role === "SERVICE" || userData?.role === "EMPLOYEE" || userData?.role === "ADMIN" ?
                          <div>
                            <MatchedSparePartsModalButton complaintId={row?._id} />

                          </div>
                          : ""}
                        <div
                          onClick={() => handleDetails(row?._id)}
                          className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                        >
                          <Visibility />
                        </div>
                        {userData?.role === "ADMIN" ?
                          <>
                            <IconButton aria-label="edit" onClick={() => handleEdit(row?._id)}>
                              <EditIcon color="success" />
                            </IconButton>

                            <IconButton aria-label="delete" onClick={() => handleDelete(row?._id)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </>
                          : ""}
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
        </>}
      <Dialog open={order} onClose={handleOrderClose}>
        <DialogTitle> Part Order</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleOrderClose}
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
          <form onSubmit={handleSubmit(partOrder)} className="max-w-lg mx-auto grid grid-cols-1 gap-3 md:grid-cols-2  bg-white shadow-md rounded-md">

            <div>
              <label className="block text-gray-700  ">Ticket ID</label>
              <input {...register('ticketID')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.ticketID && <p className="text-red-500 text-sm mt-1">{errors.ticketID.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700  ">Part Name</label>
              <input {...register('partName')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.partName && <p className="text-red-500 text-sm mt-1">{errors.partName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Part Number/Model Number</label>
              <input {...register('partNumber')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.partNumber && <p className="text-red-500 text-sm mt-1">{errors.partNumber.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Quantity</label>
              <input {...register('quantity', { valueAsNumber: true })} type="number" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Priority Level</label>
              <select {...register('priorityLevel')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Standard">Standard</option>
                <option value="Urgent">Urgent</option>
              </select>
              {errors.priorityLevel && <p className="text-red-500 text-sm mt-1">{errors.priorityLevel.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Supplier Name</label>
              <input {...register('supplierInformation.name')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.supplierInformation?.name && <p className="text-red-500 text-sm mt-1">{errors.supplierInformation.name.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Supplier Contact</label>
              <input {...register('supplierInformation.contact')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.supplierInformation?.contact && <p className="text-red-500 text-sm mt-1">{errors.supplierInformation.contact.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Supplier Address</label>
              <input {...register('supplierInformation.address')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.supplierInformation?.address && <p className="text-red-500 text-sm mt-1">{errors.supplierInformation.address.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Order Date</label>
              <input {...register('orderDate')} type="date" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" defaultValue={new Date().toISOString().substr(0, 10)} />
              {errors.orderDate && <p className="text-red-500 text-sm mt-1">{errors.orderDate.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Expected Delivery Date</label>
              <input {...register('expectedDeliveryDate')} type="date" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              {errors.expectedDeliveryDate && <p className="text-red-500 text-sm mt-1">{errors.expectedDeliveryDate.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Shipping Method</label>
              <select {...register('shippingMethod')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="Standard">Standard</option>
                <option value="Express">Express</option>
              </select>
              {errors.shippingMethod && <p className="text-red-500 text-sm mt-1">{errors.shippingMethod.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 ">Comments/Notes</label>
              <textarea {...register('comments')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
            </div>

            {/* <div>
              <label className="block text-gray-700 ">Attachments</label>
              <input {...register('attachments')} type="file" className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" multiple />
              {errors.attachments && <p className="text-red-500 text-sm mt-1">{errors.attachments.message}</p>}
            </div> */}


            <button type="submit" disabled={loading} className="rounded-md p-2 cursor-pointer bg-[#09090b] text-white hover:bg-[#ffffff] hover:text-black" >Submit</button>

          </form>

        </DialogContent>

      </Dialog>
      <Dialog open={updateCommm} onClose={handleUpdateCommentClose}>
        <DialogTitle> Update</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleUpdateCommentClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent style={{ width: "350px" }}>
          <form onSubmit={handleSubmit(updateComment)} className="max-w-lg mx-auto grid grid-cols-1 gap-3   bg-white shadow-md rounded-md">

            <div>
              <label className="block text-gray-700 ">Comments/Notes</label>
              <textarea {...register('comments')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
            </div>

            {/* <div>
              <label className="block text-gray-700 ">Attachments</label>
              <input {...register('attachments')} type="file" className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" multiple />
              {errors.attachments && <p className="text-red-500 text-sm mt-1">{errors.attachments.message}</p>}
            </div> */}

            <button type="submit" disabled={loading} className="rounded-lg p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" >Submit Comments</button>

          </form>

        </DialogContent>

      </Dialog>
      <Dialog open={assign} onClose={handleAssignClose}>
        <DialogTitle>  Assign Service Center</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleAssignClose}
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
          <form onSubmit={handleSubmit(asignCenter)}>
            <div className='w-[350px] mb-5'>
              <label id="service-center-label" className="block text-sm font-medium text-white ">
                Assign  Service Center
              </label>

              <select
                id="service-center-label"
                value={selectedService}
                onChange={handleServiceChange}
                className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>Select Service Center</option>
                {serviceCenter?.map((center) => (
                  <option key={center.id} value={center._id}>
                    {center.serviceCenterName}
                  </option>
                ))}
              </select>

            </div>

            <button type="submit" disabled={loading} onClick={() => asignCenter()} className="rounded-lg w-full p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"> Assign   Service Center</button>

            {/* <Button onClick={handleSubmit(onSubmit)} variant="outlined" className='mt-5 hover:bg-[#09090b] hover:text-white' color="success" type="submit">
              Assign   Service Center
            </Button> */}
          </form>
        </DialogContent>

      </Dialog>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='w-[350px] mb-5'>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="IN PROGRESS">In Progress</option>
                <option value="PART PENDING">Awaiting Parts</option>
                {/* <option value="ONHOLD">On Hold</option> */}
                <option value="FINAL VERIFICATION">Completed</option>
                <option value="CANCELED">Canceled</option>
              </select>
            </div>
            <div className='mb-6'>
              <label className="block text-gray-700">Comments/Notes</label>
              <textarea
                {...register('comments', {
                  required: 'Comments are required',
                  minLength: { value: 10, message: 'Comments must be at least 10 characters' },
                  maxLength: { value: 500, message: 'Comments cannot exceed 500 characters' }
                })}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
              {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
            </div>
            {userData?.role === "SERVICE" && compStatus === "FINAL VERIFICATION" && (
              <div className="mb-4">
                {!otpSent ? (
                  <button type="button" onClick={() => sendOTP(id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                    Send OTP
                  </button>
                ) : !otpVerified ? (
                  <>
                    <div className="mt-4">
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md w-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md"
                    >
                      Verify OTP
                    </button>
                  </>
                ) : (
                  <p className="text-green-600 mt-2">OTP Verified ✅</p>
                )}
              </div>
            )}
            <div>
              <button type="submit"
                disabled={userData?.role === "SERVICE" && compStatus === "FINAL VERIFICATION" && !otpVerified || loading} className="rounded-lg p-3 mt-5 w-full border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                Submit
              </button>
            </div>
          </form>
        </DialogContent>

      </Dialog>

      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
    </div>
  );
};

export default ScheduleComplaintList;

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
