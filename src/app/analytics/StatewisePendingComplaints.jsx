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

"use client";

import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import http_request from "../../../http-request";
import { ReactLoader } from "../components/common/Loading";
import { Business, ReportProblem } from "@mui/icons-material";

const ComplaintAnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [brand, setBrand] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statewiseData, setStatewiseData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await http_request.get("/getStatewisePendingComplaints"); // Adjust the API path if needed
        let { data } = response;
        setStatewiseData(data);
        setLoading(false)
      } catch (error) {
        setLoading(false)

        console.error("Error fetching data:", error);
      }
    };
    fetchAllComplaintData()
    fetchData();
  }, []);
  const fetchAllComplaintData = async () => {
    setLoading(true);
    try {
      const res = await http_request.post("/getStatewiseBrandData", {});
      if (res.data?.chartData) {
        setData(res.data.chartData);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter data by current selected filters (brand, state, district, date range)
  const filteredData = data.filter((item) => {
    if (brand && item.brandName !== brand) return false;
    if (state && item.state !== state) return false;
    if (district && item.district !== district) return false;
    if (startDate && new Date(item.date) < new Date(startDate)) return false;
    if (endDate && new Date(item.date) > new Date(endDate)) return false;
    return true;
  });

  // Options for filters cascading
  // States available for selected brand
  const statesForBrand = brand
    ? [...new Set(data.filter((d) => d.brandName === brand).map((d) => d.state).filter(Boolean))]
    : [];

  // Districts available for selected brand+state
  const districtsForBrandState =
    brand && state
      ? [
        ...new Set(
          data
            .filter((d) => d.brandName === brand && d.state === state)
            .map((d) => d.district)
            .filter(Boolean)
        ),
      ]
      : [];

  // Aggregate helper: returns chart data array for Google Charts (label, count)
  const aggregateByKey = (items, key) => {
    const agg = {};
    items.forEach(({ count, [key]: val }) => {
      if (!val) return;
      agg[val] = (agg[val] || 0) + (count || 0);
    });
    const chartArr = [[key.charAt(0).toUpperCase() + key.slice(1), "Complaints"]];
    Object.entries(agg).forEach(([k, v]) => chartArr.push([k, v]));
    return chartArr;
  };

  // Determine what to aggregate for chart based on filters:
  // 1. If no brand selected → aggregate by brand overall
  // 2. If brand selected but no state → aggregate by state for brand
  // 3. If brand+state selected but no district → aggregate by district for brand+state
  // 4. If brand+state+district selected → aggregate by date or show raw data count (we'll aggregate by date counts)

  let chartTitle = "Complaints by Brand";
  let chartData = aggregateByKey(filteredData, "brandName");

  if (brand && !state) {
    chartTitle = `Complaints by State for Brand: ${brand}`;
    const filteredBrandData = data.filter((d) => d.brandName === brand);
    chartData = aggregateByKey(filteredBrandData, "state");
  } else if (brand && state && !district) {
    chartTitle = `Complaints by District for Brand: ${brand}, State: ${state}`;
    const filteredBrandStateData = data.filter((d) => d.brandName === brand && d.state === state);
    chartData = aggregateByKey(filteredBrandStateData, "district");
  } else if (brand && state && district) {
    chartTitle = `Complaints over Dates for Brand: ${brand}, State: ${state}, District: ${district}`;
    // Aggregate by date in filtered data for that combination
    const filteredFull = data.filter(
      (d) => d.brandName === brand && d.state === state && d.district === district
    );
    chartData = aggregateByKey(filteredFull, "date");
  }


  const gradients = [
    "from-pink-50 to-pink-100",
    "from-blue-50 to-blue-100",
    "from-green-50 to-green-100",
    "from-yellow-50 to-yellow-100",
    "from-purple-50 to-purple-100",
    "from-teal-50 to-teal-100",
  ];

  return (
    <div className=" ">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Complaint Analytics</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {/* Brand Select */}
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setState("");
                setDistrict("");
                setStartDate("");
                setEndDate("");
              }}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Select Brand</option>
              {[...new Set(data.map((d) => d.brandName).filter(Boolean))].map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* State Select - enabled only if brand selected */}
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict("");
                setStartDate("");
                setEndDate("");
              }}
              className={`border border-gray-300 rounded p-2 ${brand ? "" : "bg-gray-100 cursor-not-allowed"}`}
              disabled={!brand}
            >
              <option value="">Select State</option>
              {statesForBrand.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* District Select - enabled only if brand+state selected */}
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setStartDate("");
                setEndDate("");
              }}
              className={`border border-gray-300 rounded p-2 ${brand && state ? "" : "bg-gray-100 cursor-not-allowed"
                }`}
              disabled={!brand || !state}
            >
              <option value="">Select District</option>
              {districtsForBrandState.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Start Date - enabled only if brand+state+district selected */}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`border border-gray-300 rounded p-2 ${brand && state && district ? "" : "bg-gray-100 cursor-not-allowed"
                }`}
              disabled={!brand || !state || !district}
              placeholder="Start Date"
            />

            {/* End Date - enabled only if brand+state+district selected */}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`border border-gray-300 rounded p-2 ${brand && state && district ? "" : "bg-gray-100 cursor-not-allowed"
                }`}
              disabled={!brand || !state || !district}
              placeholder="End Date"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-60">
              <ReactLoader />
            </div>
          ) : chartData.length > 1 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={chartData}
              // options={{ title: chartTitle }}
              options={{
                title: chartTitle,
                pieSliceText: "value",       // ✅ show the value (number) inside slices
                is3D: true,                  // optional: 3D effect
                slices: {
                  0: { offset: 0.05 },
                  1: { offset: 0.05 },
                },
                chartArea: { width: "90%", height: "80%" }, // optional: more compact chart
                legend: { position: "right", textStyle: { fontSize: 12 } },
              }}
            />
          ) : (
            <p className="text-center text-gray-500">No data to display.</p>
          )}
        </div>
        {/* Statewise Pending Complaints Data (optional table or detailed list) */}
        {/* <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
              <h3 className="text-xl mb-4">Detailed Pending Complaints by State</h3>
              {statewiseData.length > 0 ? (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">State</th>
                      <th className="px-4 py-2">Pending Complaints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statewiseData.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2">{item._id}</td>
                        <td className="border px-4 py-2">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No data available.</p>
              )}
            </div>
          </div>   */}
        <div>
          <h3 className="text-xl mb-4">Detailed Pending Complaints by State</h3>
          {statewiseData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              {statewiseData?.map((item, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${gradients[index % gradients.length]} text-gray-800 rounded-xl shadow p-4 transition-transform transform hover:scale-105`}
                >
                  {/* Service Center Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <Business fontSize="small" className="text-gray-700" />
                    <span
                      className=" text-sm font-semibold truncate max-w-[200px]" // adjust width as needed
                      title={item._id} // shows full name on hover
                    >
                      {item._id}
                    </span>
                  </div>
                  {/* Pending Complaints */}
                  <div className="flex items-center gap-2">
                    <ReportProblem fontSize="small" className="text-red-600" />
                    <span className="text-sm font-semibold text-red-600">{item.count} Pending </span>                    </div>
                </div>
              ))}
            </div>
          )
            : (
              <p>No data available.</p>
            )}
        </div>
      </div>

    </div>
  );
};

export default ComplaintAnalyticsPage;
