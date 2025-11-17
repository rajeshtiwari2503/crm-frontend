
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

const BankDetailsList = ({ RefreshData, data, value }) => {

    const [existingDetails, setExistingDetails] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();







    const AddBankDetails = async (data) => {
        try {

            const reqData = { ...data, userId: value?.user?._id, userName: value?.user?.role==="BRAND"?value?.user?.brandName: value?.user?.serviceCenterName }

            setLoading(true);
            const endpoint = existingDetails?._id ? `/editBankDetails/${existingDetails._id}` : '/addBankDetails';
            const response = existingDetails?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, reqData);
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            RefreshData(responseData);
            setIsModalOpen(false)
        } catch (err) {
            setLoading(false);

            console.log(err);
        }
    };
    const onSubmit = async (data) => {

        AddBankDetails(data)
    };
    const handleEditModalOpen = (row) => {
        setExistingDetails(row)
        setValue("bankName", row?.bankName)
        setValue("accountHolderName", row?.accountHolderName)
        setValue("accountNumber", row?.accountNumber)
        setValue("IFSC", row?.IFSC)
        setValue("commission", row?.commission)
        setIsModalOpen(true)
    }
    return (

        <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">


                <div className="flex justify-between mb-5">
                    <div className='font-bold text-xl'>Wallet & Bank Details</div>
                    {data === "" ?
                        <Button className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center ' variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
                            Add Bank Details
                        </Button>
                        : ""
                    }
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
                                                    // onClick={() => handleSort('brandName')}
                                                >
                                                    User Name
                                                </TableSortLabel>
                                            </TableCell>

                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'addedAmount'}
                                                    direction={sortDirection}
                                                    // onClick={() => handleSort('addedAmount')}
                                                >
                                                    Bank Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'addedAmount'}
                                                    direction={sortDirection}
                                                    // onClick={() => handleSort('addedAmount')}
                                                >
                                                    Account Holder Name
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'addedAmount'}
                                                    direction={sortDirection}
                                                    // onClick={() => handleSort('addedAmount')}
                                                >
                                                    Account No.
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'addedAmount'}
                                                    direction={sortDirection}
                                                    // onClick={() => handleSort('addedAmount')}
                                                >
                                                    IFSC Code
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={sortBy === 'createdAt'}
                                                    direction={sortDirection}
                                                    // onClick={() => handleSort('createdAt')}
                                                >
                                                    CreatedAt
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {data === "" ? "" :
                                        <TableBody>

                                            <TableRow hover>
                                                <TableCell>{data?.userName}  </TableCell>
                                                <TableCell>{data?.bankName}</TableCell>
                                                <TableCell>{data?.accountHolderName}</TableCell>
                                                <TableCell>{data?.accountNumber}  </TableCell>
                                                <TableCell>{data?.IFSC}  </TableCell>


                                                <TableCell>{new Date(data?.createdAt).toLocaleString()}</TableCell>
                                                <TableCell>
                                                    {/* <IconButton aria-label="view" onClick={() => handleView(row.id)}>
                                                        <Visibility color='primary' />
                                                    </IconButton> */}
                                                    <IconButton aria-label="edit" onClick={() => handleEditModalOpen(data)}>
                                                        <EditIcon color='success' />
                                                    </IconButton>
                                                    {/* <IconButton aria-label="delete" onClick={() => handleDelete(row.id)}>
                                                        <DeleteIcon color='error' />
                                                    </IconButton> */}
                                                </TableCell>
                                            </TableRow>

                                        </TableBody>
                                    }
                                </Table>
                            </TableContainer>

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

                        {/* <div className="mb-4">
                            <label className="block text-gray-700">Commission</label>
                            <input
                                type="number"
                                className="form-control w-full border p-2 border-gray-300"
                                {...register('commission')}
                                placeholder="Commission (optional)"
                            />
                        </div> */}
                        <div className='flex justify-between mt-8'>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className={`border border-red-500 text-red-500 hover:bg-[#fe3f49] hover:text-black py-2 px-4 rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={loading}
                                style={{ pointerEvents: loading ? 'none' : 'auto' }}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className={`border border-green-500 text-green-500 hover:bg-[#2e7d32] hover:text-black py-2 px-4 rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={loading}
                                style={{ pointerEvents: loading ? 'none' : 'auto' }}
                            >
                                {existingDetails ? "Edit Bank Details" : "Add Bank Details"}
                            </button>

                        </div>


                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
};

export default BankDetailsList;

