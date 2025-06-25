"use client"
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Close, Delete, Label, LocationSearching, Print, Search, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import { ToastMessage } from '@/app/components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
import SparePartsForm from './addOrder';
import CreateOrderDialog from './addOrder';



const CourierOrderList = (props) => {

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  const router = useRouter()

  const filteredData = props?.data;
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState(false);
  const [orderDefective, setOrderDefective] = useState(false);
  const [selectedSparepart, setSelectedSparepart] = useState('');
  const [selectedserviceCenter, setSelectedserviceCenter] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockType, setStockType] = useState('Fresh Stock'); // Initialize stockType with "Fresh Stock"
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedBrandFiltr, setSelectedBrandFiltr] = useState("");

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  //   const data = filteredData?.filter(
  //     (item) => item?._id.toLowerCase().includes(searchTerm.toLowerCase()) || item?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())

  //   );
  const data1 = props?.data
  // console.log("data1",data1);
  // console.log("selectedBrandFiltr",selectedBrandFiltr);


  // const brandData = props?.data?.filter((f) => f?.brandId === selectedBrandFiltr)


  // const data = selectedBrandFiltr === "" ? data1 : brandData


  const filteredOrders = props?.data?.filter((order) => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      order.serviceCenter.toLowerCase().includes(lowerSearch) ||
      order.brandName.toLowerCase().includes(lowerSearch)
    );
  });
  const sortedData = stableSort(filteredOrders, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteOrder/${id}`);
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
    setOrderDefective(false)
    setOrder(true)
  }
  const handleAddDefective = () => {
    setOrderDefective(true)
    setOrder(true)
  }
  const handleOrderClose = () => {

    setOrder(false)
  }
  // console.log("orderDefective", orderDefective);

  const handleDetails = (id) => {
    router.push(`/inventory/order/details/${id}`)
  }

 
const handleCancelShipment = async (awb) => {
  try {
    const res = await axios.post(`/dtdc/cancel`, {
      AWBNo: [awb],
      customer_code: "GL017",
    });
    console.log("🛑 Shipment Cancelled:", res.data);
    ToastMessage({ status: true, msg: "Consignment cancelled" });
  } catch (err) {
    console.error("❌ Error cancelling shipment:", err.response?.data || err.message);
    ToastMessage({ status: false, msg:"Error cancelling consignment"});
  }
};

const handleTrackShipment = async (awb) => {
  try {
    const res = await axios.get(`/dtdc/track?awb=${awb}`);
    console.log("📦 Tracking Info:", res.data);
    ToastMessage({ status: true, msg: "Tracking data fetched" });
  } catch (err) {
    console.error("❌ Error tracking shipment:", err.response?.data || err.message);
    ToastMessage({ status: false, msg: "Error fetching tracking info" });
  }
};

const handleDownloadLabel = async (awb) => {
  try {
    const res = await http_request.get(`/dtdc/label?awb=${awb}`, {
      responseType: "blob", // Important for PDF
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${awb}_label.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("❌ Error downloading label:", err.response?.data || err.message);
    ToastMessage({ status: false, msg:"Error downloading label"});
  }
};
   


  
  
  
  

  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-8'>
        <div className='font-bold text-2xl'>Order Information</div>
        {props?.userData?.user?.role === "ADMIN" || props?.userData?.user?.role === "EMPLOYEE" || props?.userData?.user?.role === "SERVICE" || props?.userData?.user?.role === "BRAND" ?
          <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
            <Add style={{ color: "white" }} />
            <div className=' ml-2 text-white '>Add Order</div>
          </div>
          : ""
        }
        {props?.userData?.user?.role === "ADMIN" || props?.userData?.user?.role === "EMPLOYEE" ?
          <div onClick={handleAddDefective} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
            <Add style={{ color: "white" }} />
            <div className=' ml-2 text-white '>Add Defective Order</div>
          </div>
          : ""
        }
      </div>
      {/* <div className="flex items-center mb-3">
      <Search  className="text-gray-500" />
      <input
        type="text"
        placeholder="Search by ID"
        value={searchTerm}
        onChange={handleSearch}
        className="ml-2 border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div> */}
      {(props?.userData?.user?.role === "ADMIN" || props?.userData?.user?.role === "EMPLOYEE") && (
        <div className='mb-5'>
          {/* <FormControl fullWidth style={{ marginBottom: '20px' }}>
          <InputLabel id="brand-select-label">Select Brand</InputLabel>
          <Select
            labelId="brand-select-label"
            value={selectedBrandFiltr}
            onChange={(e) => setSelectedBrandFiltr(e.target.value)}
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
        </FormControl> */}
          <input
            type="text"
            placeholder="Search by Service Center or Brand"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      )}
      {!filteredOrders?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> Data not available !</div>
        :
        <>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr. No.</TableCell>
                  <TableCell>Service Center</TableCell>
                  <TableCell sx={{ minWidth: 300 }}>Spare_Parts</TableCell>
                  <TableCell>Brand Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total_Price</TableCell>
                  <TableCell>Status</TableCell>
                
                  <TableCell>Docket_No.</TableCell>
               
                  <TableCell>Order Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow key={row._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{row.serviceCenter}</TableCell>
                    <TableCell>
                      {row.spareParts.map((part) => (
                        <div key={part._id}>
                          {part.sparePartName} (Qty: {part.quantity}, Price: ₹ {part.price})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{row.brandName}</TableCell>
                    <TableCell>{row.spareParts.reduce((sum, part) => sum + part.quantity, 0)}</TableCell>
                    <TableCell>  ₹{row.spareParts.reduce((sum, part) => sum + part.price, 0).toLocaleString()}</TableCell>
                    <TableCell>{row.status}</TableCell>
                   
                    <TableCell>{row.docketNo}</TableCell>
                  
                    
                    <TableCell>{new Date(row.orderDate).toLocaleString()}</TableCell>
                    <TableCell className="flex">
                      <div className='flex'>
                      <IconButton aria-label="view" onClick={() => handleDetails(row._id)}>
                        <Visibility color="primary" />
                      </IconButton>
                      <button
                        onClick={() => handleDownloadLabel(row._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm transition"
                      >
                        🏷️ Label
                      </button>

                      {/* Track */}
                      <button
                        onClick={() => handleTrackShipment(row._id)}
                        className="flex items-center mx-2 gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 shadow-sm transition"
                      >
                        🚚 Track
                      </button>

                      {/* Cancel */}
                      <button
                        onClick={() => handleCancelShipment(row._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 shadow-sm transition"
                      >
                        ❌ Cancel
                      </button>
                      {props?.userData?.user?.role === "ADMIN" ? <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                        <DeleteIcon color="error" />
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
            count={filteredOrders?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>}
      <Dialog open={order} maxWidth="md" fullWidth onClose={handleOrderClose}>
        <DialogTitle> Courier Order</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleOrderClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
        <DialogContent>
          {loading === true ? <div className='w-[400px]'><ReactLoader /> </div>
            :

            // <form onSubmit={handleSubmit(partOrder)} className="max-w-lg mx-auto grid grid-cols-1 gap-2 md:grid-cols-2  bg-white   rounded-md">



            //   <div>
            //     <label id="service-center-label" className="block text-sm font-medium text-black ">
            //       Sparepart Name
            //     </label>

            //     <select
            //       id="service-center-label"
            //       value={selectedSparepart}
            //       onChange={handleSparepartChange}
            //       className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            //     >
            //       <option value="" disabled>Select Sparepart</option>
            //       {props?.sparepart?.map((center) => (
            //         <option key={center.id} value={center._id}>
            //           {center.partName}
            //         </option>
            //       ))}
            //     </select>

            //   </div>
            //   {props?.userData?.user?.role === "BRAND" ?
            //     <div>
            //       <label id="service-center-label" className="block text-sm font-medium text-black ">
            //         Service Center Name
            //       </label>

            //       <select
            //         id="service-center-label"
            //         value={selectedserviceCenter}
            //         onChange={handleServiceCenterChange}
            //         className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            //       >
            //         <option value="" disabled>Select Service Center</option>
            //         {props?.serviceCenter?.map((center) => (
            //           <option key={center.id} value={center._id}>
            //             {center.serviceCenterName}
            //           </option>
            //         ))}
            //       </select>

            //     </div>
            //     :
            //     <div>
            //       <label id="service-center-label" className="block text-sm font-medium text-black ">
            //         Brand Name
            //       </label>

            //       <select
            //         id="service-center-label"
            //         value={selectedBrand}
            //         onChange={handleBrandChange}
            //         className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            //       >
            //         <option value="" disabled>Select Brand</option>
            //         {props?.brand?.map((center) => (
            //           <option key={center.id} value={center._id}>
            //             {center.brandName}
            //           </option>
            //         ))}
            //       </select>

            //     </div>
            //   }
            //   <div>
            //     <label className="block text-gray-700 "> Model Number</label>
            //     <input {...register('partNumber', { required: 'Part Number is required' })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            //     {errors.partNumber && <p className="text-red-500 text-sm mt-1">{errors.partNumber.message}</p>}
            //   </div>
            //   <div>
            //     <label className="block text-gray-700 ">Quantity</label>
            //     <input {...register('quantity', { valueAsNumber: true }, { required: 'Quantity is required' })} type="number" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            //     {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
            //   </div>
            //   {props?.userData?.user?.role === "SERVICE" ? 
            //    <div>
            //    <div>
            //     <label className="block text-gray-700">Stock Type</label>
            //     <select
            //       value={stockType}
            //       onChange={(e) => setStockType(e.target.value)}
            //       className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            //     >
            //       <option value="fresh">Fresh Stock</option>
            //       <option value="defective">Defective Stock</option>
            //     </select>
            //   </div>


            //   {stockType === 'defective' && (
            //     <div>
            //       <label className="block text-gray-700">Attach Image</label>
            //       <input
            //         type="file"
            //         {...register('defectiveImage', { required: stockType === 'defective' })}
            //         className="mt-1 block w-full text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            //       />
            //       {errors.defectiveImage && <p className="text-red-500 text-sm mt-1">{errors.defectiveImage.message}</p>}
            //     </div>
            //   )}
            //     </div>

            //   :""}
            //   <div className='col-span-2'>
            //     <label className="block text-gray-700 ">Comments/Notes</label>
            //     <textarea {...register('comments')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
            //     {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
            //   </div>


            //   <button type="submit" className="w-full py-2 mt-3 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Submit</button>

            // </form>
            <>
              {/* {orderDefective ? <SparePartsDefcetiveForm sparepart={props?.sparepart} brands={props?.brand} userData={props?.userData} centers={props?.serviceCenter} RefreshData={props?.RefreshData} onClose={handleOrderClose} />
                : <SparePartsForm sparepart={props?.sparepart} brands={props?.brand} userData={props?.userData} centers={props?.serviceCenter} RefreshData={props?.RefreshData} onClose={handleOrderClose} />

              }  */}
              <CreateOrderDialog sparepart={props?.sparepart} brands={props?.brand} userData={props?.userData} centers={props?.serviceCenter} RefreshData={props?.RefreshData} onClose={handleOrderClose} />
            </>
          }

        </DialogContent>

      </Dialog>
      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
    </div>
  );
};

export default CourierOrderList;

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
