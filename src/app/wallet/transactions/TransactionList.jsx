
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

const TransactionList = () => {
    const [brandDetails, setBrandDetails] = useState();
    const [walletDetails, setWalletDetails] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        getBrandDetails();
        getWalletDetails();
    }, []);

    const getBrandDetails = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            const response = await http_request.get(`/getBrandBy/${user?._id}`);
            setBrandDetails(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const getWalletDetails = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            const response = await http_request.get(`/getWalletTransaction/${user?._id}`);
            setWalletDetails(response.data.reverse());
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSort = (column) => {
        const isAsc = sortBy === column && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortBy(column);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = walletDetails.sort((a, b) => {
        const isAsc = sortDirection === 'asc';
        switch (sortBy) {
            case 'id':
                return isAsc ? a.id - b.id : b.id - a.id;
            case 'name':
                return isAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            case 'email':
                return isAsc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
            default:
                return 0;
        }
    });

    const onSubmit = async (data) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
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
                            response: { ...orderDetails, amount: data.amount, _id: brandDetails?._id }
                        });
                        window.location.reload();
                        ToastMessage(paymentResponse.data);
                    } catch (err) {
                        console.error(err);
                    }
                },
                prefill: {
                    name: brandDetails?.brandName,
                    email: brandDetails?.email,
                    contact: brandDetails?.contact
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

                    <div className="flex justify-between mb-5">
                        <div className='font-bold text-xl'>Wallet & Bank Details</div>
                        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                            Add Amount
                        </Button>
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
                                    count={walletDetails.length}
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
