"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import http_request from '.././../../../http-request'
import { Toaster } from 'react-hot-toast';
import { ToastMessage } from '@/app/components/common/Toastify';
import AddSparepart from './addSparepart';
import { ReactLoader } from '@/app/components/common/Loading';

const SparepartList = (props) => {


  const router = useRouter()

  const data = props?.data;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  const [editData, setEditData] = useState(null);
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

 

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };


  const handleAdd = (row) => {
    setEditData(row)
    setEditModalOpen(true);
  }
  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteSparepart/${cateId}`);
      let { data } = response;
      setConfirmBoxView(false);
      props?.RefreshData(data)
      ToastMessage(data);
    } catch (err) {
      console.log(err);
    }
  }
  const handleDelete = (id) => {
    setCateId(id)
    setConfirmBoxView(true);
  }

  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Sparepart Information</div>
        <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Sparepart</div>
        </div>
      </div>
      {!data.length>0 ?  <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
   : 
   <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'id'}
                  direction={sortDirection}
                  onClick={() => handleSort('id')}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortDirection}
                  onClick={() => handleSort('name')}
                >
                  Sparepart
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortDirection}
                  onClick={() => handleSort('name')}
                >
                  Description
                </TableSortLabel>
              </TableCell> 
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'name'}
                  direction={sortDirection}
                  onClick={() => handleSort('name')}
                >
                  SKU 
                </TableSortLabel>
              </TableCell> 
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'email'}
                  direction={sortDirection}
                  onClick={() => handleSort('email')}
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
                  CreatedAt
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData?.map((row) => (
              <TableRow key={row?.i} hover>
                <TableCell>{row?.i}</TableCell>
                <TableCell>{row?.sparepartName}</TableCell>
                <TableCell>{row?.sparepartDescription}</TableCell>
                <TableCell>{row?.sku}</TableCell>
                <TableCell>{row?.status}</TableCell>
                <TableCell>{new Date(row?.createdAt)?.toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton aria-label="view"  >
                    <Visibility color='primary' />
                  </IconButton>
                  <IconButton aria-label="edit" onClick={() => handleAdd(row)}>
                    <EditIcon color='success' />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                    <DeleteIcon color='error' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
</>}

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>{editData?._id?"Edit Sparepart" :"Add Sparepart"}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleEditModalClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <AddSparepart existingSparepart={editData}  RefreshData={props?.RefreshData} onClose={handleEditModalClose}/>
        </DialogContent>
        
      </Dialog>


      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />

    </div>
  );
};

export default SparepartList;

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
