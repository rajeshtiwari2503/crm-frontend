import { InsertDriveFile } from '@mui/icons-material';
import React from 'react';
import { utils, writeFile } from 'xlsx';

const DownloadExcel = ({ data,userData, fileName, fieldsToInclude }) => {
  // Helper function to filter data
  // const sortData =  userData?.user?.role==="EMPLOYEE"?data?.filter((f1) => userData?.user?.stateZone?.includes(f1?.state)):data;
 

  const selectedBrandIds =  userData?.user?.brand?.map(b => b.value) || [];
  const hasStateZone =  userData?.user?.stateZone?.length > 0;
  const hasBrand = selectedBrandIds.length > 0;
  const sortData =  userData?.user?.role === "EMPLOYEE"
  ?  data?.filter(f1 => {
      const matchState = hasStateZone ?  userData?.user?.stateZone.includes(f1?.state) : true;
      const matchBrand = hasBrand ? selectedBrandIds.includes(f1?.brandId) : true;
      return matchState && matchBrand;
    })
  :  data;


  const filterFields = (sortData, fields) => {
    return sortData.map(item => {
      const filteredItem = {};
      fields.forEach(field => {
        filteredItem[field] = item[field];
      });
      return filteredItem;
    });
  };

  // const exportToExcel = (filteredData, fileName) => {
  //   // Convert the filtered data to a worksheet
  //   const worksheet = utils.json_to_sheet(filteredData);

  //   // Create a new workbook and append the worksheet
  //   const workbook = utils.book_new();
  //   utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  //   // Write the workbook to a binary string
  //   writeFile(workbook, `${fileName}.xlsx`);
  // };

  const exportToExcel = (filteredData, fileName) => {
    const worksheet = utils.json_to_sheet(filteredData);

    // Auto-adjust column width based on max content length
    const columnWidths = Object.keys(filteredData[0] || {}).map((key) => ({
      wch: Math.max(
        10,
        key.length + 5,
        ...filteredData.map((row) => (row[key] ? row[key].toString().length : 0))
      ),
    }));
    worksheet["!cols"] = columnWidths;

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");

    writeFile(workbook, `${fileName}.xlsx`);
  };
  const handleDownload = () => {
    const filteredData = filterFields(sortData, fieldsToInclude);
    exportToExcel(filteredData, fileName);
  };
  // const handleDownload = () => {
  //   console.log("Fields to include:", fieldsToInclude); // Debugging
  
  //   if (!Array.isArray(fieldsToInclude) || fieldsToInclude.length === 0) {
  //     console.warn("No valid fields specified, exporting full data.");
  //     fieldsToInclude = data[0]; // Use all column headers as default
  //   }
  
  //   const formattedData = data.slice(1).map(row => {
  //     let obj = {};
  //     data[0].forEach((header, index) => {
  //       obj[header] = row[index];
  //     });
  //     return obj;
  //   });
  
  //   const filteredData = filterFields(formattedData, fieldsToInclude);
  //   exportToExcel(filteredData, fileName);
  // };
  
  
  

  return (
    // <button
    //   onClick={handleDownload}
    //   className="rounded-lg p-3  w-full border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    // >
    // <InsertDriveFile />  Download Excel
    // </button>
    <button
    onClick={handleDownload}
    className="flex items-center justify-center gap-2 rounded-lg p-3 w-full border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <InsertDriveFile className="text-green-500" />  
    <span>Download Excel</span>
  </button>
  );
};

export default DownloadExcel;
