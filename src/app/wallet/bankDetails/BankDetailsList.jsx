
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

const BankDetailsList = () => {
    const [brandDetails, setBrandDetails] = useState();
    const [walletDetails, setWalletDetails] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset } = useForm();



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
        console.log("fjgh");
    };

    return (

        <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">

                <div className="flex justify-between mb-5">
                    <div className='font-bold text-xl'>Wallet & Bank Details</div>
                    <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                        Add Bank Details
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
                <DialogTitle id="form-dialog-title">Add Bank Details</DialogTitle>
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
                    <form onSubmit={handleSubmit(onSubmit)} className="w-[350px] ">


                        <div className="mb-4 ">
                            <label className="block text-gray-700">Bank Name</label>
                            <input
                                type="text"
                                className={`form-control w-full border p-2 ${errors.bankName ? 'border-red-400' : 'border-gray-300'}`}
                                {...register('bankName', { required: 'Bank Name is required' })}
                                placeholder="Bank Name"
                            />
                            {errors.bankName && <span className="text-red-400">{errors.bankName.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Account Holder Name</label>
                            <input
                                type="text"
                                className={`form-control w-full border p-2 ${errors.accountHolderName ? 'border-red-400' : 'border-gray-300'}`}
                                {...register('accountHolderName', { required: 'Account Holder Name is required' })}
                                placeholder="Account Holder Name"
                            />
                            {errors.accountHolderName && <span className="text-red-400">{errors.accountHolderName.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Account Number</label>
                            <input
                                type="text"
                                className={`form-control w-full border p-2 ${errors.accountNumber ? 'border-red-400' : 'border-gray-300'}`}
                                {...register('accountNumber', { required: 'Account Number is required' })}
                                placeholder="Account Number"
                            />
                            {errors.accountNumber && <span className="text-red-400">{errors.accountNumber.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">IFSC</label>
                            <input
                                type="text"
                                className={`form-control w-full border p-2 ${errors.IFSC ? 'border-red-400' : 'border-gray-300'}`}
                                {...register('IFSC', { required: 'IFSC is required' })}
                                placeholder="IFSC"
                            />
                            {errors.IFSC && <span className="text-red-400">{errors.IFSC.message}</span>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700">Commission</label>
                            <input
                                type="number"
                                className="form-control w-full border p-2 border-gray-300"
                                {...register('commission')}
                                placeholder="Commission (optional)"
                            />
                        </div>
                        <div className='flex justify-between mt-8'>
                            <Button variant="outlined" onClick={() => setIsModalOpen(false)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                                Cancel
                            </Button>

                            <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                Add Bank Details
                            </Button>

                        </div>


                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default BankDetailsList;
