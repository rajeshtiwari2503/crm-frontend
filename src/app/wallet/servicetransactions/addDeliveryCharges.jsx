 import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Add } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';
import http_request from "../../../../http-request"
const ServicePaymentDialog = ({ rowData = {} ,RefreshData}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      serviceCenterId: '',
      serviceCenterName: '',
      payment: '',
      contactNo: '',
      complaintId: '',
      city: '',
      month: '',
      address: '',
      qrCode: '',
      status: 'UNPAID',
      description: '',
    },
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await http_request.post('/addDeliveryChargePayment', data);
      if (response.data.success) {
        alert('Payment added successfully');
        handleClose();
        RefreshData(response)
      } else {
        alert('Failed to add payment');
        RefreshData(response)
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred while submitting');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && rowData) {
      reset({
        serviceCenterId: rowData.serviceCenterId || '',
        serviceCenterName: rowData.serviceCenterName || '',
        payment: '',
        contactNo: rowData.contactNo || '',
        complaintId: rowData.complaintId || '',
        city: rowData.city || '',
        month: rowData.month || '',
        address: rowData.address || '',
        qrCode: rowData.qrCode || '',
        status: 'UNPAID',
        description: '',
      });
    }
  }, [open, rowData, reset]);


  return (
    <div>
      <button
        onClick={handleOpen}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-200 flex items-center gap-1"
      >
        <Add fontSize="small" />
        Delivery Charges
      </button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Service Payment</DialogTitle>
       {loading===true ?
        <div className="flex justify-center items-center  h-[80vh]">
                 <ReactLoader />
               </div>
       : <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent dividers className="space-y-4">
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextField  size="small" label="Service Center ID" {...register('serviceCenterId')} fullWidth  InputProps={{ readOnly: true }}/>
              <TextField  size="small" label="Service Center Name" {...register('serviceCenterName')} fullWidth  InputProps={{ readOnly: true }}/>
              <TextField  size="small" label="Contact" {...register('contactNo')} fullWidth  InputProps={{ readOnly: true }}/>
             
              <TextField  size="small" label="City" {...register('city')} fullWidth  InputProps={{ readOnly: true }}/>
              <TextField  size="small" label="Month" {...register('month')} fullWidth  InputProps={{ readOnly: true }}/>
              <TextField  size="small" label="Address" {...register('address')} fullWidth  InputProps={{ readOnly: true }}/>
              <TextField  size="small" label="QR Code URL" {...register('qrCode')} fullWidth  InputProps={{ readOnly: true }}/>
              
            </Box>
              <TextField  size="small" label="Payment (₹)" type="number" {...register('payment')} fullWidth />

            <TextField
              label="Description"
              {...register('description')}
              fullWidth
              multiline
              rows={2}
              className="mt-4"
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
}
      </Dialog>
    </div>
  );
};

export default ServicePaymentDialog;
