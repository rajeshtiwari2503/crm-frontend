"use client"
import React, { useEffect, useState } from 'react';
import ReportTypeSelector from '../components/reports/ReportTypes';
import DateRangePicker from '../components/reports/DatePickers';
import FilterOptions from '../components/reports/FilterOption';
import VisualizationOptions from '../components/reports/VisualizationArea';
import ReportDisplayArea from '../components/reports/ReportDisplarOption';
import Sidenav from '../components/Sidenav';
import http_request from '.././../../http-request';
import DownloadFiterDataExcel from '../components/reports/DownloadFilterDataExcel';
import DownloadExcel from '../components/DownLoadExcel';

const Report = () => {
  const [reportType, setReportType] = useState("USER");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
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
      setLoading(true)
      const response = await http_request.post('/filterData', {
        reportType,
        startDate,
        endDate,
        filters,
        includeCharts,
      });

      setReportData(response.data);
      setLoading(false)

    } catch (error) {
      setLoading(false)

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
      <div className="container mx-auto p-2">
      <h2 className="text-xl font-semibold mb-2">Reports and Analytics</h2>
        <div className="mb-4 grid grid-cols-1 gap-2">
        
          <ReportTypeSelector reportType={reportType} setReportType={setReportType} />
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
          <FilterOptions userData={userData} filters={filters} setFilters={setFilters} />
          {/* <VisualizationOptions includeCharts={includeCharts} setIncludeCharts={setIncludeCharts} /> */}
         
         <div className='flex'>
          <button
           className="px-4 py-2 me-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={handleGenerateReport}
            disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {reportType==="USER"?
          <DownloadFiterDataExcel reportData= {reportData} fileName="UserReport" />
          : <DownloadExcel data={reportData?.complaints} fileName="ComplaintsList"/>
          }

        </div>
        </div> 
        {/* <ReportDisplayArea reportData={reportData} /> */}
      </div>
    </Sidenav>
  );
};

export default Report;
