"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, PictureAsPdf, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import jsPDF from "jspdf";
import "jspdf-autotable";

const DealerList = (props) => {


  const router = useRouter()

  const data = props?.data;
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [filteredDealers, setFilteredDealers] = useState([]);

  const [searchCity, setSearchCity] = useState("");
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

  const sortedData = stableSort(filteredDealers, getComparator(sortDirection, sortBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteDealer/${id}`);
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
    router.push("/user/dealer/add")
  }

  const handleDetails = (id) => {
    router.push(`/user/dealer/details/${id}`)
  }

  const handleEdit = (id) => {
    router.push(`/user/dealer/edit/${id}`);
  };


  // Function to download a single service center info as PDF
  const downloadSinglePDF = (dealer) => {
    const doc = new jsPDF();
    doc.text("Service Center Details", 10, 10);
    doc.autoTable({
      startY: 20,
      head: [["Field", "Details"]],
      body: [
        ["Dealer Name", dealer?.name],
        ["Contact", dealer?.contact],
        ["State", dealer?.state],
        ["City", dealer?.city],
        ["Other City", dealer?.otherCities],


      ],
    });
    doc.save(`${dealer?.name}_${dealer?.city}_Details.pdf`);
  };

  // Function to download all service centers as a single PDF
  const downloadAllPDF = () => {
    const doc = new jsPDF();
    doc.text("All Dealers", 10, 10);
    doc.autoTable({
      startY: 20,
      head: [["ID", "Dealer Name", "State", "City", "Other City", "Contact"]],
      body: data.map((row, index) => [
        index + 1,
        row?.name,
        row?.state,
        row?.city,
        row?.otherCities,
        row?.contact,
      ]),
    });
    doc.save("All_Dealers.pdf");
  };
  useEffect(() => {
    if (searchCity.trim() === "") {
      setFilteredDealers(data);
    } else {
      const filtered = data.filter((dealer) =>
        (dealer.city || "").toLowerCase().includes(searchCity.toLowerCase()) // Safe check
      );
      setFilteredDealers(filtered);
    }
  }, [searchCity, data]);
  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='flex'>
          <div className='font-bold text-2xl'>Dealer Information</div>
          {props?.user?.role === "ADMIN" || props?.user?.role === "BRAND" && <button onClick={downloadAllPDF} className="ms-5 bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-md flex items-center">
            <PictureAsPdf className="mr-2" />
          </button>
          }
        </div>
        <div className="my-4">
          <input
            type="text"
            placeholder="Search by City"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
        </div>

        {props?.report === true ? ""
          : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
            <Add style={{ color: "white" }} />
            <div className=' ml-2 '>Add Dealer</div>
          </div>
        }
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
                      active={sortBy === 'city'}
                      direction={sortDirection}
                      onClick={() => handleSort('city')}
                    >
                      Other cities
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
                    <TableCell>{row?.city}</TableCell>
                    <TableCell>{row?.otherCities}</TableCell>
                    <TableCell>
                      <IconButton aria-label="view" onClick={() => handleDetails(row?._id)}>
                        <Visibility color='primary' />
                      </IconButton>
                      {props?.report === true ? ""
                        :
                        <> <IconButton aria-label="edit" onClick={() => handleEdit(row?._id)}>
                          <EditIcon color='success' />
                        </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(row?._id)}>
                            <DeleteIcon color='error' />
                          </IconButton>

                          {props?.user?.role === "ADMIN" || props?.user?.role === "BRAND" ? <IconButton aria-label="download" onClick={() => downloadSinglePDF(row)}>
                            <PictureAsPdf color="error" />
                          </IconButton>
                            : ""
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

export default DealerList;

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
