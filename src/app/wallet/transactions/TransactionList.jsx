
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
 
const data1=data?.lenth>0 ? data:[];
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

    const sortedData = stableSort(data1, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);




    const onSubmit = async (data) => {
        try {
            // console.log(bankDetails);
           if (bankDetails){
           
            alert("Your  bank details  are added")
           
           }else{
            alert("Please add bank details")
        }
        } catch (err) {
            console.error(err);
        }
    };
    const userPayment = async () => {
        try {
          const userId = localStorage.getItem("userId");
          if(saveAddress){
          let { address, address2, state, city } = checkoutData;
          
          await httpCommon.patch(`/updateUserDetail/${userId}`,{address:address, address2:address2, state:state, city:city,pin:pin})
          }
          let techAmount = spData?.reduce((acc, curr) => acc + (+curr.technician), 0)
          let amount = data1?.reduce((acc, curr) => acc + (+curr.totPrice), 0);
          let response = await httpCommon.post("/payment", { amount: amount + techAmount });
          let { data } = response;
          const options = {
            key: "rzp_live_yEWZ902y0STtSb", // Enter the Key ID generated from the Dashboard
            amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "SpareTrade", //your business name
            description: "Payment for order",
            image: "https://lybley-webapp-collection.s3.amazonaws.com/PNG-031.png-1684751868223-284237810",
            order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: async function (orderDetails) {
              try {
                const userId = localStorage.getItem("userId");
                let response = await axios.post("https://sparetradebackend-production.up.railway.app/paymentVerification", { response: orderDetails, customerData: { ...checkoutData, customerId: userId, items: spData, pin: pin } });
                let { data } = response;
                if (data?.status === true) {
                  router.push("/confirmation");
                }
              } catch (err) {
                console.log(err);
              }
            },
            prefill: {
              name: checkoutData.name, //your customer's name
              email: checkoutData.email,
              contact: checkoutData.contact
            },
            notes: {
              "address": "Razorpay Corporate Office"
            },
            theme: {
              color: "#3399cc"
            }
          };
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        } catch (err) {
          console.log(err);
        }
      }
    const handleDuePayment = async (id) => {
        try {
            let userData = localStorage.getItem("user")
            let centerInfo = JSON.parse(userData)
            setDisable(true)
            const payableAmmount=totalPay - (+brandBankDtl?.commission/100 )*totalPay
            const commisionPay=(+brandBankDtl?.commission/100 )*totalPay;
            
            const serviceCenterPayInfo=
            {
                "account_number":adminBankDtl?.accountNumber,
                "amount":(+payableAmmount) * 100,
                "currency":"INR",
                "mode":"NEFT",
                "purpose":"payout",
                "fund_account":{
                    "account_type":"bank_account",
                    "bank_account":{
                        "name":brandBankDtl?.accountHolderName,
                        "ifsc":brandBankDtl?.IFSC,
                        "account_number": brandBankDtl?.accountNumber
                    },
                    "contact":{
                        "name":brand?.brandName,
                        "email":brand?.email,
                        "contact":brand?.contact,
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

            let response = await httpCommon.post(`/serviceCenterDuePayment`, serviceCenterPayInfo)
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

    const handleWallet = async () => {
        try {
            const resData = { serviceCenterId: userData?._id, serviceCenterName: userData?.serviceCenterName }

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
                    <div>
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
