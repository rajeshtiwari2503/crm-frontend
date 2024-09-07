"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Close, Print, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import AddFeedback from '@/app/feedback/addFeedback';

const PendingComplaintList = (props) => {

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const router = useRouter()
  const complaint = props?.data;
  const userData = props?.userData;
   
  const data = userData.role === "ADMIN" ? complaint
  : userData.role === "BRAND" ? complaint.filter((item) => item?.brandId === userData._id)
    : userData.role === "USER" ? complaint.filter((item) => item?.userId === userData._id)
      : userData.role === "SERVICE" ? complaint.filter((item) => item?.assignServiceCenterId ===  userData._id)
        : userData.role === "TECHNICIAN" ? complaint.filter((item) => item?.technicianId ===  userData._id)
          : userData.role === "DEALER" ? complaint.filter((item) => item?.dealerId ===   userData._id)
            :[]
           
  const [status, setStatus] = useState(false);

  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

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
  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Pending Service Information</div>
        {/* {props?.dashboard===true?""
        : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Complaint</div>
        </div>
        } */}
      </div>

      {!data?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
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
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'emailAddress'}
                      direction={sortDirection}
                      onClick={() => handleSort('emailAddress')}
                    >
                      Customer Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'serviceAddress'}
                      direction={sortDirection}
                      onClick={() => handleSort('serviceAddress')}
                    >
                      Service_Address
                    </TableSortLabel>
                  </TableCell>
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
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'categoryName'}
                      direction={sortDirection}
                      onClick={() => handleSort('categoryName')}
                    >
                      Category Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'productBrand'}
                      direction={sortDirection}
                      onClick={() => handleSort('productBrand')}
                    >
                      Product Brand
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
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
                    <TableCell>{row?.emailAddress}</TableCell>
                    <TableCell>{row?.serviceAddress}</TableCell>
                    {/* <TableCell>{row?.state}</TableCell> */}
                    <TableCell>{row?.phoneNumber}</TableCell>
                    <TableCell>{row?.categoryName}</TableCell>
                    <TableCell>{row?.productBrand}</TableCell>
                    <TableCell>{row?.modelNo}</TableCell>
                    <TableCell>{row?.serialNo}</TableCell>

                    <TableCell>{row?.issueType}</TableCell>
                    <TableCell>{row?.detailedDescription}</TableCell>
                    <TableCell>{row?.errorMessages}</TableCell>
                    <TableCell>{row?.assignServiceCenter}</TableCell>
                    <TableCell>{row?.assignTechnician}</TableCell>
                    <TableCell>{row?.technicianContact}</TableCell>
                    <TableCell>{row?.comments}</TableCell>
                    <TableCell>{row?.status}</TableCell>
                    <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="p-0">
                      <div className="flex items-center space-x-2">
                        {/* <div
                          onClick={() => handleUpdateStatus(row)}
                          className="rounded-md p-2 cursor-pointer bg-[#2e7d32] text-black hover:bg-[#2e7d32] hover:text-white"
                        >
                          Add Feedback
                        </div> */}
                       
                        <IconButton aria-label="view" onClick={() => handleDetails(row?._id)}>
                          <Visibility color="primary" />
                        </IconButton>
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
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>}
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
           
         <AddFeedback  complaints={id}  onClose={handleUpdateClose}/>
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
