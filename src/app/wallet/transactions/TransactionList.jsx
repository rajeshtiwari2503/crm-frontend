
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
import { Visibility, Edit as EditIcon, Delete as DeleteIcon, Close } from '@mui/icons-material';
import http_request from '../../../../http-request'
import { useForm } from 'react-hook-form';


import { ReactLoader } from '../../components/common/Loading';
import { ToastMessage } from '@/app/components/common/Toastify';

const TransactionList = ({ data, RefreshData, value }) => {
    console.log(value);

    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();



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




    const onSubmit = async (data) => {
        try {

            const response = await http_request.post("/walletPayment", { amount: data.amount });
            const options = {
                key: "rzp_live_yEWZ902y0STtSb",
                amount: response.data.amount,
                currency: "INR",
                name: "SpareTrade",
                description: "Payment for wallet",
                image: "https://lybley-webapp-collection.s3.amazonaws.com/PNG-031.png-1684751868223-284237810",
                order_id: response.data.id,
                handler: async (orderDetails) => {
                    try {
                        const paymentResponse = await axios.post("https://sparetradebackend-production.up.railway.app/paymentVerificationForWallet", {
                            response: { ...orderDetails, amount: data.amount, _id: value?.user?._id }
                        });
                        window.location.reload();
                        ToastMessage(paymentResponse.data);
                    } catch (err) {
                        console.error(err);
                    }
                },
                prefill: {
                    name: value?.user?.name,
                    email: value?.user?.email,
                    contact: value?.user?.contact
                },
                notes: {
                    address: "Razorpay Corporate Office"
                },
                theme: {
                    color: "#3399cc"
                }
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        } catch (err) {
            console.error(err);
        }
    };

    return (

        <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">

                <div className="flex justify-between bg-blue-100 rounded-md p-5 items-center mb-5">
                    <div className='font-bold text-xl  '>Wallet </div>
                    <div>
                        <div className='font-bold text-sm  '>Current Wallet Balance </div>
                        <div className='font-bold text-md mr-5 ml-5 flex justify-center bg-red-500 rounded-md p-2'>500 </div>
                    </div>
                    <div>
                        <div className='font-bold text-sm  '>Total Commissions Earned  </div>
                        <div className='font-bold text-md mr-5 ml-5 flex justify-center bg-green-500 rounded-md p-2'>500 </div>
                    </div>
                    <Button className='flex  bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center ' variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        Withdrawal Amount
                    </Button>
                </div>
                <div className="flex justify-between mb-5">
                    <div className='font-bold text-xl'> Bank Transactions List</div>
                    {/* <Button className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center ' variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                            Add Amount
                        </Button> */}
                </div>
                <div className="row clearfix g-3">
                    {loading ? (
                        <div className='d-flex justify-content-center align-items-center'>
                            <ReactLoader />
                        </div>
                    ) : (
                        <div className="col-sm-12">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'brandName'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('brandName')}
                                                >
                                                    User Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'addedAmount'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('addedAmount')}
                                                >
                                                    Paid Amount
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'createdAt'}
                                                    direction={sortDirection}
                                                    onClick={() => handleSort('createdAt')}
                                                >
                                                    Payment Release Date
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{row.brandName}</TableCell>
                                                <TableCell>{row.addedAmount} INR</TableCell>
                                                <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <IconButton aria-label="view" onClick={() => handleView(row.id)}>
                                                        <Visibility color='primary' />
                                                    </IconButton>
                                                    <IconButton aria-label="edit" onClick={() => handleEditModalOpen(row)}>
                                                        <EditIcon color='success' />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
                                                        <DeleteIcon color='error' />
                                                    </IconButton>
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
                    )}
                </div>
            </div>
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Amount</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setIsModalOpen(false)}
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-1 w-[350px]">
                            <label className="form-label">Amount</label>
                            <div className='mt-3'>
                                <input
                                    type="number"
                                    className={`form-control w-full border p-3 ${errors.amount ? 'border-red-400' : 'border-blue-400'}`}
                                    {...register('amount', { required: 'Amount is required' })}
                                    placeholder="Amount"
                                />
                            </div>
                            <div className="text-red-400">{errors.amount?.message}</div>
                        </div>
                        <DialogActions>
                            <Button onClick={() => setIsModalOpen(false)} color="secondary">
                                Close
                            </Button>
                            <Button type="submit" color="primary">
                                Add Wallet Amount
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default TransactionList;

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
