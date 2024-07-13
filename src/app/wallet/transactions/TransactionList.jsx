
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
import { Visibility, Edit as EditIcon, Delete as DeleteIcon, Close, Wallet } from '@mui/icons-material';
import http_request from '../../../../http-request'
import { useForm } from 'react-hook-form';


import { ReactLoader } from '../../components/common/Loading';
import { ToastMessage } from '@/app/components/common/Toastify';

const TransactionList = ({ data, RefreshData, wallet,bankDetails, loading, value }) => {
 

const adminBankDtl={
    "name":"Lybley India Pvt Ltd",
    "ifsc":"UTIB0CCH274",
    "account_number": "984510633140631"
}

    const [sortBy, setSortBy] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const { register, handleSubmit, formState: { errors }, reset,setValue } = useForm();



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



    const handleDuePayment = async (data) => {
        try {
            let centerData = localStorage.getItem("user")
            let centerInfo = JSON.parse(centerData)
           
            
            
            const serviceCenterPayInfo=
            {
                "account_number":adminBankDtl?.account_number,
                "amount":(data?.amount) * 100,
                "currency":"INR",
                "mode":"NEFT",
                "purpose":"payout",
                "fund_account":{
                    "account_type":"bank_account",
                    "bank_account":{
                        "name":bankDetails?.accountHolderName,
                        "ifsc":bankDetails?.IFSC,
                        "account_number": bankDetails?.accountNumber
                    },
                    "contact":{
                        "name":centerInfo?.user?.serviceCenterName,
                        "email":brand?.user?.email,
                        "contact":brand?.user?.contact,
                        "type":"employee",
                        "reference_id":"12345",
                        "notes":{
                            "notes_key_1":"Tea, Earl Grey, Hot",
                            "notes_key_2":"Tea, Earl Grey… decaf."
                        }
                    }
                },
                "queue_if_low_balance":true,
                "reference_id":"Acme Transaction ID 12345",
                "narration":"Acme Corp Fund Transfer",
                "notes":{
                    "notes_key_1":"Beam me up Scotty",
                    "notes_key_2":"Engage"
                }
            }

            let response = await httpCommon.post(`/serviceCenterDuePayment`, {...serviceCenterPayInfo,centerInfo:centerInfo})
            let { data } = response

            // if (data?.entity === "payout") {
            //     let response = await httpCommon.patch(`/updateTotalPay/${id}`, { totalPay:+totalPay,paidAmount: +payableAmmount ,commission:commisionPay })
            //     let { data } = response
               
              
            // }
            setIsModalOpen(false)
            RefreshData(data)
            ToastMessage(data);
        }
        catch (err) {
            console.log(err)
        }
    }
    // const onSubmit = async (res) => {
    //     try {
    //         // console.log(bankDetails);
    //        if (bankDetails){
    //         try {
    //             let centerData = localStorage.getItem("user")
    //             let centerInfo = JSON.parse(centerData)
    //             const serviceCenterPayInfo=
    //             {
    //                 "account_number":adminBankDtl?.account_number,
    //                 "amount":res?.amount ,
    //                 "currency":"INR",
    //                 "mode":"NEFT",
    //                 "purpose":"payout",
    //                 "fund_account":{
    //                     "account_type":"bank_account",
    //                     "bank_account":{
    //                         "name":bankDetails?.accountHolderName,
    //                         "ifsc":bankDetails?.IFSC,
    //                         "account_number": bankDetails?.accountNumber
    //                     },
    //                     "contact":{
    //                         "name":centerInfo?.user?.serviceCenterName,
    //                         "email":centerInfo?.user?.email,
    //                         "contact":centerInfo?.user?.contact,
    //                         "type":"employee",
    //                         "reference_id":"12345",
    //                         "notes":{
    //                             "notes_key_1":"Tea, Earl Grey, Hot",
    //                             "notes_key_2":"Tea, Earl Grey… decaf."
    //                         }
    //                     }
    //                 },
    //                 "queue_if_low_balance":true,
    //                 "reference_id":"Acme Transaction ID 12345",
    //                 "narration":"Acme Corp Fund Transfer",
    //                 "notes":{
    //                     "notes_key_1":"Beam me up Scotty",
    //                     "notes_key_2":"Engage"
    //                 }
    //             }
    
    //             let response = await http_request.post(`/serviceCenterDuePayment`, serviceCenterPayInfo )
    //             let { data } = response
    
    //             // if (data?.entity === "payout") {
    //             //     let response = await httpCommon.patch(`/updateTotalPay/${id}`, { totalPay:+totalPay,paidAmount: +payableAmmount ,commission:commisionPay })
    //             //     let { data } = response
                   
                  
    //             // }
    //             setIsModalOpen(false)
    //             RefreshData(data)
    //             ToastMessage(data);
    //         }
    //         catch (err) {
    //             console.log(err)
    //         }
           
    //        }else{
    //         alert("Please add bank details")
    //     }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };
    const onSubmit = async (res) => {
        try {
          if (bankDetails) {

            let centerData = localStorage.getItem("user");
            let centerInfo = JSON.parse(centerData);
      
            const serviceCenterPayInfo = {
              account_number: adminBankDtl?.account_number,
            //   fund_account_id:  bankDetails?.fund_account_id,
              amount: res?.amount,
              currency: "INR",
              mode: "NEFT",
              purpose: "refund",
              fund_account: {
                account_type: "bank_account",
                bank_account: {
                  name: bankDetails?.accountHolderName,
                  ifsc: bankDetails?.IFSC,
                  account_number: bankDetails?.accountNumber
            
                },
                contact: {
                  name: centerInfo?.user?.serviceCenterName,
                  email: centerInfo?.user?.email,
                  contact: centerInfo?.user?.contact,
                  type: "employee",
                  reference_id: "12345",
                  notes: {
                    notes_key_1: "Tea, Earl Grey, Hot",
                    notes_key_2: "Tea, Earl Grey… decaf."
                  }
                }
              },
              queue_if_low_balance: true,
              reference_id: "Acme Transaction ID 12345",
              narration: "Acme Corp Fund Transfer",
              notes: {
                notes_key_1: "Beam me up Scotty",
                notes_key_2: "Engage"
              }
            };
      
            try {
              const response = await http_request.post(
                `/serviceCenterDuePayment`,
                serviceCenterPayInfo
              );
              const { data } = response;
      
              // Handle response as needed
              setIsModalOpen(false);
              RefreshData(data);
              ToastMessage(data);
            } catch (err) {
              // Log detailed error information
              if (err.response) {
                console.error('Error response data:', err.response.data);
                console.error('Error response status:', err.response.status);
                console.error('Error response headers:', err.response.headers);
              } else if (err.request) {
                console.error('Error request data:', err.request);
              } else {
                console.error('Error message:', err.message);
              }
              console.error('Error config:', err.config);
            }
          } else {
            alert("Please add bank details");
          }
        } catch (err) {
          console.error(err);
        }
      };
      
  

    const handleWallet = async () => {
        try {
            const resData = { serviceCenterId: value?._id, serviceCenterName: value?.serviceCenterName,
                contact:+(value?.contact), email:value?.email,accountHolderName:bankDetails?.accountHolderName,
                bankDetailId:bankDetails?._id,ifsc:bankDetails?.IFSC,accountNumber:bankDetails?.accountNumber
             }

            let response = await http_request.post("/addWallet", resData)
            let { data } = response
            ToastMessage(data)
            RefreshData(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    return (

        <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">

                {loading ? (
                    <div className='d-flex justify-content-center align-items-center'>
                        <ReactLoader />
                    </div>
                ) :
                    <>
                  {value?.user?.role==="ADMIN" ?""
                   : <div>
                        {wallet ?
                            <div className="flex justify-between bg-blue-100 rounded-md p-5 items-center mb-5">
                                <div className='font-bold text-xl  '>Wallet </div>
                                <div>
                                    <div className='font-bold text-sm  mb-3'>  Wallet Balance </div>
                                    <div className='font-bold text-md mr-5 ml-5 flex justify-center bg-red-300 rounded-md p-2'>
                                        {wallet?.dueAmount} </div>
                                </div>
                                <div>
                                    <div className='font-bold text-sm mb-3 '>Total Commissions    </div>
                                    <div className='font-bold text-md mr-5 ml-5 flex justify-center bg-green-500 rounded-md p-2'>
                                        {wallet?.totalCommission} </div>
                                </div>
                                <Button className='flex  bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center ' variant="contained" color="primary" onClick={() => {setIsModalOpen(true),setValue("amount",wallet?.dueAmount)}}>
                                    Withdrawal
                                    {/* Amount */}
                                </Button>
                            </div>
                            : <div className='flex justify-end font-bold'>
                                <div onClick={() => handleWallet()} className='w-36 bg-green-400 cursor-pointer border flex items-center p-2 rounded-md'>
                                    <Wallet fontSize='large' color='secondary' />
                                    <div className='text-sm  ms-3'>{wallet?.dueAmount ? wallet?.dueAmount : "Activate Wallet"}  </div>
                                </div>
                            </div>
                        }
                    </div>
                  }
                  </>
                }
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
                                                  Sr. No.
                                                </TableSortLabel>
                                            </TableCell>
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
                                            {/* <TableCell>Actions</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                            <TableRow key={index} hover>
                                                <TableCell>{row.i}</TableCell>
                                                <TableCell>{row.userName}</TableCell>
                                                <TableCell>{row.paidAmount} INR</TableCell>
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
                                    readOnly
                                    className={`form-control w-full border p-3 ${errors.amount ? 'border-red-400' : 'border-blue-400'}`}
                                    {...register('amount', { required: 'Amount is required' })}
                                    placeholder="Amount"
                                />
                            </div>
                            <div className="text-red-400">{errors.amount?.message}</div>
                        </div>
                        
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
                                className={`border border-green-500 text-green-500 hover:bg-[#2e7d32] hover:text-white py-2 px-4 rounded ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                                disabled={loading}
                                // style={{ pointerEvents: loading ? 'none' : 'auto' }}
                                onClick={handleSubmit(onSubmit)}
                            >
                               Withdrawal Amount
                            </button>

                        </div>
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
