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


const OrderList = (props) => {

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


  const brandData = props?.data?.filter((f) => f?.brandId === selectedBrandFiltr)


  const data = selectedBrandFiltr === "" ? data1 : brandData
  const sortedData = stableSort(data, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



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
  const partOrder = async (data) => {
    try {
      setLoading(true)
      const storedValue = localStorage.getItem('user');
      const userInfo = storedValue ? JSON.parse(storedValue) : null;
      let endPoint =

        userInfo?.user?.role === 'BRAND' ?
          `/create-shipment`
          : stockType === "Fresh Stock" ? `/create-center-shipment` : `/create-defective-shipment`

      let response = await http_request.post(endPoint, data);
      let { data: responseData } = response;
      setOrder(false)
      setLoading(false)
      props?.RefreshData(responseData)

      ToastMessage(responseData?.orderStatus);
    } catch (err) {
      setLoading(false)

      console.log(err);
      ToastMessage(err.response.data);
    }
  };

  const handleDelete = (id) => {
    setConfirmBoxView(true);
    setId(id)
  }

  const handleAdd = () => {
    setOrder(true)
  }

  const handleOrderClose = () => {

    setOrder(false)
  }

  const handleDetails = (id) => {
    router.push(`/inventory/order/details/${id}`)
  }

  const handleManifest = async (id) => {
    try {
      let response = await http_request.post(`/fetchManifest`, { awbs: [id] });
      let { data } = response;
      console.log(data);

    } catch (err) {
      console.log(err);
    }
  };
  // const handleLabel = async (id) => {
  //   try {
  //     let response = await http_request.post(`/fetchLabels`, { awbs: [id] });
  //     let { data } = response;
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleLabel = async (id) => {
    try {
      // Make the API request to fetch the PDF data
      let response = await http_request.post(`/fetchLabels`, { awbs: [id] }, {
        responseType: 'blob', // Set response type to 'blob'
      });

      // Check if response is OK and contains a PDF
      if (response.status === 200 && response.data) {
        // Create a Blob from the response data
        let pdfBlob = new Blob([response.data], { type: 'application/pdf' });

        // Log the Blob size
        console.log('Blob size:', pdfBlob.size);

        // Create a URL for the Blob
        let pdfURL = URL.createObjectURL(pdfBlob);

        // Log the Blob URL
        console.log('Blob URL:', pdfURL);

        // Optionally open the Blob URL in a new window for debugging
        // window.open(pdfURL);

        // Create a link element
        let link = document.createElement('a');
        link.href = pdfURL;
        link.download = 'label.pdf'; // Set the file name for the downloaded PDF

        // Append the link to the document body
        document.body.appendChild(link);

        // Programmatically click the link to start the download
        link.click();

        // Clean up and revoke the object URL
        document.body.removeChild(link);
        URL.revokeObjectURL(pdfURL);
      } else {
        console.error('Invalid response or no PDF data');
      }

    } catch (err) {
      console.error('Error fetching PDF:', err);
    }
  };


  const handleTracking = async (id) => {
    try {
      let response = await http_request.get(`/trackingShipment?trackingNo=${id}`);
      let { data } = response;
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDeleteOrder = async () => {

    try {
      let response1 = await http_request.patch(`/editOrder/${id?._id}`, { status: "OrderCanceled" });
      let response2 = response1?.data;
      props?.RefreshData(response2)
      setConfirmBoxView(false);
      let response = await http_request.post(`/cancelShipment`, { awbs: [id?.shipyariOrder?.data?.[0]?.awbs?.[0]?.tracking?.awb] });
      let { data } = response;



      ToastMessage({ status: true, msg: "AWB Cancel Process Started" });
    } catch (err) {
      console.log(err);
    }
  };
  const handleSparepartChange = (event) => {

    const selectedId = event.target.value;
    const selectedpart = props?.sparepart?.find(center => center._id === selectedId);

    setSelectedSparepart(selectedId);
    setValue('sparepartId', selectedpart?._id);
    setValue('partName', selectedpart?.partName);
    setValue('partNumber', selectedpart?.partNo);
    setValue('breadth', selectedpart?.breadth);
    setValue('length', selectedpart?.length);
    setValue('weight', selectedpart?.weight);
    setValue('height', 1);
    setValue('bestPrice', selectedpart?.bestPrice);


    if (props?.userData?.user?.role === "BRAND") {
      setValue("brandAddress", props?.userData?.user?.streetAddress);
      setValue("brandPincode", props?.userData?.user?.postalCode);
      setValue("brandContact", props?.userData?.user?.contactPersonPhoneNumber);
      setValue('brandId', props?.userData?.user?._id);
      setValue('brand', props?.userData?.user?.brandName);

    }
    else {
      setValue('serviceCenterAddress', props?.userData?.user?.streetAddress);
      setValue('serviceCenterPincode', props?.userData?.user?.postalCode);
      setValue('serviceCenterId', props?.userData?.user?._id);
      setValue("serviceContact", props?.userData?.user?.contact);
      setValue('serviceCenter', props?.userData?.user?.serviceCenterName);

    }


  };
  const handleServiceCenterChange = (event) => {

    const selectedId = event.target.value;
    const selectedpart = props?.serviceCenter?.find(center => center._id === selectedId);
    setSelectedserviceCenter(selectedId);

    setValue('serviceCenter', selectedpart?.serviceCenterName);
    setValue('serviceCenterId', selectedpart?._id);
    setValue('supplierInformation.name', selectedpart?.serviceCenterName);
    setValue('supplierInformation.address', selectedpart?.streetAddress);
    setValue('supplierInformation.contact', selectedpart?.contact);
    setValue('supplierInformation.pinCode', selectedpart?.postalCode);


  };
  const handleBrandChange = (event) => {

    const selectedId = event.target.value;
    const selectedBrand = props?.brand?.find(center => center._id === selectedId);
    setSelectedBrand(selectedId);
    setValue('brand', selectedBrand?.brandName);
    setValue('brandId', selectedBrand?._id);
    setValue('supplierInformation.name', selectedBrand?.brandName);
    setValue('supplierInformation.address', selectedBrand?.streetAddress);
    setValue('supplierInformation.contact', selectedBrand?.contactPersonPhoneNumber);
    setValue('supplierInformation.pinCode', selectedBrand?.postalCode);
  };
  const handleStockTypeChange = (e) => setStockType(e.target.value);
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);


  const handleApproval = async (row) => {
    // console.log("row", row);

    try {
      setLoading(true);

      // Extract necessary data from the row
      const data = {
        orderId: row?._id, // Ensure order ID is sent
        spareParts: row?.spareParts || [], // Ensure spare parts data
        serviceCenterId: row?.serviceCenterId,
        serviceCenter: row?.serviceCenter,
        brandId: row?.brandId,
        brandName: row?.brandName,
      };

      let response = await http_request.patch(`/approvalServiceOrder`, data);
      let { data: responseData } = response;

      setOrder(false);
      setLoading(false);

      // Refresh data after successful approval
      props?.RefreshData(responseData);

      // Show success message
      ToastMessage(responseData);

    } catch (err) {
      setLoading(false);

      console.log("Approval Error:", err);

      // Handle errors safely
      const errorMessage = err?.response?.data?.msg || "Something went wrong!";
      ToastMessage(err.response.data);
    }
  };


  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-8'>
        <div className='font-bold text-2xl'>Order Information</div>
        {props?.userData?.user?.role === "ADMIN" || props?.userData?.user?.role === "SERVICE" || props?.userData?.user?.role === "BRAND" ?
          <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
            <Add style={{ color: "white" }} />
            <div className=' ml-2 text-white '>Add Order</div>
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
        <FormControl fullWidth style={{ marginBottom: '20px' }}>
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
        </FormControl>
      )}
      {!data?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> Data not available !</div>
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
                  <TableCell>Status</TableCell>
                  <TableCell>Approval</TableCell>
                  <TableCell>Docket No.</TableCell>
                  <TableCell>Track Link</TableCell>
                  <TableCell>Chalan Image</TableCell>
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
                          {part.sparePartName} (Qty: {part.quantity}, Price: ${part.price})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{row.brandName}</TableCell>
                    <TableCell>{row.spareParts.reduce((sum, part) => sum + part.quantity, 0)}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>
                      {row.brandApproval === "DISAPPROVED" ? (
                        <button
                          onClick={() => handleApproval(row)}
                          disabled={loading}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          {loading ? "Approval proceed..." : "Approve"}
                        </button>
                      ) : (
                        row.brandApproval
                      )}
                    </TableCell>
                    <TableCell>{row.docketNo}</TableCell>
                    <TableCell>
                      <a href={row.trackLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        Track
                      </a>
                    </TableCell>
                    <TableCell>
                      {/* <img src={row.chalanImage} alt="Chalan" width="50" height="50" /> */}
                      <a
                        href={row.chalanImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View chalan
                      </a>

                    </TableCell>
                    <TableCell>{new Date(row.orderDate).toLocaleString()}</TableCell>
                    <TableCell className="flex">
                      <IconButton aria-label="view" onClick={() => handleDetails(row._id)}>
                        <Visibility color="primary" />
                      </IconButton>
                      {props?.userData?.user?.role === "ADMIN" ? <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                        : ""}
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
      <Dialog open={order} onClose={handleOrderClose}>
        <DialogTitle> Part Order</DialogTitle>
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
            <SparePartsForm sparepart={props?.sparepart} brands={props?.brand} userData={props?.userData} centers={props?.serviceCenter} RefreshData={props?.RefreshData} onClose={handleOrderClose} />
          }
        </DialogContent>

      </Dialog>
      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />
    </div>
  );
};

export default OrderList;

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
