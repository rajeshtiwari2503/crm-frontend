"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle, Select, MenuItem, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, AssignmentTurnedIn, Close, Comment, Print, Search, SystemSecurityUpdate, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import EditComplaintForm from '../assign/partPendingVideo';
import MatchedSparePartsModal from '@/app/components/MatchSparepartsModal';
import UpdateComplaintModal from '../UpdateComplaintModel';


const ComplaintList = (props) => {



  const [filterSer, setFilterSer] = useState("")

  const [selectedDashboardDetails, setSelectedDashboardDetails] = useState(null);
  const serviceCenter = filterSer === "" ? props?.serviceCenter : filterSer


  const complaint = props?.data;
  const userData = props?.userData

  const filteredData = complaint
  // const filteredData = userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? complaint
  //   : userData?.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
  //     : userData?.role === "BRAND EMPLOYEE" ? complaint.filter((item) => item?.brandId === userData.brandId)
  //       : userData?.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
  //         : userData?.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId === userData._id)
  //           : userData?.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId === userData._id)
  //             : userData?.role === "DEALER" ? complaint.filter((item) => item?.dealerId === userData._id)
  //               : []

  const { register, handleSubmit, formState: { errors }, getValues, reset, setValue } = useForm();
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
  const [visible, setVisible] = useState(false);
  const [filterComp, setFilteredComp] = useState([]);



  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };
  // const handleChangePage = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPage) {
  //     props?.setPage(newPage);
  //   }
  // };
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };
  // const handleChangePage = (event, newPage) => {
  //   props?.setPage(newPage + 1); // MUI pages are zero-based, so add 1
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   props?.setLimit(parseInt(event.target.value, 5));
  //   props?.setPage(1); // Reset to first page after changing rows per page
  // };
  const handleChangePage = (event, newPage) => {
    if (searchTerm) {
      setPage(newPage);
    } else {
      props?.setPage(newPage + 1); // Convert zero-based index to 1-based for backend
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);

    if (searchTerm) {
      setRowsPerPage(newRowsPerPage);
      setPage(0); // Reset to first page
    } else {
      props?.setLimit(newRowsPerPage);
      props?.setPage(1); // Reset to first page (1-based for backend)
    }
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  const handleSearch = (event) => {
    setVisible(true)
    setSearchTerm(event.target.value);
    console.log(event.target.value);

  };



  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchFilteredData();
    }
    else {
      props?.RefreshData(searchTerm)
    }
  }, [searchTerm]);


  const fetchFilteredData = async () => {
    try {
      setLoading(true);
      const response = await http_request.get(`/searchComplaint?searchTerm=${searchTerm}`);
      const { data } = response;
      setFilteredComp(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching search results:", error);
    }
  };
  const dataSearch = searchTerm ? filterComp : filteredData;
  const data = userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? dataSearch
    : userData?.role === "BRAND" ? dataSearch?.filter((item) => item?.brandId === userData._id)
      : userData?.role === "BRAND EMPLOYEE" ? dataSearch?.filter((item) => item?.brandId === userData.brandId)
        : userData?.role === "USER" ? dataSearch?.filter((item) => item?.userId === userData._id)
          : userData?.role === "SERVICE" ? dataSearch?.filter((item) => item?.assignServiceCenterId === userData._id)
            : userData?.role === "TECHNICIAN" ? dataSearch?.filter((item) => item?.technicianId === userData._id)
              : userData?.role === "DEALER" ? dataSearch?.filter((item) => item?.dealerId === userData._id)
                : []

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


  // const handleAssignServiceCenter = async (id) => {
  //   setId(id);

  //   const filterCom = data?.find((f) => f?._id === id);
  //   setAssign(true);
  //   if (!filterCom?.pincode) {
  //     console.log("Pincode not found in the complaint");
  //     return;
  //   }

  //   const targetPincode = filterCom?.pincode.trim(); // Trim the complaint pincode

  //   // const serviceCenter1 = props?.serviceCenter?.filter((f) => {
  //   //   if (Array.isArray(f?.pincodeSupported)) {

  //   //     return f.pincodeSupported.some((pincodeString) => {

  //   //       const supportedPincodes = pincodeString.split(',').map(p => p.trim());

  //   //       return supportedPincodes.includes(targetPincode);
  //   //     });
  //   //   }
  //   //   return false;
  //   // });
  //   const serviceCenter1 = props?.serviceCenter?.filter((center) => {
  //     // Convert postalCode (string) into an array and merge with pincodeSupported (if it's an array)
  //     const pincodeList = [
  //       ...(Array.isArray(center?.pincodeSupported) ? center.pincodeSupported : []),
  //       ...(center?.postalCode ? center.postalCode.split(',').map(p => p.trim()) : [])
  //     ];

  //     console.log(pincodeList, "pincodeList");

  //     // Check if targetPincode exists in the merged list
  //     return pincodeList.includes(targetPincode);
  //   });


  //   setFilterSer(serviceCenter1)
  //   // console.log(serviceCenter1, "Filtered service centers with matching pincode");

  //   if (serviceCenter1.length === 0) {
  //     console.log("No service centers found for the given pincode.");
  //   }


  // };


  // const handleAssignServiceCenter = async (id) => {
  //   setId(id);
  //   setAssign(true);
  //   setLoading(true);

  //   const complaint = data?.find(item => item?._id === id);

  //   if (!complaint || !complaint.pincode) {
  //     console.log("Pincode not found in the complaint");
  //     setLoading(false);
  //     return;
  //   }

  //   const targetPincode = complaint.pincode.trim();

  //   const filteredCenters = props?.serviceCenter?.filter(center => {
  //     const supportedPincodes = [
  //       ...(Array.isArray(center.pincodeSupported) ? center.pincodeSupported : []),
  //       ...(typeof center.postalCode === 'string'
  //         ? center.postalCode.split(',').map(p => p.trim())
  //         : [])
  //     ];

  //     return supportedPincodes.includes(targetPincode);
  //   }) || [];

  //   setFilterSer(filteredCenters);
  //   setLoading(false);

  //   if (filteredCenters.length === 0) {
  //     console.log("No service centers found for the given pincode.");
  //   }
  // };

  const handleAssignServiceCenter = async (id) => {
    setId(id);
    setAssign(true);
    setLoading(true);

    const complaint = data?.find(item => item?._id === id);

    if (!complaint || !complaint.pincode) {
      console.log("Pincode not found in the complaint");
      setLoading(false);
      return;
    }

    const targetPincode = complaint.pincode.trim();

    const filteredCenters = props?.serviceCenter?.filter(center => {
      const supportedPincodes = [
        ...(Array.isArray(center.pincodeSupported) ? center.pincodeSupported : []),
        ...(typeof center.postalCode === 'string'
          ? center.postalCode.split(',').map(p => p.trim())
          : [])
      ];
      return supportedPincodes.includes(targetPincode);
    }) || [];

    const centersWithDetails = await Promise.all(
      filteredCenters.map(async (center) => {
        const [dashboardRes, tatRes] = await Promise.all([
          http_request.get(`/dashboardDetailsBySeviceCenterId/${center._id}`),
          http_request.get(`/getAllTatByServiceCenter?assignServiceCenterId=${center._id}`)
        ]);
        // console.log("TAT Response for center:", center.serviceCenterName, tatRes.data);
        return {
          ...center,
          dashboardDetails: dashboardRes.data.complaints || {},
          tatMetrics: {
            totalComplaints: tatRes?.data?.totalComplaints || 0,
            overallTATPercentage: tatRes?.data?.overallTATPercentage || "0.00",
            overallRTPercentage: tatRes?.data?.overallRTPercentage || "0.00",
            overallCTPercentage: tatRes?.data?.overallCTPercentage || "0.00",
          }
        };
      })
    );
    // console.log("centersWithDetails", centersWithDetails);

    setFilterSer(centersWithDetails);
    setLoading(false);

    if (centersWithDetails.length === 0) {
      console.log("No service centers found for the given pincode.");
    }
  };



  const handleUpdateStatus = async (id) => {
    setId(id)
    setStatus(true)
  }
  const handleUpdateClose = () => {

    setStatus(false)
  }
  const handleOrderPart = async (id) => {
    setId(id)
    // setValue("ticketID", id)
    setOrder(true)
    // router.push(`/inventory/order/request/${id}`);
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


    const selectedCenter = filterSer.find(c => c._id === selectedId);
    if (selectedCenter) {
      // console.log("selectedCenter", selectedCenter);

      setSelectedDashboardDetails(selectedCenter);
    } else {
      setSelectedDashboardDetails(null);
    }
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

  // console.log("selectedDashboardDetails", selectedDashboardDetails);
  const sendOTP = async (id) => {
    try {
      const response = await http_request.post("/send-otp", { complaintId: id });

      if (response.data.success) {
        console.log("OTP sent successfully!");
        ToastMessage({ status: true, msg: "OTP sent successfully!" })
      } else {
        console.log("Failed to send OTP. Please try again.");
        ToastMessage({ status: false, msg: "Failed to send OTP. Please try again." })
      }
    } catch (error) {
      console.log("Error sending OTP: " + error.response?.data?.message || error.message);
    }
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

  const onSubmit = async (data) => {
    try {
      setLoading(true);


      // const reqdata = assign === true ? { empId: userData._id, empName: userData.name, status: "ASSIGN", assignServiceCenterId: data?.assignServiceCenterId, assignServiceCenter: data?.assignServiceCenter, serviceCenterContact: data?.serviceCenterContact, assignServiceCenterTime: data?.assignServiceCenterTime } : { status: data?.status, empId: userData._id, empName: userData.name }
      // console.log(reqdata);
      const reqdata =
        assign === true
          ? {
            empId: userData._id,
            empName: userData.name,
            status: "ASSIGN",
            assignServiceCenterId: data?.assignServiceCenterId,
            assignServiceCenter: data?.assignServiceCenter,
            serviceCenterContact: data?.serviceCenterContact,
            assignServiceCenterTime: data?.assignServiceCenterTime,

          }
          : {
            status: data?.status,
            comments: data?.comments,
            empId: userData._id,
            empName: userData.name,
            ...(data.status === "CUSTOMER SIDE PENDING" && { cspStatus: "YES" })
          };
      // console.log(reqdata);
      let response = await http_request.patch(`/editComplaint/${id}`, reqdata);
      // if (data?.comments) {
      //   updateComment({ comments: data?.comments })
      // }
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

      const sndStatusReq = {
        sndStatus: data.comments,
        empId: userData._id,
        empName: userData.name,
        ...(userData?.role === "SERVICE" || userData?.role === "TECHNICIAN"
          ? {
            serviceCenterResponseTime: new Date(),
            serviceCenterResponseComment: data.comments
          }
          : {
            empResponseTime: new Date(),
            empResponseComment: data.comments
          })
      };

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
      <div className='flex justify-between items-center m-3'>
        <div>
          <div className='font-bold text-xl'>Service Information</div>
          <div className="flex items-center  mt-2">
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search by ID"
              value={searchTerm}
              onChange={handleSearch}
              className="ml-2 border border-gray-300 rounded-lg py-2 px-3 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        {userData?.role === "SERVICE" || userData?.role === "TECHNICIAN" ?
          ""
          :
          <div onClick={handleAdd} className="flex cursor-pointer rounded-lg p-3   border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <Add style={{ color: "white" }} />
            <div className=' ml-2 '>Add Service Request</div>
          </div>
        }
      </div>
      <div>
        {loading === true ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
          : <>
            {!data?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> Data not available !</div>
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
                                {userData?.role === "ADMIN" ?
                                  <div
                                    onClick={() => handleUpdateStatus(row?._id)}
                                    className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                                  >
                                    <SystemSecurityUpdate />
                                  </div>
                                  : userData?.role === "SERVICE" || userData?.role === "TECHNICIAN" || userData?.role === "EMPLOYEE" ?
                                    <UpdateComplaintModal complaintId={row?._id} RefreshData={props?.RefreshData} />
                                    :
                                    ""}

                                {/* {userData?.role === "SERVICE" || userData?.role === "TECHNICIAN" ?
                            <div
                              onClick={() => handleOrderPart(row?._id)}
                              className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                            >
                              Order Part
                            </div>
                            : ""} */}
                                {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" || userData?.role === "BRAND" && userData?.brandSaas === "YES" ?
                                  <div
                                    onClick={() => handleAssignServiceCenter(row?._id)}
                                    className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                                  >
                                    <AssignmentTurnedIn />
                                  </div>
                                  : ""}
                                {(userData?.role === "ADMIN" || userData?.role === "EMPLOYEE") &&
                                  (row?.status === "PENDING" || row?.status === "ASSIGN" || row?.status === "PART PENDING" || row?.status === "IN PROGRESS") ? (
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
                                {row?.status !== "COMPLETED" && row?.status !== "CANCELED" &&
                                  <>
                                    {userData?.role === "SERVICE" || userData?.role === "EMPLOYEE" || userData?.role === "ADMIN" ?
                                      <div
                                        onClick={() => handleOrderPart(row?._id)}
                                        className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"

                                      >
                                        Add Video
                                      </div>
                                      : ""}
                                    {userData?.role === "SERVICE" || userData?.role === "EMPLOYEE" || userData?.role === "ADMIN" ?
                                      <div
                                        onClick={() => sendOTP(row?._id)}
                                        className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"

                                      >
                                        Send OTP
                                      </div>

                                      : ""}
                                    {userData?.role === "SERVICE" || userData?.role === "EMPLOYEE" || userData?.role === "ADMIN" ?
                                      <div>
                                        <MatchedSparePartsModal complaintId={row?._id} />

                                      </div>
                                      : ""}
                                  </>
                                }
                                <div
                                  onClick={() => handleDetails(row?._id)}
                                  className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                                >
                                  <Visibility />
                                </div>
                                {userData?.role === "ADMIN" || userData?.role === "BRAND" ?
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

                  {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={searchTerm ?data?.length :props?.totalPage  }
            rowsPerPage={searchTerm?rowsPerPage:props?.limit}
            page={searchTerm ?page :props?.page -1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={searchTerm ? data?.length : props?.totalPage}
                    rowsPerPage={searchTerm ? rowsPerPage : props?.limit}
                    page={searchTerm ? page : Math.max(props?.page - 1, 0)} // Ensure non-negative page index
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />

                </div>
              </div>
            }
          </>
        }
      </div>
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
          {/* <form onSubmit={handleSubmit(partOrder)} className="max-w-lg mx-auto grid grid-cols-1 gap-3 md:grid-cols-2  bg-white shadow-md rounded-md">

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

           


            <button type="submit" disabled={loading} className="rounded-md p-2 cursor-pointer bg-[#09090b] text-white hover:bg-[#ffffff] hover:text-black" >Submit</button>

          </form> */}
          <EditComplaintForm handleOrderClose={handleOrderClose} complaintId={id} />
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
      <Dialog open={assign} onClose={handleAssignClose} fullWidth
        maxWidth="md">
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
            <div>
              {loading ? (
               <div className="flex items-center justify-center  "> <ReactLoader /></div>
              ) : filterSer?.length > 0 ? (
                <>
                  <div className='w-full mb-10 '>
                    <div className='flex justify-between items-center  '>
                      <div className='md:w-[600px] w-full'>
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
                      <div>
                        <button type="submit" disabled={loading} onClick={() => asignCenter()} className="rounded-lg w-full p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"> Assign   Service Center</button>
                      </div>
                    </div>
                    {selectedDashboardDetails && (
                      <div className="mt-3 space-y-4 w-full max-w-6xl mx-auto px-4 mb-2">
                        {/* TAT Performance Summary */}
                        <div className="p-3 bg-white rounded-xl shadow-lg text-gray-800">
                          <h3 className="text-xl font-bold mb-1  text-gray-900">
                            TAT Performance Summary
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                            {[

                              { label: "TAT %", key: "overallTATPercentage", color: "bg-blue-100" },
                              { label: "RT %", key: "overallRTPercentage", color: "bg-green-100" },
                              { label: "CT %", key: "overallCTPercentage", color: "bg-purple-100" },
                            ].map((item) => (
                              <div
                                key={item.key}
                                className={`${item.color} p-4 rounded-lg shadow-sm text-center`}
                              >
                                <div className="text-sm font-medium text-gray-700 mb-1">{item.label}</div>
                                <div className="text-md font-semibold text-gray-900">
                                  {selectedDashboardDetails.tatMetrics?.[item.key] ?? (item.key.includes("Percentage") ? "0.00" : 0)}
                                  {item.key.includes("Percentage") ? " %" : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Service Center Dashboard Summary */}
                        <div className="p-3 bg-white rounded-xl shadow-lg text-gray-800">
                          <h3 className="text-xl font-bold mb-3 text-gray-900">
                            Service Center Dashboard Summary
                          </h3>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm">
                            {[
                              { label: "Total Complaints", key: "allComplaints", color: "bg-gray-100" },
                              { label: "Pending", key: "pending", color: "bg-yellow-100" },
                              { label: "Assigned", key: "assign", color: "bg-blue-100" },

                              { label: "In Progress", key: "inProgress", color: "bg-purple-100" },
                              { label: "Part Pending", key: "partPending", color: "bg-orange-100" },
                              { label: "More Than 5 Days", key: "moreThanFiveDays", color: "bg-orange-100" },
                              { label: "2–5 Days", key: "twoToFiveDays", color: "bg-orange-100" },
                              { label: "0–1 Days", key: "zeroToOneDays", color: "bg-orange-100" },
                              { label: "More Than 5 Days (Part Pending)", key: "moreThanFiveDaysPartPending", color: "bg-orange-100" },
                              { label: "2–5 Days (Part Pending)", key: "twoToFiveDaysPartPending", color: "bg-orange-100" },
                              { label: "0–1 Days (Part Pending)", key: "zeroToOneDaysPartPending", color: "bg-orange-100" },
                              { label: "Customer Side Pending", key: "customerSidePending", color: "bg-cyan-100" },
                              { label: "Scheduled", key: "schedule", color: "bg-teal-100" },
                              { label: "Scheduled Upcoming", key: "scheduleUpcomming", color: "bg-teal-100" },
                              { label: "Cancelled", key: "cancel", color: "bg-red-100" },
                              { label: "Completed", key: "complete", color: "bg-green-100" },
                            ].map((item) => (
                              <div
                                key={item.key}
                                className={`${item.color} p-4 rounded-lg shadow-sm text-center`}
                              >
                                <div className="text-sm font-medium text-gray-700 mb-1">{item.label}</div>
                                <div className="text-md font-semibold text-gray-900">
                                  {selectedDashboardDetails.dashboardDetails?.[item.key] ?? 0}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}


                  </div>

                </>
              ) : (
                <p className="w-[350px] mb-7 text-center text-red-500 text-lg font-bold">No service centers found this complaint pencode .</p>
              )}
            </div>

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
                {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? <option value="CUSTOMER SIDE PENDING">Customer Side Pending</option>
                  : ""}
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
            <div>
              <button type="submit" disabled={loading} className="rounded-lg p-3 mt-5 w-full border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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

export default ComplaintList;

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
