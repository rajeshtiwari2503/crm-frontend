"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Close, Print, Search, SystemSecurityUpdate, Visibility } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import AddFeedback from '@/app/feedback/addFeedback';
import MatchedSparePartsModalButton from '@/app/components/MatchSparepartsModal';

const InProgressComplaintList = (props) => {

  const { register, handleSubmit, formState: { errors }, reset, setValue ,watch} = useForm();

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
      item?.phoneNumber?.includes(searchTerm) ||
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

  const updateComment = async (data) => {
    try {
      // console.log(id);
      // console.log(data);
      const sndStatusReq = { sndStatus: data.comments, empId: userData._id, empName: userData.name }
      const response = await http_request.patch(`/updateComplaintComments/${id}`,
        sndStatusReq);
      let { data: responseData } = response;
      // setUpdateCommm(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
      reset()
    } catch (err) {
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
      const reqdata = { comments: data?.comments, status: data?.status, empId: userData._id, empName: userData.name, }
      const formData = new FormData();
      Object.entries(reqdata).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // If there is an image, append it (example: "partPendingImage")
      if (data?.partPendingImage && data.partPendingImage[0]) {
        formData.append("partPendingImage", data.partPendingImage[0]); // Assuming file input
      }

      // Send the request using FormData
      let response = await http_request.patch(`/updateComplaintWithImage/${id}`, formData
      );
      if (data.comments) {
        updateComment({ comments: data?.comments })
      }
      let { data: responseData } = response;

      setStatus(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
      reset()
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
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);

  };
  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>In Progress Service Information</div>
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

      {!dataSearch?.length > 0 ? <div className='h-[400px] flex justify-center items-center'>  Data not available !</div>
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
                        <div className="flex items-center space-x-2">
                          {userData?.role === "USER" ?
                            <>
                              <div
                                // onClick={() => handleUpdateStatus(row)}
                                className="rounded-md p-2 cursor-pointer bg-[#2e7d32] text-black hover:bg-[#2e7d32] hover:text-white"
                              >
                                Give Feedback
                              </div>
                              <div
                                onClick={() => handleUpdateStatus(row)}
                                className="rounded-md p-2 cursor-pointer bg-[#007BFF] text-black hover:bg-[#007BFF] hover:text-white"
                              >
                                Pay
                              </div>
                            </>
                            : ""}
                          {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" || userData?.role === "SERVICE" && userData?.serviceCenterType === "Independent" || userData?.role === "TECHNICIAN" ?
                            <div
                              onClick={() => handleUpdateStatus(row?._id)}
                              className="rounded-md p-2  cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                            >
                              <SystemSecurityUpdate />
                            </div>
                            : ""}
                          {userData?.role === "SERVICE" || userData?.role === "EMPLOYEE" || userData?.role === "ADMIN" ?
                            <div>
                              <MatchedSparePartsModalButton complaintId={row?._id} />

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

          {/* <AddFeedback  complaints={id}  onClose={handleUpdateClose}/> */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='w-[350px] mb-5'>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {/* <option value="NEW">New</option> */}
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
            <div className="w-[350px] mb-5">
              <label className="block text-sm font-medium text-gray-700">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                {...register('partPendingImage'
                  // , {
                  // required: "Image is required",
                  // validate: {
                  //   isImage: (value) =>
                  //     value[0]?.type.startsWith("image/") || "Only image files are allowed",
                  //   fileSize: (value) =>
                  //     value[0]?.size < 2 * 1024 * 1024 || "File size must be under 2MB",
                  // },
                  // }
                )}
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 file:bg-indigo-500 file:text-white file:px-4 file:py-2 file:rounded-md"
              />
              {/* {errors.partPendingImage && (
                <p className="text-red-500 text-sm mt-1">{errors.partPendingImage.message}</p>
              )} */}
            </div>
            {userData?.role === "SERVICE" && compStatus === "FINAL VERIFICATION" && (
              <div className="mb-4">
                {!otpSent ? (
                  <button type="button" onClick={() => sendOTP(id)}  className="bg-blue-500 text-white px-4 py-2 rounded-md">
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
                disabled={userData?.role === "SERVICE" && compStatus === "FINAL VERIFICATION" && !otpVerified}
               className="rounded-lg w-full p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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

export default InProgressComplaintList;

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
