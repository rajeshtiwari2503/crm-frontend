import React from 'react';
import { Button, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function PaymentConfirmBox(props) {
  return (
    <Dialog open={props?.bool} onClose={() => props?.setConfirmBoxView(false)}>
      <DialogTitle>Confirm Payment</DialogTitle>
      <IconButton
        onClick={() => props?.setConfirmBoxView(false)}
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
        <div className="flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5610/5610944.png"
            alt="payment-confirm"
            className="w-[100px] h-[100px] object-cover rounded-full shadow-sm"
          />
        </div>

        <h4 className="text-center ml-10 mr-10 font-semibold text-lg text-green-600">
          Mark this payment as PAID?
        </h4>
        <p className="text-center text-gray-600">Are you sure you want to confirm this payment?</p>
      </DialogContent>

      <DialogActions sx={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
        <Button variant="outlined" color="inherit" onClick={() => props?.setConfirmBoxView(false)}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => props?.onSubmit()}
          className="hover:bg-green-700 hover:text-white"
        >
          Confirm Payment
        </Button>
      </DialogActions>
    </Dialog>
  );
}
