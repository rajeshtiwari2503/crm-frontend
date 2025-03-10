"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, IconButton } from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import http_request from '.././../../http-request'
import { ReactLoader } from '@/app/components/common/Loading';
import { useUser } from '../components/UserContext';



const UnAssignComplaintList = (props) => {

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
            let response = await http_request.get("/getAllUnAssignComplaint")
            let { data } = response;

            setComplaint(data?.data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const filtData = user?.user?.role === "BRAND EMPLOYEE" ? complaint?.filter((f) => f?.brandId === user?.user?.brandId) : complaint

    const data = filtData?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Oldest first
        ?.map((item, index) => ({ ...item, i: index + 1 }));



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
                <div className='font-bold text-2xl'> Unassigned Complaints</div>

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
                                        <TableCell>{row?._id}</TableCell>
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
                                            {row?.status}
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

export default UnAssignComplaintList;

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
