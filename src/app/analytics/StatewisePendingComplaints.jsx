// "use client";
// import React, { useState, useEffect } from "react";
// import Sidenav from "../components/Sidenav";
// import { Chart } from "react-google-charts"; // Import Chart component from react-google-charts
// import http_request from "../../../http-request"
// import { ReactLoader } from "../components/common/Loading";
// import { Business, ReportProblem } from "@mui/icons-material";

// const StatewisePendingComplaints = () => {
//   const [statewiseData, setStatewiseData] = useState([]);
//   const [locationwiseData, setLocationwiseData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [brandLoading, setBrandLoading] = useState(false);

//   useEffect(() => {
//     // Fetch data from the backend API
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const response = await http_request.get("/getStatewisePendingComplaints"); // Adjust the API path if needed
//         let { data } = response;
//         setStatewiseData(data);
//         setLoading(false)
//       } catch (error) {
//         setLoading(false)

//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchAllComplaintData()
//     fetchData();
//   }, []); // Empty dependency array to fetch data once on component mount

//   const fetchAllComplaintData = async () => {
//     try {
//       setBrandLoading(true)
//       // const response = await http_request.get("/getAllComplaint"); // Adjust the API path if needed
//       const response = await http_request.get("/getAllBrandComplaint");  // Adjust the API path if needed
//       let { data } = response;
//       console.log("data", data);

//       setLocationwiseData(data);
//       setBrandLoading(false)
//     } catch (error) {
//       setBrandLoading(false)

//       console.error("Error fetching data:", error);
//     }
//   };
//   // console.log("locationwiseData",locationwiseData)
//   // Prepare the data for the Pie Chart (converting statewiseData into the correct format)
//   const chartData = [
//     ["State", "Pending Complaints"],
//     ...statewiseData?.map(item => [item._id, item.count]),
//   ];

//   // Options for the Pie Chart
//   const options = {
//     title: "State-wise Pending Complaints",
//     is3D: true,
//     slices: {
//       0: { offset: 0.1 },
//       1: { offset: 0.1 },
//     },
//     pieSliceText: "value",
//   };

//   const [state, setState] = useState("");
//   const [city, setCity] = useState("");
//   const [brand, setBrand] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const complaints = locationwiseData
//   const states = [...new Set(complaints.map((c) => c.state))];
//   const brands = [...new Set(complaints.map((c) => c.productBrand))];
//   // Extract unique cities based on selected state
//   const cities = state ? [...new Set(complaints.filter((c) => c.state === state).map((c) => c.district))] : [];

//   const filteredComplaints = complaints.filter((complaint) => {
//     const complaintDate = new Date(complaint.createdAt);

//     return (
//       (!brand || complaint.productBrand === brand) && // Show all brands by default
//       (!state || complaint.state === state) &&
//       (!city || complaint.district === city) &&
//       (!startDate || complaintDate >= new Date(startDate)) &&
//       (!endDate || complaintDate <= new Date(endDate))
//     );
//   });


//   // console.log("filteredComplaints", filteredComplaints);

//   // Generate chart data
//   const generateChartData = () => {
//     const dataMap = new Map();
//     filteredComplaints.forEach((complaint) => {
//       const key = state ? city || complaint.district : complaint.state; // Show city if state is selected, otherwise show states
//       dataMap.set(key, (dataMap.get(key) || 0) + 1);
//     });

//     return [["Location", "Complaints"], ...Array.from(dataMap.entries())];
//   };

//   const chartDataLoc = generateChartData();

//   const optionsLoc = {
//     title: "Complaints Distribution",
//     is3D: true,
//     slices: {
//       0: { offset: 0.1 },
//       1: { offset: 0.1 },
//     },
//     pieSliceText: "value",
//   };

//   // console.log("stateCounts",stateCounts);
//   const gradients = [
//     "from-pink-50 to-pink-100",
//     "from-blue-50 to-blue-100",
//     "from-green-50 to-green-100",
//     "from-yellow-50 to-yellow-100",
//     "from-purple-50 to-purple-100",
//     "from-teal-50 to-teal-100",
//   ];
//   return (
//     <>
//       <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//         <h2 className="text-xl font-semibold mb-4">Filter Complaints</h2>

//         {/* Filters */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">

//           <select value={brand} onChange={(e) => setBrand(e.target.value)} className="border p-2 rounded w-full">
//             <option value="">All Brands</option>
//             {brands.map((brand) => (
//               <option key={brand} value={brand}>
//                 {brand}
//               </option>
//             ))}
//           </select>
//           {/* State Dropdown */}
//           <select value={state} onChange={(e) => { setState(e.target.value); setCity(""); }} className="border p-2 rounded w-full">
//             <option value="">All States</option>
//             {states.map((state) => (
//               <option key={state} value={state}>
//                 {state}
//               </option>
//             ))}
//           </select>

//           {/* City Dropdown (Filtered Based on Selected State) */}
//           <select value={city} onChange={(e) => setCity(e.target.value)} className="border p-2 rounded w-full" disabled={!state}>
//             <option value="">All Cities</option>
//             {cities.map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>

//           {/* Start Date */}
//           <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded w-full" />

//           {/* End Date */}
//           <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded w-full" />
//         </div>

//         {/* Chart Display */}
//         {!brandLoading ? (
//           <Chart chartType="PieChart" width="100%" height="400px" data={chartDataLoc} options={optionsLoc} />
//         ) : (
//           <div className="h-[400px] flex justify-center items-center"> <ReactLoader /></div>
//         )}
//       </div>
//       {loading ? <div className="h-[400px] flex justify-center items-center"> <ReactLoader /></div>

