import React, { useState } from "react";
import {
  TableCell,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";

const WarrantyImageCell = ({ row }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableCell>
        {row?.warrantyImage ? (
          <div className="flex items-center gap-2">
            {/* Small thumbnail */}
            <img
              src={row.warrantyImage}
              alt="Warranty"
              className="w-12 h-12 object-cover rounded cursor-pointer border"
              onClick={() => setOpen(true)}
            />

            
          </div>
        ) : (
          <span className="text-gray-400 italic">No Image</span>
        )}
      </TableCell>

      {/* Popup dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        <DialogContent className="flex justify-center">
          <img
            src={row?.warrantyImage}
            alt="Warranty Full"
          className="max-h-[80vh] object-contain rounded"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WarrantyImageCell;
