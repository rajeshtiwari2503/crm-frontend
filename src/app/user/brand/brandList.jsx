"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Verified, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';

const BrandList = (props) => {


  const router = useRouter()

  const data = props?.data;
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

  const sortedData = stableSort(data, getComparator(sortDirection, sortBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteBrand/${id}`);
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
    router.push("/user/brand/add")
  }

  const handleDetails = (id) => {
    router.push(`/user/brand/details/${id}`)
  }

  const handleEdit = (id) => {
    router.push(`/user/brand/edit/${id}`);
  };

  const handleSaas = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "YES" ? "NO" : "YES";
      let response = await http_request.patch(`/editBrand/${id}`, { brandSaas: newStatus });
      let { data } = response;

      props?.RefreshData(data);
      ToastMessage(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleActive = async (id, currentStatus) => {
    try {


      const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";

      let response = await http_request.patch(`/editBrand/${id}`, { status: newStatus });
      let { data } = response;

      props?.RefreshData(data)
      ToastMessage(data);
    }
    catch (err) {
      console.log(err);

    }
  }
  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Brand Information</div>
        {props?.report === true ? ""
          : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
            <Add style={{ color: "white" }} />
            <div className=' ml-2 '>Add Brand</div>
          </div>
        }
      </div>
      {!data.length > 0 ? <div className='h-[400px] flex justify-center items-center'> Data not available !</div>
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
                      active={sortBy === 'brandName'}
                      direction={sortDirection}
                      onClick={() => handleSort('brandName')}
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
                      CreatedAt
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>isSAAS</TableCell>
                  <TableCell>Actions</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row?.i} hover>
                    <TableCell>{row?.i}</TableCell>
                    <TableCell>{row?.brandName}</TableCell>
                    <TableCell>{row?.email}</TableCell>
                    <TableCell>
                      {props?.userData?.role === "ADMIN" ?
                        <>
                          <button
                            onClick={() => handleActive(row?._id, row?.status)}
                            className={`flex items-center justify-center px-4 py-2 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50
    ${row?.status === "ACTIVE"
                                ? "bg-red-500 hover:bg-red-600 focus:ring-red-300"
                                : "bg-green-500 hover:bg-green-600 focus:ring-green-300"}`}
                            aria-label="edit"
                          >
                            {row?.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          </button>

                        </>
                        : ""
                      }
                    </TableCell>
                    <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      {props?.userData?.role === "ADMIN" ?
                        <>
                          {row?.brandSaas === "YES" ? (
                            <IconButton aria-label="edit" onClick={() => handleSaas(row?._id, row?.brandSaas)}>
                              <div className="flex items-center text-green-600 font-semibold">
                                <Verified color="success" className="mr-1" /> SAAS
                              </div>
                            </IconButton>
                          ) : (
                            <button
                              onClick={() => handleSaas(row?._id, row?.brandSaas)}
                              className="flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                              aria-label="edit"
                            >
                              <div className="">Add SAAS</div>
                            </button>
                          )}
                        </>

                        : ""
                      }




                    </TableCell>
                    <TableCell>


                      <IconButton aria-label="view" onClick={() => handleDetails(row?._id)}>
                        <Visibility color='primary' />
                      </IconButton>

                      {props?.report === true ? ""
                        :
                        <>

                          <IconButton aria-label="edit" onClick={() => handleEdit(row?._id)}>
                            <EditIcon color='success' />
                          </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(row?._id)}>
                            <DeleteIcon color='error' />
                          </IconButton>
                        </>
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
