"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request';
import { ReactLoader } from '@/app/components/common/Loading';
import Sidenav from '@/app/components/Sidenav';
import DownloadExcel from '@/app/components/DownLoadExcel';

const ServiceCenterList = (props) => {
  const router = useRouter();

  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [service, setService] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSearchData, setFilteredSearchData] = useState([]);

  useEffect(() => {
    getAllService();
  }, []);

  const getAllService = async () => {
    try {
      let response = await http_request.get("/getAllService");
      let { data } = response;
      setService(data);
      setFilteredSearchData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const filterDataByDate = (data, startDate, endDate) => {
    if (!startDate && !endDate) return data;

    const start = startDate ? new Date(startDate) : new Date(-8640000000000000); // Minimum date
    const end = endDate ? new Date(endDate) : new Date(8640000000000000); // Maximum date

    return data.filter(item => {
      const date = new Date(item.createdAt);
      const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()); // Extract only date part
      const startDateObj = new Date(start.getFullYear(), start.getMonth(), start.getDate()); // Extract date part of start date
      const endDateObj = new Date(end.getFullYear(), end.getMonth(), end.getDate()); // Extract date part of end date
      return itemDate >= startDateObj && itemDate <= endDateObj;
    });
  };

  useEffect(() => {
    const filteredData = filterDataByDate(service, startDate, endDate);
    const searchFilteredData = filteredData.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSearchData(searchFilteredData);
  }, [service, startDate, endDate, searchTerm]);

  const data = filteredSearchData?.map((item, index) => ({ ...item, i: index + 1 }));
  const sortedData = stableSort(data, getComparator(sortDirection, sortBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteService/${id}`);
      let { data } = response;
      setConfirmBoxView(false);
      props?.RefreshData(data);
      ToastMessage(data);
      getAllService(); // Refresh the data after deletion
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Sidenav>
        <div className='flex justify-between items-center mb-3'>
          <div className='font-bold text-2xl'>Service Information</div>
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 items-center justify-between gap-8 mb-6">
        <div className="p-4">
            <DownloadExcel data={sortedData} fileName="ServiceCenterList"/>
          </div>
          <div className="flex space-x-4">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700" htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium text-gray-700" htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
         
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700" htmlFor="searchTerm">Search</label>
            <input
              id="searchTerm"
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {!data.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
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
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData?.map((row) => (
                    <TableRow key={row?.i} hover>
                      <TableCell>{row?.i}</TableCell>
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.email}</TableCell>
                      <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredSearchData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        }

        <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
      </Sidenav>
    </div>
  );
};

export default ServiceCenterList;

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
