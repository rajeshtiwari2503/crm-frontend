import React, { useState } from 'react';
import { utils, writeFile } from 'xlsx';
 

const DownloadFiterDataExcel = ({ reportData, fileName }) => {
    // console.log("reportData",reportData);
  const [loading, setLoading] = useState(false);

  const fetchDataAndExportToExcel = async () => {
    try {
     
      const data = reportData?.data;

      // Extract data for each user type
      const customers = data.customers || [];
      const serviceCenters = data.serviceCenters || [];
      const technicians = data.technicians || [];
      const brands = data.brands || [];

      // Convert the data to worksheets
      const customerSheet = utils.json_to_sheet(customers);
      const serviceCenterSheet = utils.json_to_sheet(serviceCenters);
      const technicianSheet = utils.json_to_sheet(technicians);
      const brandSheet = utils.json_to_sheet(brands);

      // Create a new workbook and append the worksheets
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, customerSheet, 'Customers');
      utils.book_append_sheet(workbook, serviceCenterSheet, 'Service Centers');
      utils.book_append_sheet(workbook, technicianSheet, 'Technicians');
      utils.book_append_sheet(workbook, brandSheet, 'Brands');

      // Write the workbook to a binary string
      writeFile(workbook, `${fileName}.xlsx`);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    fetchDataAndExportToExcel();
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4  bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      disabled={loading}
    >
      {loading ? 'Downloading...' : 'Download Excel'}
    </button>
  );
};

export default DownloadFiterDataExcel;
