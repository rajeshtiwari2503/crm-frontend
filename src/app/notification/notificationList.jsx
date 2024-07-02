"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Print, Search, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';

const NotificationList = (props) => {


  const router = useRouter()

  const filteredData = props?.data;
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const data = filteredData?.filter(
    (item) => item?._id.toLowerCase().includes(searchTerm.toLowerCase()) || item?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())

  );

  const sortedData = stableSort(data, getComparator(sortDirection, sortBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteInventory/${id}`);
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
    router.push("/Inventory/create")
  }
  
  const handleDetails = (id) => {
    router.push(`/Inventory/details/${id}`)
  }

  const handleEdit = (id) => {
    router.push(`/Inventory/edit/${id}`);
  };
  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Notification Information</div>
        {/* <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Inventory</div>
        </div> */}
      </div>
      {/* <div className="flex items-center mb-3">
      <Search  className="text-gray-500" />
      <input
        type="text"
        placeholder="Search by ID"
        value={searchTerm}
        onChange={handleSearch}
        className="ml-2 border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div> */}
      {!data.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
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
                     Ticket Id
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'userId'}
                      direction={sortDirection}
                      onClick={() => handleSort('userId')}
                    >
                     User Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'userId'}
                      direction={sortDirection}
                      onClick={() => handleSort('userId')}
                    >
                    Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'message'}
                      direction={sortDirection}
                      onClick={() => handleSort('message')}
                    >
                      Message 
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'adminStatus'}
                      direction={sortDirection}
                      onClick={() => handleSort('adminStatus')}
                    >
                      Admin Status 
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'brandStatus'}
                      direction={sortDirection}
                      onClick={() => handleSort('brandStatus')}
                    >
                      Brand Status 
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'serviceCenterStatus'}
                      direction={sortDirection}
                      onClick={() => handleSort('serviceCenterStatus')}
                    >
                      Service Center Status 
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'technicianStatus'}
                      direction={sortDirection}
                      onClick={() => handleSort('technicianStatus')}
                    >
                      Technician Status 
                    </TableSortLabel>
                  </TableCell> <TableCell>
                    <TableSortLabel
                      active={sortBy === 'userStatus'}
                      direction={sortDirection}
                      onClick={() => handleSort('userStatus')}
                    >
                      User Status 
                    </TableSortLabel>
                  </TableCell> <TableCell>
                    <TableSortLabel
                      active={sortBy === 'dealerStatus'}
                      direction={sortDirection}
                      onClick={() => handleSort('dealerStatus')}
                    >
                      Dealer Status 
                    </TableSortLabel>
                  </TableCell>
                 
                  {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'status'}
                      direction={sortDirection}
                      onClick={() => handleSort('status')}
                    >
                     Status
                    </TableSortLabel>
                  </TableCell> */}
                 
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
                    <TableCell>{row?._id}</TableCell>
                    <TableCell>{row?.userName}</TableCell>
                    <TableCell>{row?.title}</TableCell>
                    <TableCell>{row?.message}</TableCell>
                    <TableCell>{row?.adminStatus}</TableCell>
                    <TableCell>{row?.brandStatus}</TableCell>
                    <TableCell>{row?.serviceCenterStatus}</TableCell>
                    <TableCell>{row?.technicianStatus}</TableCell>
                    <TableCell>{row?.userStatus}</TableCell>
                    <TableCell>{row?.dealerStatus}</TableCell>
                    {/* <TableCell>{row?.status}</TableCell> */}
                 
                   
                    <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                    <TableCell className='flex'>
                  <div className='flex'>

                    {/* <IconButton aria-label="view" onClick={() => handleDetails(row?._id)}>
                        <Visibility color='primary' />
                      </IconButton>
                      
                      <IconButton aria-label="edit" onClick={() => handleEdit(row?._id)}>
                        <EditIcon color='success' />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleDelete(row?._id)}>
                        <DeleteIcon color='error' />
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

      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
    </div>
  );
};

export default NotificationList;

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
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
