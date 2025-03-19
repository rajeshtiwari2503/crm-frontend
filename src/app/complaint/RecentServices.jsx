// "use client"
// import React, { useEffect, useState } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import { Add, Close, Print, Visibility } from '@mui/icons-material';
// import { useRouter } from 'next/navigation';
// import { ConfirmBox } from '@/app/components/common/ConfirmBox';
// import { ToastMessage } from '@/app/components/common/Toastify';
// import { Toaster } from 'react-hot-toast';
// import http_request from '.././../../http-request'
// import { ReactLoader } from '@/app/components/common/Loading';
// import { useForm } from 'react-hook-form';

// const StatusComponent = ({ row }) => {
//   let statusToDisplay = row?.status;

//   if (row?.updateHistory?.length > 0) {
//     const lastIndex = row?.updateHistory.length - 1;
//     statusToDisplay = row?.updateHistory[lastIndex]?.changes?.status || row?.status;
//   }

//   return (
//     <div className='bg-green-400 text-white p-2 rounded-md'>
//       {statusToDisplay}
//     </div>
//   );
// };

// const RecentServicesList = (props) => {


//   const [status, setStatus] = useState(false);

//   const [confirmBoxView, setConfirmBoxView] = useState(false);
//   const [id, setId] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);
//   const [sortDirection, setSortDirection] = useState('asc');
//   const [sortBy, setSortBy] = useState('id');



//   const router = useRouter()


//   const userData = props?.userData;
  

//   const data11 = props?.data;
//   // console.log("data11",data11);
//   const sortedData1 = data11?.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//   const sortData = sortedData1?.map((item, index) => ({ ...item, i: index + 1 }));
//   const data1 = sortData;

