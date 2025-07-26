"use client"
 
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request";
import { useRouter } from 'next/navigation';

import { ReactLoader } from '@/app/components/common/Loading';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';

import { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { ToastMessage } from '@/app/components/common/Toastify';
import { useUser } from '@/app/components/UserContext';

const StockRequestList = ({ reqStock ,refre}) => {
    // console.log("reqStock", reqStock);

    const [stockReq, setStockReq] = useState([])



    const [loading, setLoading] = useState(false);


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortBy, setSortBy] = useState('id');
    const [refresh, setRefresh] = useState(refre)
    const { user } = useUser()



    React.useEffect(() => {

        GetStockRequest()

    }, [refresh,refre, reqStock]);




    // const GetStockRequest = async () => {
    //     try {
    //         console.log("reqStock?._id,reqStock?._id", reqStock?._id);

    //         const req = `/getStockRequestByStockId/${reqStock}`
    //         let response = await http_request.get(req)
    //         let { data } = response
    //         setStockReq(data);
    //     }
    //     catch (err) {
    //         console.log(err)


    //     }
    // }

    const GetStockRequest = async () => {
    try {
        const userRole = user?.user?.role;
        let response;

        if (userRole === "ADMIN") {
            // Admin gets all stock requests
            response = await http_request.get("/getAllStockRequests");
        } else if (reqStock) {
            // Others get requests by specific stockId
            const req = `/getStockRequestByStockId/${reqStock}`;
            response = await http_request.get(req);
        } else if (userRole === "SERVICE" && !reqStock){
            const req = `/getAllCenterStockRequests/${user?.user?._id}`;
            response = await http_request.get(req); 
        }
        
        else {
            console.warn("No stock ID provided and user is not admin.");
            return;
        }

        const { data } = response;
        setStockReq(data?.data || data); // depending on backend response structure
    } catch (err) {
        console.error("Error fetching stock request:", err);
    }
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




    const handleApprove = async (request) => {
        try {
            setLoading(true);

            console.log("request,",request);
            

            const response = await http_request.patch(`/editServiceCenterStock/${request?._id}`, request);
            const { data } = response;

            ToastMessage({ status: true, msg: "Stock approved and updated successfully" });
 
            // await http_request.patch(`/updateRequestStatus/${request._id}`, { status: "approved" });

            setRefresh(Date.now());
            setLoading(false);
        } catch (err) {
            setLoading(false);
            ToastMessage({ status: false, msg: "Failed to approve request" });
            console.error(err);
        }
    };


    return (
        < >

            {loading ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
                :
                <>
                    <div>
                        <div className='flex justify-between items-center mt-5 mb-10'>
                            <div className='font-bold text-2xl'>Stock Request Information</div>

                        </div>

                    </div>
                    <div>
                        <Toaster />
                        {(user?.user?.role === "ADMIN" || user?.user?.role === "SERVICE") && (
                            <>
                               
                                {!stockReq?.length ? (
                                    <div className="text-gray-500">No stock requests pending.</div>
                                ) : (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Service Center</TableCell>
                                                    <TableCell>Spare Part</TableCell>
                                                    <TableCell>Fresh</TableCell>
                                                    <TableCell>Defective</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Title</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {stockReq.map((row, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell>{idx + 1}</TableCell>
                                                        <TableCell>{row.serviceCenterName}</TableCell>
                                                        <TableCell>{row.sparepartName}</TableCell>
                                                        <TableCell>{row.fresh || 0}</TableCell>
                                                        <TableCell>{row.defective || 0}</TableCell>
                                                        <TableCell>{row.price || "-"}</TableCell>
                                                        <TableCell>{row.title}</TableCell>
                                                        <TableCell>
                                                            {/* Show Approve button only if role is ADMIN and status is pending */}
                                                            {user?.user?.role === "ADMIN" && row.status === "pending" ? (
                                                                <button
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                                                    onClick={() => handleApprove(row)}
                                                                >
                                                                    Approve
                                                                </button>
                                                            ) : (
                                                                // For service centers or if already approved, show status
                                                                <span
                                                                    className={`px-3 py-1 rounded text-white text-xs font-semibold ${row.status === "approved" ? "bg-green-500" : "bg-yellow-500"
                                                                        }`}
                                                                >
                                                                    {row.status}
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>

                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </>
                        )}




                    </div>
                </>
            }
        </>
    )
}

export default StockRequestList

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
