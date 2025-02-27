
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

const ServiceTransactionList = ({ data, RefreshData, wallet, bankDetails, loading, value }) => {

const router=useRouter()

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
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();



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

    // console.log(wallet);

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
    return (

        <div className="body d-flex py-lg-3 py-md-2">
            <Toaster />
            <div className="container-xxl">



                <div className="flex justify-between mb-5">
                    <div className='font-bold text-xl'> Service Center Transactions List</div>

                </div>

                {loading ? <div><ReactLoader /></div>
                    :

                    <div className="col-sm-12">
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow >
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
                                                Pay_Date
                                            </TableSortLabel>
                                        </TableCell>
                                        {value?.role === "ADMIN"   ? <TableCell>Actions</TableCell> : null}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sortedData?.map((row, index) => (
                                        <TableRow  key={index} hover>
                                            <TableCell onClick={()=>router.push(`/complaint/details/${row?.complaintId}`)}>{row.i}</TableCell>
                                            <TableCell onClick={()=>router.push(`/complaint/details/${row?.complaintId}`)}>{row?.serviceCenterName}</TableCell>
                                            <TableCell>{row?.city}</TableCell>
                                            <TableCell>{row?.address}</TableCell>
                                            <TableCell>{row?.description}</TableCell>
                                            <TableCell>{row?.contactNo}</TableCell>


                                            <TableCell>{row.payment} INR</TableCell>
                                            <TableCell>
                                                {row.qrCode ? <ImagePopup src={row.qrCode} alt="QR Code" /> : "No Image"}
                                            </TableCell>

                                            <TableCell>
                                                {row.payScreenshot ? <ImagePopup src={row.payScreenshot} alt="Payment Screenshot" /> : "No Image"}
                                            </TableCell>
                                            <TableCell style={{ textAlign: "center" }} >
                                                <div className={row?.status === "UNPAID" ? 'bg-red-400   text-white p-2 rounded-md' : 'bg-green-400 text-white p-2 rounded-md'}>
                                                    <div>{row.status}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
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
                                                {value?.role === "ADMIN" && row?.status === "UNPAID"?
                                                    <IconButton aria-label="edit" onClick={() => handleUpdateModalOpen(row?._id)}>
                                                        <Payments color='success' />

                                                    </IconButton>

                                                    : null
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
                                className={`border border-green-500 text-green-500 hover:bg-[#2e7d32] hover:text-white py-2 px-4 rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={uploading}
                                style={{ pointerEvents: uploading ? 'none' : 'auto' }}
                                onClick={UpdateStatus}
                            >
                                Update
                            </button>

                        </div>
                    </form>
                </DialogContent>
            </Dialog>


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
