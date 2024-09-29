"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../../http-request";
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Visibility } from '@mui/icons-material';
import { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { ToastMessage } from '@/app/components/common/Toastify';
const OrderDetails = ({ params }) => {

    const router = useRouter()

    const [orders, setOrders] = useState({})

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

    const [userData, setUserData] = React.useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [cateId, setCateId] = useState("");
    const [editData, setEditData] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [sortDirection, setSortDirection] = useState('asc');
    const [sortBy, setSortBy] = useState('id');
    const [refresh, setRefresh] = useState("")
    React.useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setUserData(JSON.parse(storedValue));
        }
        GetStock()

    }, [refresh]);

    const GetStock = async () => {
        try {
            let response = await http_request.get(`/getStockById/${params?.id}`)
            let { data } = response
            setOrders(data);
        }
        catch (err) {
            console.log(err)


        }
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (property) => {
        const isAsc = sortBy === property && sortDirection === 'asc';
        setSortDirection(isAsc ? 'desc' : 'asc');
        setSortBy(property);
    };
    const sortedStock = orders?.stock?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sorting by 'createdAt' in descending order
      });
      console.log(sortedStock);
      
    const data = sortedStock?.map((item, index) => ({ ...item, i: index + 1}));
    
    
    const sortedData = stableSort(data, getComparator(sortDirection, sortBy))?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    const handleEditModalClose = () => {
        setEditModalOpen(false);
    };

    const handleAdd = (row) => {
        setEditData(row)
        setEditModalOpen(true);
    }
    const AddStockData = async (data) => {
        try {
            setLoading(true);

            const reqData = {
                ...data,
            };

            const endpoint = `/editStock/${params?.id}`
            const response = await http_request.patch(endpoint, reqData);
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            setRefresh(responseData);
            setEditModalOpen(false);
        } catch (err) {
            setLoading(false);
            ToastMessage(err?._message);
            setEditModalOpen(false);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        AddStockData(data);
    };
    return (
        <Sidenav>

            {!orders ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
                :
                <>
                    <div>
                        <div className='flex justify-between items-center mb-3'>
                            <div className='font-bold text-2xl'>Stock Information</div>

                        </div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
                            <div className='font-bold'>SparePart Name</div>
                            <div>{orders?.sparepartName}</div>
                            {/* <div className='font-bold'>Model No. </div>
            <div>{orders?.partNumber}</div> */}
                            <div className='font-bold'>Fresh Stock  </div>
                            <div>{orders?.freshStock}</div>
                            <div className='font-bold'>Defective Stock  </div>
                            <div>{orders?.defectiveStock}</div>
                            <div className='font-bold'>createdAt  </div>
                            <div>{new Date(orders?.createdAt).toLocaleString()}</div>
                            <div className='font-bold'>updatedAt  </div>
                            <div>{new Date(orders?.updatedAt).toLocaleString()}</div>

                        </div>
                    </div>
                    <div>
                        <Toaster />
                        <div className='flex justify-between items-center mt-10 mb-3'>
                            <div className='font-bold text-2xl'>Stock Information</div>
                            {userData?.user?.role === "SERVICE" ? ""
                                : <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
                                    <Add style={{ color: "white" }} />
                                    <div className=' ml-2 '>Add Stock</div>
                                </div>
                            }
                        </div>
                        {!sortedData  ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
                            :
                            <>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortBy === '_id'}
                                                        direction={sortDirection}
                                                        onClick={() => handleSort('_id')}
                                                    >
                                                        ID
                                                    </TableSortLabel>
                                                </TableCell>
                                               
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortBy === 'freshStock'}
                                                        direction={sortDirection}
                                                        onClick={() => handleSort('freshStock')}
                                                    >
                                                        Fresh Stock
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortBy === 'defectiveStock'}
                                                        direction={sortDirection}
                                                        onClick={() => handleSort('defectiveStock')}
                                                    >
                                                     Title
                                                    </TableSortLabel>
                                                </TableCell>


                                             


                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortBy === 'createdAt'}
                                                        direction={sortDirection}
                                                        onClick={() => handleSort('createdAt')}
                                                    >
                                                        CreatedAt
                                                    </TableSortLabel>
                                                </TableCell>
                                              

                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {sortedData?.map((row) => (
                                                <TableRow key={row?.i} hover>
                                                    <TableCell>{row?.i}</TableCell>
                                                    
                                                    <TableCell>{row?.fresh }</TableCell>
                                                    <TableCell>{row?.title}</TableCell>
                                                    <TableCell>{new Date(row?.createdAt)?.toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={data?.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </>}
                        {/* Edit Modal */}
                        <Dialog open={editModalOpen} onClose={handleEditModalClose}>
                            <DialogTitle>{editData?._id ? "Edit Stock" : "Add Stock"}</DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={handleEditModalClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <DialogContent>
                            {loading === true ?      <div className='w-[400px]  '><ReactLoader /></div>
                               : <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                                    <div className='w-[400px]'>
                                        <label htmlFor="serialNo" className="block text-sm font-medium leading-6 text-gray-900">
                                            Stock Quantity
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="fresh"
                                                name="fresh"
                                                type="number"
                                                autoComplete="off"
                                                {...register('fresh', { required: '  Stock Quantity is required' })}
                                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.fresh ? 'border-red-500' : ''}`}
                                            />
                                            {errors.fresh && <p className="text-red-500 text-sm mt-1">{errors.fresh.message}</p>}
                                        </div>
                                    </div>
                                    <div className='w-[400px]'>
                                        <label htmlFor="serialNo" className="block text-sm font-medium leading-6 text-gray-900">
                                            Title
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                id="title"
                                                name="title"
                                                type="Text"
                                                autoComplete="off"
                                                {...register('title', { required: ' title is required' })}
                                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.title ? 'border-red-500' : ''}`}
                                            />
                                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                                        </div>
                                    </div>
                                  
                                        <div className='flex justify-between mt-8'>
                                            <Button variant="contained" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                                                Cancel
                                            </Button>

                                            <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                                Add Stock
                                            </Button>

                                        </div>
                                  
                                </form>}
                            </DialogContent>

                        </Dialog>


                        {/* <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} /> */}



                    </div>
                </>
            }
        </Sidenav>
    )
}

export default OrderDetails

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
