"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useUser } from '../components/UserContext';


const StatusComponent = ({ row }) => {
    let statusToDisplay = row?.status;
    let preferredServiceDate = new Date(row?.preferredServiceDate);
    let currentDate = new Date();

    // Normalize the dates to only compare Y/M/D (ignoring time)
    let preferredDateOnly = new Date(preferredServiceDate.setHours(0, 0, 0, 0));
    let currentDateOnly = new Date(currentDate.setHours(0, 0, 0, 0));

    if (row?.updateHistory?.length > 0) {
        const lastIndex = row?.updateHistory.length - 1;
        statusToDisplay = row?.updateHistory[lastIndex]?.changes?.status || row?.status;
        console.log("statusToDisplay", statusToDisplay);

    }

    // Determine color based on priority
    let bgColor = 'bg-green-400'; // Default (future dates)
    if (statusToDisplay.toLowerCase() === 'pending') {
        if (preferredDateOnly < currentDateOnly) {
            bgColor = 'bg-red-500'; // Past date (overdue)
        } else if (preferredDateOnly.getTime() === currentDateOnly.getTime()) {
            bgColor = 'bg-orange-400'; // Due today
        }
    }

    return <div className={`${bgColor} text-white p-2 rounded-md`}>{statusToDisplay}</div>;
};



const HighPriorityComplaintList = (props) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortBy, setSortBy] = useState('id');

    const router = useRouter()

    const [complaint, setComplaint] = useState([])
    const { user } = useUser()
    useEffect(() => {

        getAllComplaint()

    }, [user]);
    const getAllComplaint = async () => {
        try {
            let response = await http_request.get("/getComplaintsByPending")
            let { data } = response;

            setComplaint(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const filtData = user?.user?.role === "BRAND EMPLOYEE" ? complaint?.filter((f) => f?.brandId === user?.user?.brandId) : complaint
    const sortData = user?.user?.role==="EMPLOYEE"?filtData?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):filtData;

     
    const data = sortData
        ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Oldest first
        .map((item, index) => ({ ...item, i: index + 1 }));

    // const data =   data1 

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




    const handleDetails = (id) => {
        router.push(`/complaint/details/${id}`)
    }




    return (
        <div>
            <Toaster />
            <div className='flex justify-between items-center mb-3'>
                <div className='font-bold text-2xl'> High Priority Complaints</div>

            </div>

            {!data?.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
                :
                <div className='md:w-full w-[260px]'>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#09090b" }}>
                                <TableRow >
                                    {[
                                        { label: "ID", key: "_id" },
                                        { label: "Complaint_Id", key: "_id" },
                                        { label: "Customer", key: "fullName" },
                                        { label: "City", key: "district" },
                                        { label: "Contact", key: "customerMobile" },
                                        { label: "Product_Brand", key: "productBrand" },
                                        { label: "Status", key: "status" },
                                        { label: "Created_At", key: "createdAt" },
                                    ].map(({ label, key }) => (
                                        <TableCell key={key} sx={{ color: "white" }}>
                                            <TableSortLabel
                                                active={sortBy === key}
                                                direction={sortDirection}
                                                onClick={() => handleSort(key)}
                                                sx={{
                                                    color: "white !important", // White text
                                                    "& .MuiTableSortLabel-icon": {
                                                        color: "white !important", // White sort arrow
                                                    },
                                                }}
                                            >
                                                {label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{ color: "white" }}>Actions</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedData.map((row) => (
                                    <TableRow key={row?.i} hover>
                                        <TableCell>{row?.i}</TableCell>
                                        <TableCell>{row?.complaintId}</TableCell>
                                        <TableCell>{row?.fullName}</TableCell>

                                        <TableCell>{row?.district}</TableCell>

                                        <TableCell>{row?.phoneNumber}</TableCell>

                                        <TableCell>
                                            {String(row?.productBrand || "").length > 15
                                                ? String(row?.productBrand).substring(0, 15) + "..."
                                                : row?.productBrand}
                                        </TableCell>


                                        {/* <TableCell>{row?.status}</TableCell> */}
                                        <TableCell>
                                            <StatusComponent row={row} />
                                        </TableCell>

                                        <TableCell>{new Date(row?.createdAt).toLocaleString()}</TableCell>
                                        <TableCell className="p-0">
                                            <div className="flex items-center space-x-2">

                                                <IconButton aria-label="view" onClick={() => handleDetails(row?._id)}>
                                                    <Visibility color="primary" />
                                                </IconButton>

                                            </div>
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
                </div>}

        </div>
    );
};

export default HighPriorityComplaintList;

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
