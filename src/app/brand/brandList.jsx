"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';



const BrandList = (props) => {


  const router = useRouter()

  const data =  props?.data;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: '', name: '', email: '' });
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
 
  const sortedData = stableSort(data, getComparator(sortDirection, sortBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleEditModalOpen = (rowData) => {
    setEditData(rowData);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEdit = () => {
    // Handle editing logic here
    console.log('Edit:', editData);
    handleEditModalClose();
  };

  const handleDelete = (id) => {
    // Handle delete logic here
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

  const handleAdd = () => {
    router.push("/brand/add")
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Brand Information</div>
        <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Brand</div>
        </div>
      </div>
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
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'email'}
                  direction={sortDirection}
                  onClick={() => handleSort('email')}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
              <TableRow key={row?.i} hover>
                <TableCell>{row?.i}</TableCell>
                <TableCell>{row?.name}</TableCell>
                <TableCell>{row?.email}</TableCell>
                <TableCell>
                  <IconButton aria-label="view" onClick={() => handleDelete(row.id)}>
                    <Visibility color='primary' />
                  </IconButton>
                  <IconButton aria-label="edit" onClick={() => handleEditModalOpen(row)}>
                    <EditIcon color='success' />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>Edit Data</DialogTitle>
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
          <TextField className='mt-5' label="Name" fullWidth value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
          <TextField className='mt-5' label="Email" fullWidth value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose}>Cancel</Button>
          <Button onClick={handleEdit}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BrandList;

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
