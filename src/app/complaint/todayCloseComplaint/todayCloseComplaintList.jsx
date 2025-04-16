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
 

const TodayCloseComplaintList = (props) => {

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const router = useRouter()
  const complaint = props?.data;
  const userData = props?.userData;

  // const data = userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? complaint
  //   : userData?.role === "BRAND" ? complaint?.filter((item) => item?.brandId === userData._id)
  //     : userData?.role === "BRAND EMPLOYEE" ? complaint?.filter((item) => item?.brandId === userData.brandId)
  //       : userData?.role === "USER" ? complaint?.filter((item) => item?.userId === userData._id)
  //         : userData?.role === "SERVICE" ? complaint?.filter((item) => item?.assignServiceCenterId === userData._id)
  //           : userData?.role === "TECHNICIAN" ? complaint?.filter((item) => item?.technicianId === userData._id)
  //             : userData?.role === "DEALER" ? complaint?.filter((item) => item?.dealerId === userData._id)
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

// console.log("data",data);


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

  const updateComment = async (data) => {
    try {
      // console.log(id);
      // console.log(data);
      const sndStatusReq = userData?.role === "BRAND"?{ sndStatus: data.comments, brandId: userData._id, brandName: userData.brandName }:{ sndStatus: data.comments, empId: userData._id, empName: userData.name }
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
      const dataReq = userData?.role === "BRAND"?{ comments:data?.comments, brandId: userData._id, brandName: userData.brandName, }: { ...data, empId: userData._id, empName: userData.name, }
      let response = await http_request.patch(`/editComplaint/${id}`, dataReq);
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
        <div className='font-bold text-2xl'>Today Close  Complaints Information</div>
       
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
                 
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'district'}
                      direction={sortDirection}
                      onClick={() => handleSort('district')}
                    >
                      City
                    </TableSortLabel>
                  </TableCell>
                
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'customerMobile'}
                      direction={sortDirection}
                      onClick={() => handleSort('customerMobile')}
                    >
                      Contact No.
                    </TableSortLabel>
                  </TableCell>
                  
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

                    
                    <TableCell>{row?.assignServiceCenter}</TableCell>
                    <TableCell>{row?.status}</TableCell>
                    <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{new Date(row?.updatedAt).toLocaleString()}</TableCell>
                    <TableCell className="p-0">
                      <div className="flex items-center space-x-2">
                       
                       
                        <div
                        
                          onClick={() => handleDetails(row?._id)}
                          className="rounded-md p-2  cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
                        >
                          <Visibility />
                        </div>
                        
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
          {userData?.role === "BRAND"? ""
           :<div className='w-[350px] mb-5'>
            
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
            }
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
              <button type="submit" className="rounded-lg p-3 w-full mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
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

export default TodayCloseComplaintList;

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
