"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, AssignmentTurnedIn, Close, DepartureBoard, Print, Search, SystemSecurityUpdate, Visibility } from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '../../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import MatchedSparePartsModalButton from '@/app/components/MatchSparepartsModal';

const PendingComplaintList = (props) => {

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const router = useRouter()

  const complaint = props?.data;

  const userData = props?.userData
const searchParams = useSearchParams();
const brandId = searchParams.get('brandId');
const role = searchParams.get('role');

      useEffect(() => {
     
       
  }, [searchParams])

  // console.log("brandId",brandId);
  // console.log("role",role);
  
  // const data = userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? complaint
  //   : userData?.role === "BRAND" ? complaint?.filter((item) => item?.brandId === userData._id)
  //     : userData?.role === "BRAND EMPLOYEE" ? complaint?.filter((item) => item?.brandId === userData.brandId)
  //       : userData?.role === "USER" ? complaint?.filter((item) => item?.userId === userData._id)
  //         : userData?.role === "SERVICE" ? complaint?.filter((item) => item?.assignServiceCenterId === userData._id)
  //           : userData?.role === "TECHNICIAN" ? complaint?.filter((item) => item?.technicianId === userData._id)
  //             : userData?.role === "DEALER" ? complaint?.filter((item) => item?.dealerId === userData._id)
  //               : []


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

  const technician = props?.technicians
  const [status, setStatus] = useState(false);
  const [order, setOrder] = useState(false);
  const [assignTech, setAssignTech] = useState(false);
  const [techData, setAssignData] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [selectedSparepart, setSelectedSparepart] = useState('');
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
      item?.assignServiceCenter?.toLowerCase().includes(search) ||
      item?.state?.toLowerCase().includes(search) ||
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
  const handleTechnicianChange = (event) => {

    const selectedId = event.target.value;

    const selectedTechnician = technician.find(center => center._id === selectedId);
    setSelectedTechnician(selectedTechnician);
    setValue('status', "ASSIGN");
    setValue('technicianId', selectedTechnician?._id);
    setValue('assignTechnician', selectedTechnician?.name);
    setValue('technicianContact', selectedTechnician?.contact);
    setValue('assignTechnicianTime', new Date());
    setValue('srerviceCenterResponseTime', new Date());

  };

  const updateComment = async (data) => {
    try {
      // console.log(id);
      // console.log(data);
      const sndStatusReq = { sndStatus: data.comments, empId: userData._id, empName: userData.name }
      const response = await http_request.patch(`/updateComplaintComments/${id}`,
        sndStatusReq
      );
      let { data: responseData } = response;
      // setUpdateCommm(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
      reset()
    } catch (err) {
      console.log(err);
    }
  };
  const onSubmit = async (data) => {
    try {
      // const reqdata = assignTech === true ? {
      //   empId: userData._id, empName: userData.name,
      //   status: data?.status, technicianId: data?.technicianId, assignTechnician: data?.assignTechnician,
      //   assignTechnicianTime: data?.assignTechnicianTime, srerviceCenterResponseTime: data?.srerviceCenterResponseTime, technicianContact: data?.technicianContact
      // } : { status: data?.status, empId: userData._id, empName: userData.name }
      // let response = await http_request.patch(`/editComplaint/${id}`, reqdata);

      const reqdata = assignTech
        ? {
          empId: userData._id,
          empName: userData.name,
          status: data?.status,
          technicianId: data?.technicianId,
          assignTechnician: data?.assignTechnician,
          assignTechnicianTime: data?.assignTechnicianTime,
          srerviceCenterResponseTime: data?.srerviceCenterResponseTime,
          technicianContact: data?.technicianContact,
        }
        : {
          status: data?.status,
          comments:data?.comments,
          empId: userData._id,
          empName: userData.name,
        };

      // Convert reqdata to FormData
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
      setAssignTech(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
      reset()
    } catch (err) {
      console.log(err);
    }
  };

  const partOrder = async (data) => {
    try {
      let response = await http_request.post(`/addOrder`, data);
      let { data: responseData } = response;
      setOrder(false)
      props?.RefreshData(responseData)
      ToastMessage(responseData);
    } catch (err) {
      console.log(err);
      ToastMessage(responseData);
    }
  };

  const handleDelete = (id) => {
    setConfirmBoxView(true);
    setId(id)
  }

  const handleAssignTechnician = async (id) => {
    const comp = data?.find((f) => f?._id === id)
    const technician = props?.technicians?.filter((f) => f?.serviceCenterId === comp?.assignServiceCenterId)
    // console.log(technician);
    setId(id)
    setAssignData(technician)
    setAssignTech(true)
  }
  const handleTechnicianClose = () => {

    setAssignTech(false)
  }
  const handleDetails = (id) => {
    router.push(`/complaint/details/${id}`)
  }

  const handleEdit = (id) => {
    router.push(`/complaint/edit/${id}`);
  };
  const handleUpdateStatus = async (id) => {
    setId(id)
    setStatus(true)
  }
  const handleOrderPart = async (id) => {
    // setId(id)
    // setValue("ticketID", id)
    // setOrder(true)
    router.push(`/inventory/order`);
  }
  const handleOrderClose = () => {

    setOrder(false)
  }
  const handleUpdateClose = () => {

    setStatus(false)
  }

  const handleServiceChange = (event) => {
    if (status === true) {
      setValue("status", event.target.value)
      // console.log(event.target.value);
    }
    if (status === false) {
      const selectedId = event.target.value;
      const selectedpart = props?.sparepart?.find(center => center._id === selectedId);
      setSelectedSparepart(selectedId);
      setValue('sparepartId', selectedpart?._id);
      setValue('partName', selectedpart?.partName);

    }
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    console.log(event.target.value);

  };
  return (
    <div>
      <Toaster />
      <div className='grid md:grid-cols-2   grid-cols-1 items-center mb-3'>
        <div className='font-bold text-2xl'>Pending Service Information</div>
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
                      <TableCell>{row?.status}</TableCell>
                      <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                      <TableCell className="p-0">
                        <div className="flex items-center space-x-2">
                          {/* <div
                          onClick={() => handleUpdateStatus(row?._id)}
                          className="rounded-md p-2 cursor-pointer bg-[#2e7d32] text-black hover:bg-[#2e7d32] hover:text-white"
                        >
                          Update Status
                        </div> */}
                          {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" || userData?.role === "SERVICE" && userData?.serviceCenterType === "Independent" || userData?.role === "TECHNICIAN" ?
                            <div
                              onClick={() => handleUpdateStatus(row?._id)}
                              className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                            >
                              <SystemSecurityUpdate />
                            </div>
                            : ""}

                          {userData?.role === "SERVICE" ?
                            <div
                              onClick={() => handleOrderPart(row?._id)}
                              className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                            >
                              <DepartureBoard />

                            </div>
                            : ""}
                          {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" || userData?.role === "SERVICE" || userData?.role === "BRAND" && userData?.brandSaas === "YES" ?
                            <div
                              onClick={() => handleAssignTechnician(row?._id)}
                              className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                            >
                              <AssignmentTurnedIn />
                            </div>
                            : ""}
                              {userData?.role === "SERVICE" || userData?.role === "EMPLOYEE" || userData?.role === "ADMIN" ?
                                                            <div>
                                                              <MatchedSparePartsModalButton complaintId= {row?._id} />
                            
                                                            </div>
                                                            : ""}
                          <div
                            onClick={() => handleDetails(row?._id)}
                            className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                          >
                            <Visibility />
                          </div>

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

            <div>
              <button type="submit" className="rounded-lg w-full p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                Submit
              </button>
            </div>
          </form>
        </DialogContent>

      </Dialog>
      <Dialog open={assignTech} onClose={handleTechnicianClose}>
        <DialogTitle>  Assign Technician</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleTechnicianClose}
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
              <label id="service-center-label" className="block text-sm font-medium text-black ">
                Assign Technician
              </label>

              <select
                id="service-center-label"
                value={selectedTechnician}
                onChange={handleTechnicianChange}
                className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>Select Technician</option>
                {techData?.map((tech) => (
                  <option key={tech._id} value={tech._id}>
                    {tech.name}
                  </option>
                ))}
              </select>
              <div>
                <div>
                  <label className="block text-gray-700 ">Contact</label>
                  <input {...register('technicianContact', { valueAsNumber: true })} type="number" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  {errors.technicianContact && <p className="text-red-500 text-sm mt-1">{errors.technicianContact.message}</p>}
                </div>
                <label className="block text-gray-700 mt-3">Comments/Notes</label>
                <textarea {...register('comments')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
              </div>

            </div>
            <button onClick={handleSubmit(onSubmit)} className="rounded-lg p-3 w-full mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              Assign  Technician
            </button>
          </form>
        </DialogContent>

      </Dialog>
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
              <label id="service-center-label" className="block text-sm font-medium text-black ">
                Sparepart Name
              </label>

              <select
                id="service-center-label"
                value={selectedSparepart}
                onChange={handleServiceChange}
                className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>Select Sparepart</option>
                {props?.sparepart?.map((center) => (
                  <option key={center.id} value={center._id}>
                    {center.partName}
                  </option>
                ))}
              </select>

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

            <button type="submit" className="rounded-lg p-3 w-full mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>

          </form>

        </DialogContent>

      </Dialog>
      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
    </div>
  );
};

export default PendingComplaintList;

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
