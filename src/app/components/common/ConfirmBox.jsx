import React from 'react';
import { Button, IconButton, Dialog, DialogContent, DialogActions, DialogTitle } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export function ConfirmBox(props) {


  return (
    <>
       <div  >
      <Dialog    open={props?.bool} onClose={() => props?.setConfirmBoxView(false)}>
        <DialogTitle>Delete Data</DialogTitle>
        <IconButton
           title=""
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

            <img src="https://img.freepik.com/free-vector/red-exclamation-mark-symbol-attention-caution-sign-icon-alert-danger-problem_40876-3505.jpg?size=626&ext=jpg&ga=GA1.1.1565121225.1680255264&semt=ais" alt="brandLogo" className="w-[200px] h-[200px] object-cover rounded-full   shadow-sm" />


          </div>
          <h4 className='text-center ml-10 mr-10'>

            Your data will be deleted permanently!
          </h4>
          <p className='text-center' >Are you sure to proceed?</p>
        </DialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "space-between",margin:"20px" }}>
          <Button variant="outlined" className='hover:bg-[#2e7d32] hover:text-white'color="success" onClick={() => props?.setConfirmBoxView(false)}>Cancel</Button>
          <Button variant="outlined"className='hover:bg-[#fe3f49] hover:text-white' color="error" onClick={() => props?.onSubmit()}>Delete</Button>
        </DialogActions>
      </Dialog>
      </div>
    </>
  );
}

