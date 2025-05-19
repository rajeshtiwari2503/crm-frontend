
"use client"
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    IconButton,
    Button,
    TextField,
    CircularProgress,
} from '@mui/material';
import { Visibility, Edit as EditIcon, Delete as DeleteIcon, Close, Wallet, Payments } from '@mui/icons-material';
import http_request from '../../../../http-request'
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';

import { ReactLoader } from '../../components/common/Loading';
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import DownloadExcel from '@/app/components/DownLoadExcel';
import { PaymentConfirmBox } from '@/app/components/common/ConfirmBoxPayment';
import DatePicker from 'react-datepicker';

const ServiceTransactionList = ({ data, RefreshData, wallet, bankDetails, loading, value }) => {

    const router = useRouter()

    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isId, setId] = useState(false);
    const [payLoading, setPayLoading] = useState(false);
    const [uploading, setLoading] = useState(false);
    const [image, setImage] = useState("")
    // const [searchTerm, setSearchTerm] = useState("");
    // const [filterStatus, setFilterStatus] = useState("all");
    const [confirmBoxView, setConfirmBoxView] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();


    const [service, setService] = useState([])
    const [filterStatus, setFilterStatus] = useState("all"); // for PAID/UNPAID
    const [filterServiceCenterType, setFilterServiceCenterType] = useState("allServiceCenters"); // for type
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {

        getAllService()

    }, [])


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


    const getAllService = async () => {
        try {
            let response = await http_request.get("/getAllService")
            let { data } = response;

            setService(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    console.log("service", service);


    // const filteredData = data?.reduce((acc, item) => {
    //     const matchesSearch =
    //         item?.serviceCenterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item?.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item?.contactNo?.toString().includes(searchTerm); // Now properly included

    //     const matchesStatus = filterStatus === "all" || item.status === filterStatus;

    //     if (matchesSearch && matchesStatus) {
    //         acc.push(item);
    //     }

    //     return acc;
    // }, []);


    const enrichedData = data?.map(item => {
        const matchedService = service.find(
            s => s.serviceCenterName === item.serviceCenterName
        );
        return {
            ...item,
            serviceCenterType: matchedService?.serviceCenterType || "Unknown"
        };
    });


    // const filteredData = enrichedData?.reduce((acc, item) => {
    //     const matchesSearch =
    //         item?.serviceCenterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item?.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         item?.contactNo?.toString().includes(searchTerm);

    //     const matchesStatus = filterStatus === "all" || item?.status === filterStatus;

    //     const matchesServiceCenterType =
    //         filterServiceCenterType === "allServiceCenters" ||
    //         item?.serviceCenterType === filterServiceCenterType;

    //     if (matchesSearch && matchesStatus && matchesServiceCenterType) {
    //         acc.push(item);
    //     }

    //     return acc;
    // }, []);

    const filteredData = enrichedData?.reduce((acc, item) => {
        const matchesSearch =
            item?.serviceCenterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.complaintId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item?.contactNo?.toString().includes(searchTerm);

        const matchesStatus =
            filterStatus === "all" || item?.status === filterStatus;

        const matchesServiceCenterType =
            filterServiceCenterType === "allServiceCenters" ||
            item?.serviceCenterType === filterServiceCenterType;

        const itemDate = new Date(item?.updatedAt); // ✅ use updatedAt field

        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate + 'T23:59:59.999Z') : null; // ✅ include entire end day

        const isWithinDateRange =
            (!start || itemDate >= start) &&
            (!end || itemDate <= end);

        if (
            matchesSearch &&
            matchesStatus &&
            matchesServiceCenterType &&
            isWithinDateRange
        ) {
            acc.push(item);
        }

        return acc;
    }, []);



    const sortedData = stableSort(filteredData, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    const handleUpdateModalOpen = (id) => {
        setIsUpdateModalOpen(true)
        setId(id)
    }
    const handleFileChange = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])

            setImage(e.target.files[0])

        }
    }
    const UpdateStatus = async () => {
        try {
            if (image === "") {
                ToastMessage({ staus: true, msg: "Please select image" });
            }
            setLoading(true);
            const formData = new FormData();
            formData.append('payScreenshot', image);
            const response = await http_request.patch(`/editServicePayment/${isId}`, formData)
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            RefreshData(responseData);
            setIsUpdateModalOpen(false)
            setImage("")

        } catch (err) {
            setLoading(false);

            console.log(err);
        }
    };
    // const UpdatePaymentStatus = async () => {
    //     try {

    //         setLoading(true);
    //         const formData = new FormData();
    //         formData.append('status', "PAID");
    //         const response = await http_request.patch(`/editServicePayment/${isId}`, formData)
    //         const { data: responseData } = response;
    //         ToastMessage(responseData);
    //         setLoading(false);
    //         RefreshData(responseData);
    //         setIsUpdateModalOpen(false)
    //         setImage("")
    //         setConfirmBoxView(false);

    //     } catch (err) {
    //         setLoading(false);
    //         setConfirmBoxView(false);
    //         console.log(err);
    //     }
    // };

    const UpdatePaymentStatus = async () => {
        try {
            setLoading(true);

            const response = await http_request.put('/updateBulkPayments', {
                ids: selectedRows,   // selectedRows should be an array of selected IDs

            });

            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            RefreshData(responseData);
            setIsUpdateModalOpen(false);
            setImage('');
            setConfirmBoxView(false);
            setSelectedRows([]); // Clear selection after update

        } catch (err) {
            setLoading(false);
            setConfirmBoxView(false);
            console.log(err);
        }
    };

    const handlePaidStatus = (id) => {
        setConfirmBoxView(true);
        setId(id)
    }
    // console.log(sortedData.length);

    const ImagePopup = ({ src, alt }) => {
        const [open, setOpen] = useState(false);

        return (
            <>
                {/* Small Image (Click to Open) */}
                <img
                    src={src}
                    alt={alt}
                    width={50}
                    height={30}
                    className="rounded-md cursor-pointer border border-gray-300"
                    onClick={() => setOpen(true)}
                />

                {/* Modal Popup */}
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <div className="p-2">
                        <img src={src} alt={alt} className="w-[400px] h-[500px] rounded-md" />
                    </div>
                </Dialog>
            </>
        );
    };



    const totals = filteredData.reduce((acc, item) => {
        const amount = parseFloat(item.payment); // Convert string to number
        if (item.status === "PAID") {
            acc.totalPaid += amount;
        } else if (item.status === "UNPAID") {
            acc.totalUnpaid += amount;
        }
        return acc;
    }, { totalPaid: 0, totalUnpaid: 0 });


    // console.log("selectedRows", selectedRows);
    // console.log("Total Unpaid Amount:", totals.totalUnpaid);
    return (

        <div className="body d-flex py-lg-3 py-md-2">
            <Toaster />
            <div className="  ">
                <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-2 mb-4 ">
                    <div className="border-gray-300 rounded-md ">
                        <div className="flex flex-wrap gap-2">
                            {/* Status Filters */}
                            <button onClick={() => setFilterStatus("all")} className={`px-4 py-2 rounded ${filterStatus === "all" ? "bg-gray-500 text-white" : "bg-gray-300"}`}>All</button>
                            <button onClick={() => setFilterStatus("PAID")} className={`px-4 py-2 rounded ${filterStatus === "PAID" ? "bg-green-500 text-white" : "bg-gray-300"}`}>Paid</button>
                            <button onClick={() => setFilterStatus("UNPAID")} className={`px-4 py-2 rounded ${filterStatus === "UNPAID" ? "bg-red-500 text-white" : "bg-gray-300"}`}>Unpaid</button>

                        </div>

                    </div>
                    <div className="  flex flex-col items-center justify-center   p-1">
                        <div className="bg-white shadow-lg rounded-lg p-2 w-full  ">
                            {/* <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
                                Payment Summary
                            </h2> */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 justify-center'>
                                <div className="flex justify-between items-center bg-green-100 p-2 rounded-lg  ">
                                    <span className="text-lg font-semibold text-green-600">Total Paid:</span>
                                    <span className="text-lg font-bold text-green-700">₹{totals.totalPaid}</span>
                                </div>
                                <div className="flex justify-between items-center bg-red-100 p-4 rounded-lg  ">
                                    <span className="text-lg font-semibold text-red-600">Total Unpaid:</span>
                                    <span className="text-lg font-bold text-red-700">₹{totals.totalUnpaid}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3 mb-4 border-gray-300 rounded-md mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 justify-center">

                            <button onClick={() => setFilterServiceCenterType("allServiceCenters")} className={`px-4 py-2 rounded ${filterServiceCenterType === "allServiceCenters" ? "bg-blue-500 text-white" : "bg-gray-300"}`}>All Service Centers</button>
                            <button onClick={() => setFilterServiceCenterType("Authorized")} className={`px-4 py-2 rounded ${filterServiceCenterType === "Authorized" ? "bg-indigo-500 text-white" : "bg-gray-300"}`}>Authorized</button>
                            <button onClick={() => setFilterServiceCenterType("Franchise")} className={`px-4 py-2 rounded ${filterServiceCenterType === "Franchise" ? "bg-yellow-500 text-white" : "bg-gray-300"}`}>Franchise</button>
                            <button onClick={() => setFilterServiceCenterType("Independent")} className={`px-4 py-2 rounded ${filterServiceCenterType === "Independent" ? "bg-purple-500 text-white" : "bg-gray-300"}`}>Independent</button>
                        </div>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center items-center mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                value={startDate || ""}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                value={endDate || ""}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className=" flex justify-center">
                    <div className="  ">
                        <input
                            type="text"
                            placeholder="Search by Name , City,Contact, or Complaint ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center items-center overflow-x-auto mb-5">
                    <div className='font-bold text-xl'> Service Center Transactions List</div>
                    {value?.role === "ADMIN" ?
                        <div className="">
                            {sortedData.length > 0 && (
                                <DownloadExcel
                                    data={filteredData}
                                    fileName="ServiceCenterPaymentList"
                                    fieldsToInclude={[
                                        "_id",
                                        "complaintId",
                                        "serviceCenterId",
                                        "serviceCenterName",
                                        "payment",
                                        "description",
                                        "contactNo",
                                        "city",
                                        "address",
                                        "status",
                                        "createdAt",
                                        "updatedAt",
                                    ]}
                                />
                            )}
                        </div>
                        : ""}

                </div>

                {!data?.length>0 ? <div className='h-[400px] flex justify-center items-center'> Data not available !</div>
                    :
                    <div className='flex justify-center'>
                        <div className="md:w-full  w-[250px]   ">

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow >
                                            <TableCell >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.length === sortedData.length && sortedData.length > 0}
                                                    onChange={(e) => {
                                                        // if (e.target.checked) {
                                                        //     const allIds = sortedData.map((row) => row._id);
                                                        //     setSelectedRows(allIds);
                                                        // } else {
                                                        //     setSelectedRows([]);
                                                        // }
                                                        if (e.target.checked) {
                                                            const allUnpaidIds = sortedData
                                                                .filter((row) => row.status === "UNPAID")
                                                                .map((row) => row._id);
                                                            setSelectedRows(allUnpaidIds);
                                                        }
                                                        else {
                                                            setSelectedRows([]);
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell >
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    Sr. No.
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    Service_Center
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    City
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    Addess
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    Description
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    Contact
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    Month
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'addedAmount'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('addedAmount')}
                                                >
                                                    Paid_Amount
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'payScreenshot'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('payScreenshot')}
                                                >
                                                    QR_Code
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'payScreenshot'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('payScreenshot')}
                                                >
                                                    Pay_Screenshot
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
                                                    Create_Date
                                                </TableSortLabel>
                                            </TableCell>
                                             <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'createdAt'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('createdAt')}
                                                >
                                                    Pay_Date
                                                </TableSortLabel>
                                            </TableCell>
                                            {value?.role === "ADMIN" ? <TableCell>Actions</TableCell> : null}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {sortedData?.map((row, index) => {
                                            const isSelected = selectedRows.includes(row._id);
                                            const handleCheckboxChange = () => {
                                                if (isSelected) {
                                                    setSelectedRows(prev => prev.filter(id => id !== row._id));
                                                } else {
                                                    setSelectedRows(prev => [...prev, row._id]);
                                                }
                                            };
                                            return (
                                                <TableRow key={index} hover>
                                                    <TableCell>
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={handleCheckboxChange}
                                                        />
                                                    </TableCell>
                                                    <TableCell onClick={() => router.push(`/complaint/details/${row?.complaintId}`)}>{row.i}</TableCell>
                                                    {/* <TableCell onClick={() => router.push(`/complaint/details/${row?.complaintId}`)}>{row?.serviceCenterName}</TableCell> */}
                                                    <TableCell
                                                        style={{ color: "blue", cursor: "pointer" }}
                                                        onClick={() => router.push(`/complaint/details/${row?.complaintId}`)}
                                                    >
                                                        {row?.serviceCenterName}
                                                    </TableCell>
                                                    <TableCell>{row?.city}</TableCell>
                                                    <TableCell>{row?.address}</TableCell>
                                                    <TableCell>{row?.description}</TableCell>
                                                    <TableCell>{row?.contactNo}</TableCell>
                                                    <TableCell>{row?.month}</TableCell>


                                                    <TableCell>{row.payment} INR</TableCell>
                                                    <TableCell>
                                                        {row.qrCode ? <ImagePopup src={row.qrCode} alt="QR Code" /> : "No Image"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {row.payScreenshot ? <ImagePopup src={row.payScreenshot} alt="Payment Screenshot" /> : "No Image"}
                                                    </TableCell>
                                                    <TableCell style={{ textAlign: "center" }}  >
                                                        <div
                                                            onClick={row?.status === "UNPAID" && value?.role === "ADMIN" ? () => handlePaidStatus(row?._id) : undefined}
                                                            className={row?.status === "UNPAID" ? 'bg-red-400  cursor-pointer  text-white p-2 rounded-md' : 'bg-green-400 text-white p-2 rounded-md'}>
                                                            <div>{row.status}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                                                    <TableCell>{new Date(row.updatedAt).toLocaleString()}</TableCell>
                                                    {/* <TableCell>
                                                    <IconButton aria-label="view" onClick={() => handleView(row.id)}>
                                                        <Visibility color='primary' />
                                                    </IconButton>
                                                    <IconButton aria-label="edit" onClick={() => handleEditModalOpen(row)}>
                                                        <EditIcon color='success' />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
                                                        <DeleteIcon color='error' />
                                                    </IconButton>
                                                </TableCell> */}
                                                    <TableCell>
                                                        {value?.role === "ADMIN" || value?.role === "EMPLOYEE" && row?.status === "UNPAID" ?
                                                            <IconButton aria-label="edit" onClick={() => handleUpdateModalOpen(row?._id)}>
                                                                <Payments color='success' />

                                                            </IconButton>

                                                            : null
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>
                    </div>

                }
            </div>
            <Dialog open={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Update Status</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setIsUpdateModalOpen(false)}
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
                    <form onSubmit={UpdateStatus}>
                        <div className="mb-1 w-[350px]">

                            <div>
                                <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">
                                    Payment Screenshot
                                </label>
                                <input
                                    id="images"
                                    name="images"
                                    type="file"
                                    onChange={(e) => handleFileChange(e)}
                                    multiple
                                    accept="image/*, video/*"
                                    // {...register('issueImages', { required: 'Images/Videos are required' })}
                                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.issueImages ? 'border-red-500' : ''}`}
                                />
                                {image === "" ? <p className="text-red-500 text-sm mt-1">{"Uploade Image"}</p> : ""}
                            </div>
                        </div>

                        <div className='flex justify-between mt-8'>
                            <button
                                onClick={() => setIsUpdateModalOpen(false)}
                                className={`border border-red-500 text-red-500 hover:bg-[#fe3f49] hover:text-black py-2 px-4 rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                            // disabled={payLoading}
                            // style={{ pointerEvents: loading ? 'none' : 'auto' }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={`border border-green-500 text-green-500 hover:bg-[#2e7d32] hover:text-white py-2 px-4 rounded ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={uploading}
                                style={{ pointerEvents: uploading ? 'none' : 'auto' }}
                                onClick={UpdateStatus}
                            >
                                {uploading ? "Updating...." : "Update"}
                            </button>

                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <PaymentConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={UpdatePaymentStatus} />
        </div>

    );
};

export default ServiceTransactionList;

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
