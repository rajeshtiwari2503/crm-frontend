import React from 'react';
import { utils, writeFile } from 'xlsx';

const DownloadBulkSampleExcel = ({ data, fileName, fieldsToInclude }) => {
  // Helper function to filter data
  const filterFields = (data, fields) => {
    return data.map(item => {
      const filteredItem = {};
      fields.forEach(field => {
        filteredItem[field] = item[field];
      });
      return filteredItem;
    });
  };

  const exportToExcel = (filteredData, fileName) => {
    // Convert the filtered data to a worksheet
    const worksheet = utils.json_to_sheet(filteredData);

    // Create a new workbook and append the worksheet
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a binary string
    writeFile(workbook, `${fileName}.xlsx`);
  };

  // const handleDownload = () => {
  //   const filteredData = filterFields(data, fieldsToInclude);
  //   exportToExcel(filteredData, fileName);
  // };
  const handleDownload = () => {
    console.log("Fields to include:", fieldsToInclude); // Debugging
  
    if (!Array.isArray(fieldsToInclude) || fieldsToInclude.length === 0) {
      console.warn("No valid fields specified, exporting full data.");
      fieldsToInclude = data[0]; // Use all column headers as default
    }
  
    const formattedData = data.slice(1).map(row => {
      let obj = {};
      data[0].forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
  
    const filteredData = filterFields(formattedData, fieldsToInclude);
    exportToExcel(filteredData, fileName);
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

export default DownloadBulkSampleExcel;
