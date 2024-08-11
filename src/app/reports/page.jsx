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
import ComplaintList from '../components/reports/ComplaintList';
import CustomerList from '../user/customer/customerList';
import BrandList from '../user/brand/brandList';
import TechnicianList from '../user/technician/technicianList';
import ServiceList from '../user/service/serviceList';
import dynamic from 'next/dynamic';
import DealerReport from './DealerReport';


const AreaChart = dynamic(() => import("../analytics/charts/areaChart"), {
  loading: () => <p>Chart loading.........</p>
});
const PieChart = dynamic(() => import("../analytics/charts/pieChart"), {
  loading: () => <p>Chart loading.........</p>
});
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
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [value, setValue] = React.useState(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
    getAllUserAndProducts()
    fetchComplaints()
    // applyFilters();
  }, [ ])
// }, [filters,  startDate, endDate])

console.log(filteredComplaints,"gggggf");
  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await http_request.get('/getAllComplaint');
      setComplaints(response.data);
      setFilteredComplaints(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching complaints:', error);
    }
  };
  
  const applyFilters = () => {
    let filtered = complaints;

    if (filters.status) {
      const activeStatuses = Object.keys(filters.status).filter(status => filters.status[status]);
      if (activeStatuses.length > 0) {
        filtered = filtered.filter(complaint => activeStatuses.includes(complaint.status));
      }
    }

    if (filters.product.length > 0) {
      filtered = filtered.filter(complaint => filters.product.includes(complaint.productName));
    }

    if (filters.country) {
      filtered = filtered.filter(complaint => complaint.country === filters.country);
    }

    if (filters.state) {
      filtered = filtered.filter(complaint => complaint.state === filters.state);
    }

    if (filters.city) {
      filtered = filtered.filter(complaint => complaint.city === filters.city);
    }

    if (filters.serviceCenter.length > 0) {
      filtered = filtered.filter(complaint => filters.serviceCenter.includes(complaint.serviceCenter));
    }

    if (filters.technician.length > 0) {
      filtered = filtered.filter(complaint => filters.technician.includes(complaint.technician));
    }

    if (filters.brand.length > 0) {
      console.log(filters);
      filtered = filtered.filter(complaint => complaint.brandName=== filters.brand);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(complaint => {
        const complaintDate = new Date(complaint.createdAt);
        return complaintDate >= startDate && complaintDate <= endDate;
      });
    }
    console.log(filtered,"dghghgd");
    setFilteredComplaints(filtered);
  };
  const getAllUserAndProducts = async () => {
    let response = await http_request.get("/getUserAndProduct")
    let { data } = response;

    setUserData(data)
  }
  // console.log(reportData);
  return (
    <Sidenav>
     {value?.user?.role==="DEALER"?
     <DealerReport  userData={value?.user}/>
     : <div className="container mx-auto p-2">
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
          <VisualizationOptions includeCharts={includeCharts} setIncludeCharts={setIncludeCharts} />

          <div className='flex mt-2'>
            <button
              className="px-4 py-2 me-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>

            {reportType === "USER" ?
              <>{reportData?.data?.brands?.length > 0 || reportData?.data?.customers?.length > 0 || reportData?.data?.serviceCenters?.length > 0 || reportData?.data?.technicians?.length > 0 ?
                <DownloadFiterDataExcel reportData={reportData} fileName="UserReport" /> : ""}
              </>
              : <>
                {reportData?.complaints?.length > 0 ? <DownloadExcel data={reportData?.complaints} fileName="ComplaintsList" /> : ""}
              </>
            }

          </div>
          {includeCharts &&
            <div className='grid grid-cols-12 gap-4 my-8'>
              <div className='col-span-5 rounded-lg shadow px-4 py-4 bg-white'>
                <AreaChart />
              </div>
              <div className='col-span-7 rounded-lg shadow px-4 py-4 bg-white'>
                <PieChart />
              </div>

            </div>
          }
        </div>
        {reportType === "COMPLAINT" && reportData?.complaints?.length > 0 ?
          <ComplaintList data={reportData?.complaints} />
          : ""}
        {reportType === "USER" && reportData?.data?.customers?.length > 0 ?
          <CustomerList data={reportData?.data?.customers} report={true} />
          : ""}
        {reportType === "USER" && reportData?.data?.serviceCenters?.length > 0 ?
          <ServiceList data={reportData?.data?.serviceCenters} report={true} />
          : ""}
        {reportType === "USER" && reportData?.data?.technicians?.length > 0 ?
          <TechnicianList data={reportData?.data?.technicians} report={true} />
          : ""}
        {reportType === "USER" && reportData?.data?.brands?.length > 0 ?
          <BrandList data={reportData?.data?.brands} report={true} />
          : ""}
        {/* <ReportDisplayArea reportData={reportData} /> */}
      </div>
}
    </Sidenav>
  );
};

export default Report;

//  "use client"
// import React, { useState } from 'react';
// import axios from 'axios';

// const Report = () => {
//   const [city, setCity] = useState('');
//   const [pinCodes, setPinCodes] = useState([]);
//   const [error, setError] = useState('');

//   const fetchPinCodes = async () => {
//     if (!city) {
//       setError('Please enter a city.');
//       return;
//     }

//     setError('');
//     try {
//       // Replace with your actual API URL
//       const response = await axios.get(`https://api.postalpincode.in/postoffice/${encodeURIComponent(city)}`);
      
//       if (response.data && response.data[0].Status === 'Success') {
//         const pincodes = response.data[0].PostOffice;
//         console.log(pincodes);
//         setPinCodes(pincodes);
//       } else {
//         setError('No pin codes found for this city.');
//       }
//     } catch (err) {
//       setError('Error fetching pin codes. Please try again.');
//       console.error(err);
//     }
//   };

//   // Assuming you want to filter by District, adjust if needed
//   const getPincods = pinCodes?.filter((item) => item?.District?.toLowerCase() === city.toLowerCase());

//   console.log(getPincods);
  
//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Find Pin Codes</h1>
//       <input
//         type="text"
//         value={city}
//         onChange={(e) => setCity(e.target.value)}
//         placeholder="Enter city"
//         className="border p-2 mb-4 w-full"
//       />
//       <button
//         onClick={fetchPinCodes}
//         className="bg-blue-500 text-white py-2 px-4 rounded"
//       >
//         Get Pin Codes
//       </button>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {getPincods?.length > 0 && (
//         <ul className="mt-4">
//           {getPincods.map((pinCode, index) => (
//             <li key={index} className="border-b py-2">
//               {pinCode.Pincode} {/* Display the Pincode property */}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default Report;
