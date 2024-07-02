"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, TextField, TablePagination, TableSortLabel, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { Add, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ConfirmBox } from '@/app/components/common/ConfirmBox';
import http_request from '.././../../http-request'
import { Toaster } from 'react-hot-toast';
import { ToastMessage } from '@/app/components/common/Toastify';
import { ReactLoader } from '@/app/components/common/Loading';
import AddFeedback from './addFeedback';
import { useForm } from 'react-hook-form';


const FeedbackList = (props) => {


  const router = useRouter()

  const data = props?.data;
  const [value, setValue] = React.useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmBoxView, setConfirmBoxView] = useState(false);
  const [cateId, setCateId] = useState("");
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortBy, setSortBy] = useState('id');
  const [complaints, setComplaints] = useState([])

  useEffect(() => {
    getAllComplaint()

  }, [ ])

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint")
      let { data } = response;

      setComplaints(data)
    }
    catch (err) {
      console.log(err);
    }
  }
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



  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };


  const handleAdd = (row) => {
    setEditData(row)
    setEditModalOpen(true);
  }
  const deleteData = async () => {
    try {
      let response = await http_request.deleteData(`/deleteFeedback/${cateId}`);
      let { data } = response;
      setConfirmBoxView(false);
      props?.RefreshData(data)
      ToastMessage(data);
    } catch (err) {
      console.log(err);
    }
  }
  const handleDelete = (id) => {
    setCateId(id)
    setConfirmBoxView(true);
  }
  useEffect(() => {

    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, [])

  const handleReplyMessage = (id) => {
    setCateId(id)
    setReplyMessage(true)
  }
  const handleReplyMessageClose = () => {

    setReplyMessage(false)
  }
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const response = await http_request.patch(`/editFeedback/${cateId}`, data);
      let { data: reponseData } = response
      ToastMessage(reponseData)
      setLoading(false)
      setReplyMessage(false)
      props?.RefreshData(reponseData)
    } catch (error) {
      setLoading(false)

      console.error('Error submitting reply:', error);
    }
  };

  const handleMarkReviewed=async(id)=>{
    try {
      let response = await http_request.patch(`/editFeedback/${id}`,{status:"REVIEWED"});
      let { data } = response;
      setConfirmBoxView(false);
      props?.RefreshData(data)
      ToastMessage(data);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <Toaster />
      <div className='flex justify-between items-center mb-3'>
        <div className='font-bold text-2xl'>  Feedback Information</div>
        {/* {value?.user?.role === "USER" ?
          <div onClick={handleAdd} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
            <Add style={{ color: "white" }} />
            <div className=' ml-2 '>Add Feedback</div>
          </div>
          : ""
        } */}
      </div>
      {!data.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
        :
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'id'}
                      direction={sortDirection}
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'stateName'}
                      direction={sortDirection}
                      onClick={() => handleSort('stateName')}
                    >
                      Ticket No.
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'zone'}
                      direction={sortDirection}
                      onClick={() => handleSort('zone')}
                    >
                      User Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'emailAddress'}
                      direction={sortDirection}
                      onClick={() => handleSort('emailAddress')}
                    >
                      Email Address
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'status'}
                      direction={sortDirection}
                      onClick={() => handleSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'overallsatisfaction'}
                      direction={sortDirection}
                      onClick={() => handleSort('overallsatisfaction')}
                    >
                      Over All Satisfaction
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'servicequality'}
                      direction={sortDirection}
                      onClick={() => handleSort('servicequality')}
                    >
                      Service quality
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'timeliness'}
                      direction={sortDirection}
                      onClick={() => handleSort('timeliness')}
                    >
                      Timeliness
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'professionalism'}
                      direction={sortDirection}
                      onClick={() => handleSort('professionalism')}
                    >
                      Professionalism
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'comments'}
                      direction={sortDirection}
                      onClick={() => handleSort('comments')}
                    >
                      Comments
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'comments'}
                      direction={sortDirection}
                      onClick={() => handleSort('comments')}
                    >
                      Brand Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'comments'}
                      direction={sortDirection}
                      onClick={() => handleSort('comments')}
                    >
                      Brand_Reply_Message
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'issuesFaced'}
                      direction={sortDirection}
                      onClick={() => handleSort('issuesFaced')}
                    >
                      Issues Faced
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'recommendationLikelihood'}
                      direction={sortDirection}
                      onClick={() => handleSort('recommendationLikelihood')}
                    >
                      Recommendation Likelihood
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortBy === 'futureServiceInterest'}
                      direction={sortDirection}
                      onClick={() => handleSort('futureServiceInterest')}
                    >
                      Future Service Interest
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
                  <TableCell>Actions</TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData?.map((row) => (
                  <TableRow key={row?.i} hover>
                    <TableCell>{row?.i}</TableCell>
                    <TableCell>{row?.ticketNumber}</TableCell>
                    <TableCell>{row?.customerName}</TableCell>
                    <TableCell>{row?.emailAddress}</TableCell>
                    <TableCell>{row?.status}</TableCell>
                    <TableCell>{row?.overallsatisfaction}</TableCell>
                    <TableCell>{row?.servicequality}</TableCell>
                    <TableCell>{row?.timeliness}</TableCell>
                    <TableCell>{row?.professionalism}</TableCell>
                    <TableCell>{row?.comments}</TableCell>
                    <TableCell>{row?.brandName}</TableCell>
                    <TableCell>{row?.replyMessage}</TableCell>
                    <TableCell>{row?.issuesFaced}</TableCell>
                    <TableCell>{row?.recommendationLikelihood}</TableCell>
                    <TableCell>{row?.futureServiceInterest}</TableCell>
                    <TableCell>{new Date(row?.createdAt)?.toLocaleString()}</TableCell>
                    <TableCell className='flex'>
                      {/* <IconButton aria-label="view"  >
                        <Visibility color='primary' />
                      </IconButton> */}
                      {value?.user?.role === "USER" ?
                        <>
                          {/* <IconButton aria-label="edit" onClick={() => handleAdd(row)}>
                            <EditIcon color='success' />
                          </IconButton> */}
                          {/* <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                            <DeleteIcon color='error' />
                          </IconButton> */}
                        </>
                        :value?.user?.role === "ADMIN" ?  
                        <>
                          <IconButton aria-label="edit" onClick={() => handleAdd(row)}>
                            <EditIcon color='success' />
                          </IconButton>
                          <IconButton aria-label="delete" onClick={() => handleDelete(row._id)}>
                            <DeleteIcon color='error' />
                          </IconButton>
                        </>
                        : value?.user?.role === "BRAND" ?
                        <div className='flex justify-between'>
                        <Button onClick={() => handleReplyMessage(row._id)} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>Reply</Button>
                        <Button onClick={() => handleMarkReviewed(row._id)} className='ms-2 me-2 flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>Mark as Reviewed</Button>
                        <Button onClick={() => handleReplyMessage(row._id)} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>Contact Customer</Button>
                        </div>
                          : ""}

                    </TableCell>
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
        <DialogTitle>{editData?._id ? "Edit Feedback" : "Add Feedback"}</DialogTitle>
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
          <AddFeedback existingFeedback={editData} complaints={complaints} RefreshData={props?.RefreshData} onClose={handleEditModalClose} />
        </DialogContent>

      </Dialog>
      <Dialog open={replyMessage} onClose={handleReplyMessageClose}>
        <DialogTitle>Reply Message</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleReplyMessageClose}
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('replyMessage')}
              label="Your Reply"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              required
            />

            <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="outlined" className='mt-5 hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
              Submit Reply
            </Button>
          </form>
        </DialogContent>

      </Dialog>

      <ConfirmBox bool={confirmBoxView} setConfirmBoxView={setConfirmBoxView} onSubmit={deleteData} />

    </div>
  );
};

export default FeedbackList;

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
