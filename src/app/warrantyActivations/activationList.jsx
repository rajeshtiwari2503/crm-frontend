import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import { Add, Cancel, CheckCircle, Delete, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import http_request from '.././../../http-request';
import { ToastMessage } from '@/app/components/common/Toastify';
import { ReactLoader } from '../components/common/Loading';
import { useUser } from '../components/UserContext';

const WarrantyActivationList = ({ data,
  page,
  setPage,
  limit,
  setLimit,
  totalPage,
  RefreshData }) => {
  const router = useRouter();


  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('desc'); // Set default to 'desc'
  const [sortBy, setSortBy] = useState('createdAt'); // Set the default sort by createdAt
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
      setSearchData([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      console.log("searchTerm", searchTerm);

      http_request
        .get(`/getActivationWarrantySearch?search=${encodeURIComponent(searchTerm)}`)
        .then((response) => {
          console.log("response", response);
          setSearchData(response?.data?.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message || "Error fetching data");
          setLoading(false);
        });
    }, 500); // 1000ms = 1 seconds debounce

    // Cleanup function to clear the timeout if searchTerm changes before 3 seconds
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);






  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const handleChangeRowsPerPage = (event) => {
  //   setLimit(parseInt(event.target.value, 10));
  //   setPage(0);
  // };
  const handleChangeRowsPerPage = (event) => {
    const newLimit = parseInt(event.target.value, 10);
    setLimit(newLimit);
    setPage(0); // Reset to first page when limit changes
  };

  const handleSort = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };
  // console.log("item,data", data)


  //   let combinedData;

  // if (!searchTerm || searchTerm.length < 3) {
  //   // When no valid search term, just show searchData (or you might want to show empty array)
  //   combinedData = searchData; 
  // } else {
  //   // When search term is valid, combine both arrays
  //   combinedData = [...searchData, ...data];
  // }


  // console.log(searchTerm)
  // console.log(filteredData)
  // const sortedData = stableSort(filteredData, getComparator(sortDirection, sortBy))
  //   ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const [combinedData, setCombinedData] = React.useState([]);

  React.useEffect(() => {
    if (searchTerm && searchTerm.length >= 3) {
      setCombinedData(searchData);
    } else {
      setCombinedData(data);
    }
  }, [searchTerm, searchData, data]);

  const trueData = combinedData?.map((item, index) => ({ ...item, i: index + 1 }));

  const sortedData = stableSort(trueData, getComparator(sortDirection, sortBy))
    // .slice(page * limit, (page + 1) * limit);
    .slice();

  const handleDetails = (id) => {
    router.push(`/warrantyActivations/details/${id}`);
  };

  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteProductWarranty/${cateId}`);
      let { data } = response;
      setConfirmBoxView(false);
      ToastMessage(data)
      RefreshData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (id) => {
    setCateId(id);
    setConfirmBoxView(true);
  };
  // console.log("data,sor",sortedData);


  const handleApproval = async (uniqueId, status) => {
    try {
      const adminName = user?.user?.name; // your admin name from state/context

      const response = await http_request.put(`/warranty/${uniqueId}/status`, {
        status,
        adminName
      });

      if (response.data.success) {
        ToastMessage(response.data);
        RefreshData(response.data); // refresh table
      }
    } catch (error) {
      console.error(error);
      ToastMessage({ status: false, msg: error?.response?.data?.msg || "Something went wrong", type: "error" });
    }
  };


  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Warranty Activation Information</div>
        {/* <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
          <Add style={{ color: "white" }} />
          <div className=' ml-2 '>Add Warranty </div>
        </div> */}
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search by User or Brand Name'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full   border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
          />
        </div>

      </div>
      {loading === true > 0 ? (
        <div className='h-[400px] flex justify-center items-center'>
          <ReactLoader />
        </div>
      ) : (
        <>
          {!data.length > 0 ? (
            <div className='h-[400px] flex justify-center items-center'>
              Data not available !
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
                          active={sortBy === 'userName'}
                          direction={sortDirection}
                          onClick={() => handleSort('userName')}
                        >
                          User Name
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
                      {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'productName'}
                      direction={sortDirection}
                      onClick={() => handleSort('productName')}
                    >
                      Product Name
                    </TableSortLabel>
                  </TableCell> */}
                      {/* <TableCell>
                    <TableSortLabel
                      active={sortBy === 'numberOfGenerate'}
                      direction={sortDirection}
                      onClick={() => handleSort('numberOfGenerate')}
                    >
                      Number of QR
                    </TableSortLabel>
                  </TableCell> */}
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'warrantyInDays'}
                          direction={sortDirection}
                          onClick={() => handleSort('warrantyInDays')}
                        >
                          Warranty Days
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={sortBy === 'year'}
                          direction={sortDirection}
                          onClick={() => handleSort('year')}
                        >
                          Batch No.
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
                        <TableCell>{row.userName}</TableCell>
                        <TableCell>{row.brandName}</TableCell>
                        {/* <TableCell>{row.productName}</TableCell> */}
                        {/* <TableCell>{row.numberOfGenerate}</TableCell> */}
                        <TableCell>{row.warrantyInDays}</TableCell>
                        <TableCell>{row?.batchNo}</TableCell>
                        <TableCell>  <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${row.status === "APPROVE"
                            ? "bg-green-100 text-green-700"
                            : row.status === "DISAPPROVE"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {row.status}
                        </span></TableCell>
                        <TableCell>{new Date(row.activationDate).toLocaleString()}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1">
                            {/* View button */}
                            <IconButton aria-label="view" onClick={() => handleDetails(row._id)}>
                              <Visibility color="primary" />
                            </IconButton>

                            {/* Approve / Disapprove buttons for ADMIN */}
                            {user?.user?.role === "ADMIN" && (
                              <>
                                <IconButton
                                  aria-label="approve"
                                  onClick={() => handleApproval(row.uniqueId, "APPROVE")}
                                >
                                  <CheckCircle sx={{ color: "green" }} />
                                </IconButton>

                                <IconButton
                                  aria-label="disapprove"
                                  onClick={() => handleApproval(row.uniqueId, "DISAPPROVE")}
                                >
                                  <Cancel sx={{ color: "red" }} />
                                </IconButton>
                              </>
                            )}
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
                count={totalPage * limit} // total items = totalPage * limit
                rowsPerPage={limit}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}

        </>
      )}

    </div>
  );
};

export default WarrantyActivationList;

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
