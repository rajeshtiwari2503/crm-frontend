"use client"
import React, { useEffect, useState } from 'react';
import ReportTypeSelector from '../components/reports/ReportTypes';
import DateRangePicker from '../components/reports/DatePickers';
import FilterOptions from '../components/reports/FilterOption';
import VisualizationOptions from '../components/reports/VisualizationArea';
import ReportDisplayArea from '../components/reports/ReportDisplarOption';
import Sidenav from '../components/Sidenav';
import http_request from '.././../../http-request';

const Report = () => {
  const [reportType, setReportType] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filters, setFilters] = useState({
    userType: {
      customer: false,
      serviceCenter: false,
      technician: false,
      brand: false,
    },
    status: {
      open: false,
      inProgress: false,
      completed: false,
      closed: false,
    },
    product: [],
    country: '',
    state: '',
    city: '',
    serviceCenter: [],
    technician: [],
    brand: [],
  });
  const [includeCharts, setIncludeCharts] = useState(false);
  const [reportData, setReportData] = useState({ summary: '', details: {}, labels: [], data: [] });

  const handleGenerateReport = async () => {
    try {
      const response = await http_request.post('/filterData', {
        reportType,
        startDate,
        endDate,
        filters,
        includeCharts,
      });

      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };
  const [userData, setUserData] = useState([])



  useEffect(() => {
    getAllUserAndProducts()
  }, [])


  const getAllUserAndProducts = async () => {
    let response = await http_request.get("/getUserAndProduct")
    let { data } = response;

    setUserData(data)
  }
   
  return (
    <Sidenav>
      <div className="container mx-auto p-4">
        <div className="mb-4 grid grid-cols-1 gap-4">
          <h2 className="text-xl font-semibold mb-2">Reports and Analytics</h2>
          <ReportTypeSelector reportType={reportType} setReportType={setReportType} />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <FilterOptions userData={userData} filters={filters} setFilters={setFilters} />
          <VisualizationOptions includeCharts={includeCharts} setIncludeCharts={setIncludeCharts} />
          <button
            className="bg-blue-500 w-52 rounded-md text-white px-4 py-2 mt-4"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
        <ReportDisplayArea reportData={reportData} />
      </div>
    </Sidenav>
  );
};

export default Report;
