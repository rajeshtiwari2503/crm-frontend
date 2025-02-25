
"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import http_request from '.././../../../http-request'
import { Toaster } from 'react-hot-toast';
import { ToastMessage } from '@/app/components/common/Toastify';
import { ReactLoader } from '../../components/common/Loading';
import AddStock from './addStock';

const StockList = (props) => {


  const router = useRouter()


  const [editModalOpen, setEditModalOpen] = useState(false);

  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

  const [userData, setUserData] = React.useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");

  React.useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setUserData(JSON.parse(storedValue));
    }
  }, []);




  const filterData = props?.data?.filter((item) => item?.userId === userData?.user?._id)

  const data1 =   props?.data  
  // console.log("data1",data1);
  
  const brandData = props?.data?.filter((f) => f?.brandName === selectedBrand)
  const data = selectedBrand === "" ? data1 : brandData

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
  const handleEdit = (row) => {
    setEditData(row)
    setEditModalOpen(true);
  }
  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteStock/${cateId}`);
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
  const handleDetails = (id) => {
    router.push(`/inventory/stock/details/${id}`)
  }


  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Stock Information</div>
        {userData?.user?.role === "SERVICE" || userData?.user?.role === "EMPLOYEE" ? ""
          : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
            <Add style={{ color: "white" }} />
            <div className=' ml-2 '>Add Stock</div>
          </div>
        }
      </div>
      {(userData?.user?.role === "ADMIN" || userData?.user?.role === "EMPLOYEE") && (
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel id="brand-select-label">Select Brand</InputLabel>
          <Select
            labelId="brand-select-label"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            label="Select Brand"
          >
            <MenuItem value="">
              <em>All Brands</em>
            </MenuItem>
            {Array.from(new Set(props?.data?.map(item => item.brandName))).map(brand => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
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
                      active={sortBy === 'sparepartName'}
                      direction={sortDirection}
                      onClick={() => handleSort('sparepartName')}
                    >
                      Spare_Part Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'freshStock'}
                      direction={sortDirection}
                      onClick={() => handleSort('freshStock')}
                    >
                      Fresh Stock
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'defectiveStock'}
                      direction={sortDirection}
                      onClick={() => handleSort('defectiveStock')}
                    >
                      Defective Stock
                    </TableSortLabel>
                  </TableCell>


                  {userData?.user?.role === "ADMIN" || userData?.user?.role === "EMPLOYEE" ?
                    <>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'serviceCenterName'}
                          direction={sortDirection}
                          onClick={() => handleSort('serviceCenterName')}
                        >
                          Service Center Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'brandName'}
                          direction={sortDirection}
                          onClick={() => handleSort('brandName')}
                        >
                          Brand Name
                        </TableSortLabel>
                      </TableCell>
                    </>
                    : ""

                  }


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
                    <TableCell>{row?.freshStock}</TableCell>
                    <TableCell>{row?.defectiveStock}</TableCell>
                    {userData?.user?.role === "ADMIN" || userData?.user?.role === "EMPLOYEE" ?
                      <>
                        <TableCell>{row?.serviceCenterName}</TableCell>

                        <TableCell>{row?.brandName}</TableCell>
                      </>
                      : ""
                    }
                    <TableCell>{new Date(row?.createdAt)?.toLocaleString()}</TableCell>
                    <TableCell className='flex'>
                      
                      {userData?.user?.role === "SERVICE" || userData?.user?.role === "EMPLOYEE" ? ""
                        : <div className='flex'>


                          <IconButton aria-label="view" onClick={() => handleDetails(row?._id)} >
                            <Visibility color='primary' />
                          </IconButton>
                          {/* <IconButton aria-label="edit" onClick={() => handleEdit(row)}>
                            <EditIcon color='success' />
                          </IconButton> */}
                          {userData?.user?.role === "ADMIN" ? <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                            <DeleteIcon color='error' />
                          </IconButton>
                            : ""}
                        </div>
                      }
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
        <DialogTitle>{editData?._id ? "Edit Stock" : "Add Stock"}</DialogTitle>
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
          <AddStock userData={userData} stockData={data} products={props?.products} data={props?.data} existingStock={editData} RefreshData={props?.RefreshData} onClose={handleEditModalClose} />
        </DialogContent>

      </Dialog>


      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />



    </div>
  );
};

export default StockList;

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