//   const data = userData?.role === "USER" ? data1?.filter((item) => item?.userId === userData?._id) : data1;
//   // const data =   data1 

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSort = (property) => {
//     const isAsc = sortBy === property && sortDirection === 'asc';
//     setSortDirection(isAsc ? 'desc' : 'asc');
//     setSortBy(property);
//   };

//   const sortedData = stableSort(data, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



//   const deleteData = async () => {
//     try {
//       let response = await http_request.deleteData(`/deleteComplaint/${id}`);
//       let { data } = response;
//       setConfirmBoxView(false);
//       props?.RefreshData(data)
//       ToastMessage(data);
//     } catch (err) {
//       console.log(err);
//     }
//   }
//   const onSubmit = async (data) => {
//     try {
//       let response = await http_request.patch(`/editComplaint/${id}`, data);
//       let { data: responseData } = response;

//       setStatus(false)
//       props?.RefreshData(responseData)
//       ToastMessage(responseData);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   const handleDelete = (id) => {
//     setConfirmBoxView(true);
//     setId(id)
//   }

//   const handleAdd = () => {
//     router.push("/complaint/add")
//   }

//   const handleDetails = (id) => {
//     router.push(`/complaint/details/${id}`)
//   }

//   const handleEdit = (id) => {
//     router.push(`/complaint/edit/${id}`);
//   };
//   const handleUpdateStatus = async (id) => {
//     setId(id)
//     setStatus(true)
//   }
//   const handleUpdateClose = () => {

//     setStatus(false)
//   }

//   return (
//     <div className=''>
//       <Toaster />
//       <div className='flex justify-between items-center mb-3 md:w-full w-[220px]'>
//         <div className='font-bold text-2xl'> Recent Service Information</div>
//         {/* {props?.dashboard===true?""
//         : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
//           <Add style={{ color: "white" }} />
//           <div className=' ml-2 '>Add Complaint</div>
//         </div>
//         } */}
//       </div>

//       {!data?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
//         :
//         <div className='md:w-full w-[260px]'>
//           <TableContainer component={Paper}   >
//             <Table>
//               <TableHead sx={{ backgroundColor: "#09090b" }}>
//                 <TableRow >
//                   {[
//                     { label: "ID", key: "_id" },
//                     { label: "Complaint_Id", key: "_id" },
//                     { label: "Customer", key: "fullName" },
//                     { label: "City", key: "district" },
//                     { label: "Contact", key: "customerMobile" },
//                     { label: "Product_Brand", key: "productBrand" },
//                     { label: "Status", key: "status" },
//                     { label: "Updated_At", key: "UpdatedAt" },
//                   ].map(({ label, key }) => (
//                     <TableCell key={key} sx={{ color: "white" }}>
//                       <TableSortLabel
//                         active={sortBy === key}
//                         direction={sortDirection}
//                         onClick={() => handleSort(key)}
//                         sx={{
//                           color: "white !important", // White text
//                           "& .MuiTableSortLabel-icon": {
//                             color: "white !important", // White sort arrow
//                           },
//                         }}
//                       >
//                         {label}
//                       </TableSortLabel>
//                     </TableCell>
//                   ))}
//                   <TableCell sx={{ color: "white" }}>Actions</TableCell>

//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {sortedData.map((row) => (
//                   <TableRow key={row?.i} hover>
//                     <TableCell>{row?.i}</TableCell>
//                     <TableCell>{row?._id}</TableCell>
//                     <TableCell>{row?.fullName}</TableCell>
//                     {/* <TableCell>{row?.emailAddress}</TableCell> */}
//                     <TableCell>{row?.district}</TableCell>
//                     {/* <TableCell>{row?.serviceAddress}</TableCell> */}
//                     {/* <TableCell>{row?.state}</TableCell> */}
//                     <TableCell>{row?.phoneNumber}</TableCell>
//                     {/* <TableCell>{row?.categoryName}</TableCell> */}
//                     <TableCell>
//                       {String(row?.productBrand || "").length > 15
//                         ? String(row?.productBrand).substring(0, 15) + "..."
//                         : row?.productBrand}
//                     </TableCell>

//                     {/* <TableCell>{row?.modelNo}</TableCell>
//                                    <TableCell>{row?.serialNo}</TableCell>
               
//                                    <TableCell>{row?.issueType}</TableCell>
//                                    <TableCell>{row?.detailedDescription}</TableCell>
//                                    <TableCell>{row?.errorMessages}</TableCell>
//                                    <TableCell>{row?.assignServiceCenter}</TableCell>
//                                    <TableCell>{row?.assignTechnician}</TableCell>
//                                    <TableCell>{row?.technicianContact}</TableCell>
//                                    <TableCell>{row?.comments}</TableCell> */}
//                     <TableCell>{row?.status}</TableCell>

//                     <TableCell>{new Date(row?.updatedAt).toLocaleString()}</TableCell>
//                     <TableCell className="p-0">
//                       <div className="flex items-center space-x-2">

//                         <IconButton aria-label="view" onClick={() => handleDetails(row?._id)}>
//                           <Visibility color="primary" />
//                         </IconButton>

//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>

//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={data.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={handleChangePage}
//             onRowsPerPageChange={handleChangeRowsPerPage}
//           />
//         </div>}

//     </div>
//   );
// };

// export default RecentServicesList;

// function stableSort(array, comparator) {
//   const stabilizedThis = array?.map((el, index) => [el, index]);
//   stabilizedThis?.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis?.map((el) => el[0]);
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  TableSortLabel,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import http_request from "../../../http-request";
import { ReactLoader } from "@/app/components/common/Loading";

const RecentServicesList = ({ userData }) => {
  const router = useRouter();

  const [complaints, setComplaints] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("updatedAt");

  useEffect(() => {
    getAllComplaint();
  }, [page, limit, userData]);

  const getAllComplaint = async () => {
    try {
      if (!userData?.role || !userData?._id) return;

      let queryParams = new URLSearchParams({
        page: page + 1, // API might use 1-based index
        limit,
      });

      if (userData.role === "BRAND") queryParams.append("brandId", userData._id);
      else if (userData.role === "SERVICE") queryParams.append("serviceCenterId", userData._id);
      else if (userData.role === "TECHNICIAN") queryParams.append("technicianId", userData._id);
      else if (userData.role === "CUSTOMER") queryParams.append("userId", userData._id);
      else if (userData.role === "DEALER") queryParams.append("dealerId", userData._id);

      const response =
        userData.role === "ADMIN" || userData.role === "EMPLOYEE"
          ? await http_request.get(`/getAllComplaint?page=${page + 1}&limit=${limit}`)
          : await http_request.get(`/getAllComplaintByRole?${queryParams.toString()}`);

      const { data } = response;
      console.log(data,"daaaa");
      
      setComplaints(data?.data || []);
      setTotalPages(Math.ceil((data?.totalComplaints || 0)  )); 
      setLoading(false);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setLoading(false);
    }
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(property);
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    const valA = a[sortBy] || "";
    const valB = b[sortBy] || "";
    return sortDirection === "asc"
      ? valA.toString().localeCompare(valB.toString())
      : valB.toString().localeCompare(valA.toString());
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDetails = (id) => {
    router.push(`/complaint/details/${id}`);
  };

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold mb-3">Recent Service Information</h2>

      {loading ? (
        <div className="h-[400px] flex justify-center items-center">
          <ReactLoader />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#09090b" }}>
              <TableRow>
                {[
                  { label: "ID", key: "complaintId" },
                  { label: "Complaint ID", key: "_id" },
                  { label: "Customer", key: "fullName" },
                  { label: "City", key: "district" },
                  { label: "Contact", key: "phoneNumber" },
                  { label: "Product Brand", key: "productBrand" },
                  { label: "Status", key: "status" },
                  { label: "Updated At", key: "updatedAt" },
                ].map(({ label, key }) => (
                  <TableCell key={key} sx={{ color: "white" }}>
                    <TableSortLabel
                      active={sortBy === key}
                      direction={sortDirection}
                      onClick={() => handleSort(key)}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": {
                          color: "white !important",
                        },
                      }}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={{ color: "white" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedComplaints.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{index + 1 + page * limit}</TableCell>
                  <TableCell>{row._id}</TableCell>
                  <TableCell>{row.fullName}</TableCell>
                  <TableCell>{row.district}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>
                    {String(row.productBrand || "").length > 15
                      ? `${String(row.productBrand).substring(0, 15)}...`
                      : row.productBrand}
                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{new Date(row.updatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton aria-label="view" onClick={() => handleDetails(row._id)}>
                      <Visibility color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPages }
            rowsPerPage={limit}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
    </div>
  );
};

export default RecentServicesList;
