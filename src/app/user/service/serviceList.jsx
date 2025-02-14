"use client"
import React, { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, PictureAsPdf, Search, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import jsPDF from "jspdf";
import "jspdf-autotable";

const ServiceList = (props) => {


  const router = useRouter()

  const data = props?.data;
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered and Sorted Data
  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.serviceCenterName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const sortedData = stableSort(filteredData, getComparator(sortDirection, sortBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteService/${id}`);
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
    router.push("/user/service/add")
  }

  const handleDetails = (id) => {
    router.push(`/user/service/details/${id}`)
  }

  const handleEdit = (id) => {
    router.push(`/user/service/edit/${id}`);
  };


  // Function to download a single service center info as PDF
  const downloadSinglePDF = (serviceCenter) => {
    const doc = new jsPDF();
    doc.text("Service Center Details", 10, 10);
    doc.autoTable({
      startY: 20,
      head: [["Field", "Details"]],
      body: [
        ["Service Name", serviceCenter?.serviceCenterName],
        ["Address", serviceCenter?.streetAddress],
        ["City", serviceCenter?.city],
        ["Pincode", serviceCenter?.postalCode],
        ["Contact", serviceCenter?.contact],
       
      ],
    });
    doc.save(`${serviceCenter?.serviceCenterName}_${serviceCenter?.city}_Details.pdf`);
  };

  // Function to download all service centers as a single PDF
  const downloadAllPDF = () => {
    const doc = new jsPDF();
    doc.text("All Service Centers", 10, 10);
    doc.autoTable({
      startY: 20,
      head: [["ID", "Service Name",   "Address", "City", "Pincode", "Contact"]],
      body: data.map((row, index) => [
        index + 1,
        row?.serviceCenterName,
        row?.streetAddress,
        row?.city,
        row?.postalCode,
        row?.contact,
      ]),
    });
    doc.save("All_Service_Centers.pdf");
  };
  

  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>Service Information</div>
        <div className="flex">
          {props?.user?.role === "ADMIN" && <button onClick={downloadAllPDF} className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-md flex items-center">
            <PictureAsPdf className="mr-2" />
          </button>
          }
          {!props?.report && (
            <div
              onClick={() => router.push("/user/service/add")}
              className="ml-3 flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white items-center"
            >
              <Add style={{ color: "white" }} />
              <div className="ml-2">Add Service</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center mb-3">
        <Search className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by Name,Contact ,District"
          value={searchTerm}
          onChange={handleSearch}
          className="ml-2 border  border-gray-300 rounded-lg py-2 px-3 text-black  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
                      active={sortBy === 'id'}
                      direction={sortDirection}
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'serviceCenterName'}
                      direction={sortDirection}
                      onClick={() => handleSort('serviceCenterName')}
                    >
                      Service Name
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
                      active={sortBy === 'serviceCenterType'}
                      direction={sortDirection}
                      onClick={() => handleSort('serviceCenterType')}
                    >
                      Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
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
                      active={sortBy === 'contact'}
                      direction={sortDirection}
                      onClick={() => handleSort('contact')}
                    >
                      contact
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Actions</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row?.i} hover>
                    <TableCell>{row?.i}</TableCell>
                    <TableCell>{row?.serviceCenterName}</TableCell>
                    <TableCell>{row?.email}</TableCell>
                    <TableCell>{row?.serviceCenterType}</TableCell>
                    <TableCell>{row?.city}</TableCell>
                    <TableCell>{row?.contact}</TableCell>
                    <TableCell style={{ display: "flex" }}>
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
                          {props?.user?.role === "ADMIN" && <IconButton aria-label="download" onClick={() => downloadSinglePDF(row)}>
                            <PictureAsPdf color="error" />
                          </IconButton>
                          }
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

export default ServiceList;

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
