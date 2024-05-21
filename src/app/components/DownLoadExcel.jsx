import React from 'react';
import { utils, writeFile } from 'xlsx';

const DownloadExcel  = (props) => {
  const {data,fileName}=props
   const exportToExcel = (data, fileName) => {
    // Convert the data to a worksheet
    const worksheet = utils.json_to_sheet(data);
    
    // Create a new workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    
    // Write the workbook to a binary string
    writeFile(workbook, `${fileName}.xlsx`);
  };
  const handleDownload = () => {
    exportToExcel(data, fileName);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      Download Excel
    </button>
  );
};

export default DownloadExcel;
