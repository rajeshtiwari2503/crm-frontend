
"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import http_request from '.././../../http-request'
import { Toaster } from 'react-hot-toast';
import { ToastMessage } from '@/app/components/common/Toastify';

import AddProduct from './addProduct';
import { ReactLoader } from '../components/common/Loading';
import { useUser } from '../components/UserContext';

const ProductList = (props) => {


  const router = useRouter()

  // const data = props?.data;
  const categories = props?.categories;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isWarranty, setIsWarranty] = useState(false);
  const [warranty, setWarranty] = useState("");
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');

  const [userData, setUserData] = React.useState(null);
  const [userProduct, setUserProduct] = React.useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useUser()
  React.useEffect(() => {

    if (user) {
      const userData4 = user


      setUserData(user);
      if (userData4?.user?.role === "USER") {
        getAllUserProducts(userData4?.user?._id)
      }

    }
  }, [user]);

  const getAllUserProducts = async (id) => {
    try {
      setLoading(true);
      let response = await http_request.get(`/getActivationWarrantyByUserId/${id}`)
      let { data } = response;

      setUserProduct(data)
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }
  // console.log(userData?.user?._id);

  const filterData = userData?.user?.role === "BRAND EMPLOYEE" ? props?.data?.filter((item) => item?.userId === userData?.user?.brandId) : props?.data?.filter((item) => item?.userId === userData?.user?._id)
  // console.log("filterData",filterData);

  const filUserData = [...userProduct, ...filterData]
  // console.log("filUserData",filUserData);
  const data2 = userData?.user?.role === "ADMIN" ? props?.data : filUserData;
  // console.log("data2",data2);
  const data = data2?.map((item, index) => ({ ...item, i: index + 1 }));
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
  const handleWarrantyClose = () => {
    setIsWarranty(false);
  };

  const handleAdd = (row) => {
    setEditData(row)
    setEditModalOpen(true);
  }
  // const handleDetails = (row) => {
  //   setEditData(row)
  //   setEditModalOpen(true);
  // }
  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteProduct/${cateId}`);
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
  const handleWarranty = (data) => {
    setWarranty(data)
    setIsWarranty(true)
  }
 const handleDetails = (id) => {
    router.push(`/product/details/${id}`)
  }
  return (
    <div>
      <Toaster />
      {loading === true && filUserData ? (
        <div className="flex justify-center items-center  h-[80vh]">
          <ReactLoader />
        </div>
      ) :
        <>
          <div className='flex justify-between items-center mb-3'>
            <div className='font-bold text-2xl'>Product Information</div>
            <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
              <Add style={{ color: "white" }} />
              <div className=' ml-2 '>Add Product</div>
            </div>
          </div>
          {!data.length > 0 ? <div className='h-[400px] flex justify-center items-center'>  Data not available !</div>
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
                          active={sortBy === 'productName'}
                          direction={sortDirection}
                          onClick={() => handleSort('productName')}
                        >
                          Product
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'productDescription'}
                          direction={sortDirection}
                          onClick={() => handleSort('productDescription')}
                        >
                          Product_Description
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'categoryName'}
                          direction={sortDirection}
                          onClick={() => handleSort('categoryName')}
                        >
                          Category_Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'categoryName'}
                          direction={sortDirection}
                          onClick={() => handleSort('categoryName')}
                        >
                          Sub_Category_Name
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'productBrand'}
                          direction={sortDirection}
                          onClick={() => handleSort('productBrand')}
                        >
                          Brand
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'modelNo'}
                          direction={sortDirection}
                          onClick={() => handleSort('modelNo')}
                        >
                          Model_No.
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'serialNo'}
                          direction={sortDirection}
                          onClick={() => handleSort('serialNo')}
                        >
                          Serial_No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'warrantyStatus'}
                          direction={sortDirection}
                          onClick={() => handleSort('warrantyStatus')}
                        >
                          Warranty In Days
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
                      {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'purchaseDate'}
                      direction={sortDirection}
                      onClick={() => handleSort('purchaseDate')}
                    >
                      Purchase Date
                    </TableSortLabel>
                  </TableCell> */}
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
                        <TableCell  className="max-w-[200px] truncate whitespace-nowrap overflow-hidden">{row?.productName}</TableCell>
                        <TableCell className="max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                          {row?.productDescription}
                        </TableCell>

                        <TableCell>{row?.categoryName}</TableCell>
                        <TableCell>{row?.subCategory}</TableCell>
                        <TableCell>{row?.productBrand || row?.brandName}</TableCell>
                        <TableCell>{row?.modelNo || row?.batchNo}</TableCell>
                        <TableCell>{row?.serialNo}</TableCell>
                        {/* <TableCell>{row?.warrantyStatus === true ? "true" : "false"}</TableCell> */}
                        <TableCell>{row?.warrantyInDays}</TableCell>
                        <TableCell>{row?.status || (row?.isActivated === true ? "ACTIVE" : "INACTIVE")}</TableCell>
                        {/* <TableCell> {new Date(row?.purchaseDate || row?.activationDate)?.toLocaleString()}</TableCell> */}
                        <TableCell>{new Date(row?.createdAt || row?.activationDate)?.toLocaleString()}</TableCell>
                        <TableCell className='flex'>
                          <div className='flex'>

                            {/* <div onClick={() => router.push(`/serviceRequest/${row._id}`)} className="bg-blue-300 text-sm cursor-pointer text-black font-semibold rounded-md p-2 hover:bg-blue-500 hover:font-semibold hover:text-white">
                          Request Service
                        </div>
                        <div onClick={() => handleWarranty(row?.warrantyStatus)} className="ms-3 bg-blue-300 text-sm text-black font-semibold rounded-md p-2 cursor-pointer hover:bg-blue-500 hover:font-semibold hover:text-white">
                          View Warranty
                        </div> */}
                            <IconButton aria-label="view" onClick={() => handleDetails(row?._id)} >
                        <Visibility color='primary' />
                      </IconButton>
                            <IconButton aria-label="edit" onClick={() => handleAdd(row)}>
                              <EditIcon color='success' />
                            </IconButton>
                            {userData?.user?.role === "ADMIN" ?
                              <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                                <DeleteIcon color='error' />
                              </IconButton>
                              : ""}
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
                count={data?.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>}
        </>}
      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={handleEditModalClose}>
        <DialogTitle>{editData?._id ? "Edit Product" : "Add Product"}</DialogTitle>
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
          <AddProduct subCategories={props?.subCategories} categories={categories} userData={userData} brands={props?.brands} existingProduct={editData} RefreshData={props?.RefreshData} onClose={handleEditModalClose} />
        </DialogContent>

      </Dialog>


      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />


      <Dialog open={isWarranty} onClose={handleWarrantyClose}>
        <div className={warranty ? "p-3 bg-green-400 text-bold" : "p-3 bg-red-400 text-bold"}>
          <DialogTitle  > {"Warranty Status"}</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleWarrantyClose}
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
            <div className='md:w-[350px]'>
              <div className={warranty ? "p-3 bg-green-400 text-bold" : "p-3 bg-red-400 text-bold"}>{warranty ? "Your product is under Warranty" : "Your product is not under Warranty"}</div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductList;

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
