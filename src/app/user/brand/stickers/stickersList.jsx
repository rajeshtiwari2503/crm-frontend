import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import { Add, Delete, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { ReactLoader } from '@/app/components/common/Loading';
 
import http_request from '.././../../../../http-request';
import { ToastMessage } from '@/app/components/common/Toastify';

const Stickers = (props) => {
  const router = useRouter();
  const data = props?.data;

  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('desc'); // Set default to 'desc'
  const [sortBy, setSortBy] = useState('createdAt'); // Set the default sort by createdAt
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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

  const sortedData = stableSort(data, getComparator(sortDirection, sortBy))
    ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleAdd = (row) => {
    setEditData(row);
    setEditModalOpen(true);
  };

  const handleDetails = (id) => {
    router.push(`/product/warranty/details/${id}`);
  };

  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteProductWarranty/${cateId}`);
      let { data } = response;
      setConfirmBoxView(false);
      ToastMessage(data)
      props?.RefreshData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (id) => {
    setCateId(id);
    setConfirmBoxView(true);
  };

  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Warranty Information</div>
        {/* <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Warranty </div>
        </div> */}
      </div>

      {!data.length > 0 ? (
        <div className='h-[400px] flex justify-center items-center'>
          <ReactLoader />
        </div>
      ) : (
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
                      active={sortBy === 'brandName'}
                      direction={sortDirection}
                      onClick={() => handleSort('brandName')}
                    >
                      Brand Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'productName'}
                      direction={sortDirection}
                      onClick={() => handleSort('productName')}
                    >
                      Product Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'numberOfGenerate'}
                      direction={sortDirection}
                      onClick={() => handleSort('numberOfGenerate')}
                    >
                      Number of QR
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'warrantyInDays'}
                      direction={sortDirection}
                      onClick={() => handleSort('warrantyInDays')}
                    >
                      Warranty Days
                    </TableSortLabel>
                  </TableCell>
                  {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'year'}
                      direction={sortDirection}
                      onClick={() => handleSort('year')}
                    >
                      Batch No.
                    </TableSortLabel>
                  </TableCell> */}
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'createdAt'}
                      direction={sortDirection}
                      onClick={() => handleSort('createdAt')}
                    >
                      Created At
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData?.map((row) => (
                  <TableRow key={row.i} hover>
                    <TableCell>{row.i}</TableCell>
                    <TableCell>{row.brandName}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.numberOfGenerate}</TableCell>
                    <TableCell>{row.warrantyInDays}</TableCell>
                    {/* <TableCell>{row?.records[0]?.batchNo}</TableCell> */}
                    <TableCell>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className='flex'>
                      {/* <IconButton aria-label="view" onClick={() => handleDetails(row._id)}>
                        <Visibility color='primary' />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                        <Delete color='error' />
                      </IconButton> */}

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
        </>
      )}

      
    </div>
  );
};

export default Stickers;

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