//         : <div>
//           {/* <h2 className="text-lg mb-2">Analytics</h2> */}

//           {/* Pie Chart Section */}
//           <div className="grid grid-cols-12 gap-4 mb-8">
//             <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
//               <h3 className="text-xl mb-4">Statewise Pending Complaints</h3>
//               {statewiseData.length > 0 ? (
//                 <Chart
//                   chartType="PieChart"
//                   width="100%"
//                   height="400px"
//                   data={chartData}  // Pass the formatted chart data here
//                   options={options} // Pass the chart options here
//                 />
//               ) : (
//                 <p>No data available.</p>
//               )}
//             </div>
//           </div>

//           {/* Statewise Pending Complaints Data (optional table or detailed list) */}
//           {/* <div className="grid grid-cols-12 gap-4">
//             <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
//               <h3 className="text-xl mb-4">Detailed Pending Complaints by State</h3>
//               {statewiseData.length > 0 ? (
//                 <table className="min-w-full table-auto">
//                   <thead>
//                     <tr>
//                       <th className="px-4 py-2">State</th>
//                       <th className="px-4 py-2">Pending Complaints</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {statewiseData.map((item, index) => (
//                       <tr key={index}>
//                         <td className="border px-4 py-2">{item._id}</td>
//                         <td className="border px-4 py-2">{item.count}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <p>No data available.</p>
//               )}
//             </div>
//           </div> */}
//           <div>
//             <h3 className="text-xl mb-4">Detailed Pending Complaints by State</h3>
//             {statewiseData.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
//                 {statewiseData?.map((item, index) => (
//                   <div
//                     key={index}
//                     className={`bg-gradient-to-br ${gradients[index % gradients.length]} text-gray-800 rounded-xl shadow p-4 transition-transform transform hover:scale-105`}
//                   >
//                     {/* Service Center Name */}
//                     <div className="flex items-center gap-2 mb-2">
//                       <Business fontSize="small" className="text-gray-700" />
//                       <span
//                         className=" text-sm font-semibold truncate max-w-[200px]" // adjust width as needed
//                         title={item._id} // shows full name on hover
//                       >
//                         {item._id}
//                       </span>
//                     </div>

//                     {/* Pending Complaints */}
//                     <div className="flex items-center gap-2">
//                       <ReportProblem fontSize="small" className="text-red-600" />
//                       <span className="text-sm font-semibold text-red-600">{item.count} Pending </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )
//               : (
//                 <p>No data available.</p>
//               )}
//           </div>
//         </div>
//       }
//     </>
//   );
// };

// export default StatewisePendingComplaints;

"use client"

 import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import http_request from "../../../http-request";
import { ReactLoader } from "../components/common/Loading";

const ComplaintAnalyticsPage = () => {
  const [brandData, setBrandData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [brand, setBrand] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Initial brand summary
  useEffect(() => {
    fetchBrandData();
  }, []);

  const fetchBrandData = async () => {
    try {
      const response = await http_request.get("/getStatewisePendingComplaints");
      setBrandData(response.data);
    } catch (error) {
      console.error("Error fetching brand data", error);
    }
  };

  const fetchFilteredData = async () => {
    try {
      setLoading(true);

      const payload = {};
      if (brand) payload.brand = brand;
      if (state) payload.state = state;
      if (city) payload.city = city;
      if (startDate) payload.startDate = startDate;
      if (endDate) payload.endDate = endDate;

      const response = await http_request.post("/getStatewiseBrandData", payload);

      if (response.data && response.data.chartData) {
        setFilteredData(response.data.chartData);
      } else {
        setFilteredData([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching filtered data", error);
      setLoading(false);
    }
  };

  const formatChartData = (data) => {
    // Skip re-formatting if it's already in Google Charts format
    if (Array.isArray(data) && Array.isArray(data[0]) && data[0][0] === "Status") {
      return data;
    }
    const chartData = [["Brand", "Complaints"]];
    data.forEach((item) => {
      chartData.push([item.brand || "Unknown", item.count || 0]);
    });
    return chartData;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow rounded-xl p-4">
        <h2 className="text-lg font-bold mb-4">Complaint Summary by Brand</h2>
        {brandData.length > 0 ? (
          <Chart
            chartType="PieChart"
            width="100%"
            height="400px"
            data={formatChartData(brandData)}
            options={{ title: "Brand-wise Complaints" }}
          />
        ) : (
          <div className="text-center text-gray-500">Loading...</div>
        )}
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-md font-semibold mb-2">Apply Filters</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="border rounded p-2">
            <option value="">Select Brand</option>
            {brandData.map((b, idx) => (
              <option key={idx} value={b.brand}>{b.brand}</option>
            ))}
          </select>

          <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="border rounded p-2" />
          <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="border rounded p-2" />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded p-2" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded p-2" />
        </div>
        <button
          onClick={fetchFilteredData}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <ReactLoader />
        </div>
      ) : (
        filteredData.length > 1 && (
          <div className="bg-white shadow rounded-xl p-4">
            <h3 className="text-md font-semibold mb-2">Filtered Complaint Data</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={filteredData}
              options={{ title: "Filtered Complaints by Status" }}
            />
          </div>
        )
      )}
    </div>
  );
};

export default ComplaintAnalyticsPage;
