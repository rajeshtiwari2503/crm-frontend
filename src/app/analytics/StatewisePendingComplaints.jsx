
// "use client";

// import React, { useState, useEffect } from "react";
// import Chart from "react-google-charts";
// import http_request from "../../../http-request";
// import { ReactLoader } from "../components/common/Loading";
// import { Business, ReportProblem } from "@mui/icons-material";

// const ComplaintAnalyticsPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingSBT, setLoadingSBT] = useState(false);

//   // Filters
//   const [brand, setBrand] = useState("");
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [statewiseData, setStatewiseData] = useState([]);

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
//   }, []);
//   const fetchAllComplaintData = async () => {
//     setLoadingSBT(true);
//     try {
//       const res = await http_request.post("/getStatewiseBrandData", {});
//       if (res.data?.chartData) {
//         setData(res.data.chartData);
//       } else {
//         setData([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setData([]);
//     } finally {
//       setLoadingSBT(false);
//     }
//   };

//   // Filter data by current selected filters (brand, state, district, date range)
//   const filteredData = data.filter((item) => {
//     if (brand && item.brandName !== brand) return false;
//     if (state && item.state !== state) return false;
//     if (district && item.district !== district) return false;
//     if (startDate && new Date(item.date) < new Date(startDate)) return false;
//     if (endDate && new Date(item.date) > new Date(endDate)) return false;
//     return true;
//   });

//   // Options for filters cascading
//   // States available for selected brand
//   const statesForBrand = brand
//     ? [...new Set(data.filter((d) => d.brandName === brand).map((d) => d.state).filter(Boolean))]
//     : [];

//   // Districts available for selected brand+state
//   const districtsForBrandState =
//     brand && state
//       ? [
//         ...new Set(
//           data
//             .filter((d) => d.brandName === brand && d.state === state)
//             .map((d) => d.district)
//             .filter(Boolean)
//         ),
//       ]
//       : [];

//   // Aggregate helper: returns chart data array for Google Charts (label, count)
//   const aggregateByKey = (items, key) => {
//     const agg = {};
//     items.forEach(({ count, [key]: val }) => {
//       if (!val) return;
//       agg[val] = (agg[val] || 0) + (count || 0);
//     });
//     const chartArr = [[key.charAt(0).toUpperCase() + key.slice(1), "Complaints"]];
//     Object.entries(agg).forEach(([k, v]) => chartArr.push([k, v]));
//     return chartArr;
//   };

//   // Determine what to aggregate for chart based on filters:
//   // 1. If no brand selected → aggregate by brand overall
//   // 2. If brand selected but no state → aggregate by state for brand
//   // 3. If brand+state selected but no district → aggregate by district for brand+state
//   // 4. If brand+state+district selected → aggregate by date or show raw data count (we'll aggregate by date counts)

//   let chartTitle = "Complaints by Brand";
//   let chartData = aggregateByKey(filteredData, "brandName");

//   if (brand && !state) {
//     chartTitle = `Complaints by State for Brand: ${brand}`;
//     const filteredBrandData = data.filter((d) => d.brandName === brand);
//     chartData = aggregateByKey(filteredBrandData, "state");
//   } else if (brand && state && !district) {
//     chartTitle = `Complaints by District for Brand: ${brand}, State: ${state}`;
//     const filteredBrandStateData = data.filter((d) => d.brandName === brand && d.state === state);
//     chartData = aggregateByKey(filteredBrandStateData, "district");
//   } else if (brand && state && district) {
//     chartTitle = `Complaints over Dates for Brand: ${brand}, State: ${state}, District: ${district}`;
//     // Aggregate by date in filtered data for that combination
//     const filteredFull = data.filter(
//       (d) => d.brandName === brand && d.state === state && d.district === district
//     );
//     chartData = aggregateByKey(filteredFull, "date");
//   }


//   const gradients = [
//     "from-pink-50 to-pink-100",
//     "from-blue-50 to-blue-100",
//     "from-green-50 to-green-100",
//     "from-yellow-50 to-yellow-100",
//     "from-purple-50 to-purple-100",
//     "from-teal-50 to-teal-100",
//   ];

//   return (
//     <div className=" ">
//       <div className="max-w-7xl mx-auto p-6 space-y-8">
//         <div className="bg-white shadow rounded-xl p-6">
//           <h2 className="text-xl font-bold mb-6">Complaint Analytics</h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
//             {/* Brand Select */}
//             <select
//               value={brand}
//               onChange={(e) => {
//                 setBrand(e.target.value);
//                 setState("");
//                 setDistrict("");
//                 setStartDate("");
//                 setEndDate("");
//               }}
//               className="border border-gray-300 rounded p-2"
//             >
//               <option value="">Select Brand</option>
//               {[...new Set(data.map((d) => d.brandName).filter(Boolean))].map((b, i) => (
//                 <option key={i} value={b}>
//                   {b}
//                 </option>
//               ))}
//             </select>

//             {/* State Select - enabled only if brand selected */}
//             <select
//               value={state}
//               onChange={(e) => {
//                 setState(e.target.value);
//                 setDistrict("");
//                 setStartDate("");
//                 setEndDate("");
//               }}
//               className={`border border-gray-300 rounded p-2 ${brand ? "" : "bg-gray-100 cursor-not-allowed"}`}
//               disabled={!brand}
//             >
//               <option value="">Select State</option>
//               {statesForBrand.map((s, i) => (
//                 <option key={i} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>

//             {/* District Select - enabled only if brand+state selected */}
//             <select
//               value={district}
//               onChange={(e) => {
//                 setDistrict(e.target.value);
//                 setStartDate("");
//                 setEndDate("");
//               }}
//               className={`border border-gray-300 rounded p-2 ${brand && state ? "" : "bg-gray-100 cursor-not-allowed"
//                 }`}
//               disabled={!brand || !state}
//             >
//               <option value="">Select District</option>
//               {districtsForBrandState.map((d, i) => (
//                 <option key={i} value={d}>
//                   {d}
//                 </option>
//               ))}
//             </select>

//             {/* Start Date - enabled only if brand+state+district selected */}
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className={`border border-gray-300 rounded p-2 ${brand && state && district ? "" : "bg-gray-100 cursor-not-allowed"
//                 }`}
//               disabled={!brand || !state || !district}
//               placeholder="Start Date"
//             />

//             {/* End Date - enabled only if brand+state+district selected */}
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className={`border border-gray-300 rounded p-2 ${brand && state && district ? "" : "bg-gray-100 cursor-not-allowed"
//                 }`}
//               disabled={!brand || !state || !district}
//               placeholder="End Date"
//             />
//           </div>

//           {loadingSBT ? (
//             <div className="flex justify-center items-center h-60">
//               <ReactLoader />
//             </div>
//           ) : chartData.length > 1 ? (
//             <Chart
//               chartType="PieChart"
//               width="100%"
//               height="400px"
//               data={chartData}
//               // options={{ title: chartTitle }}
//               options={{
//                 title: chartTitle,
//                 pieSliceText: "value",       // ✅ show the value (number) inside slices
//                 is3D: true,                  // optional: 3D effect
//                 slices: {
//                   0: { offset: 0.05 },
//                   1: { offset: 0.05 },
//                 },
//                 chartArea: { width: "90%", height: "80%" }, // optional: more compact chart
//                 legend: { position: "right", textStyle: { fontSize: 12 } },
//               }}
//             />
//           ) : (
//             <p className="text-center text-gray-500">No data to display.</p>
//           )}
//         </div>
//         {/* Statewise Pending Complaints Data (optional table or detailed list) */}
//         {/* <div className="grid grid-cols-12 gap-4">
//               <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
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
//           </div>   */}
//        <>
//          {loading ? (
//             <div className="flex justify-center items-center h-60">
//               <ReactLoader />
//             </div>
//           )
//        :
//        ( <div>
//           <h3 className="text-xl mb-4">Detailed Pending Complaints by State</h3>
//           {statewiseData.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
//               {statewiseData?.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`bg-gradient-to-br ${gradients[index % gradients.length]} text-gray-800 rounded-xl shadow p-4 transition-transform transform hover:scale-105`}
//                 >
//                   {/* Service Center Name */}
//                   <div className="flex items-center gap-2 mb-2">
//                     <Business fontSize="small" className="text-gray-700" />
//                     <span
//                       className=" text-sm font-semibold truncate max-w-[200px]" // adjust width as needed
//                       title={item._id} // shows full name on hover
//                     >
//                       {item._id}
//                     </span>
//                   </div>
//                   {/* Pending Complaints */}
//                   <div className="flex items-center gap-2">
//                     <ReportProblem fontSize="small" className="text-red-600" />
//                     <span className="text-sm font-semibold text-red-600">{item.count} Pending </span>                    </div>
//                 </div>
//               ))}
//             </div>
//           )
//             : (
//               <p>No data available.</p>
//             )}
//         </div>
//         )}
//         </>
//       </div>


//     </div>
//   );
// };

// export default ComplaintAnalyticsPage;


"use client";

import React, { useState, useEffect } from "react";
import Chart from "react-google-charts";
import http_request from "../../../http-request";
import { ReactLoader } from "../components/common/Loading";
import { Business, ReportProblem } from "@mui/icons-material";
import DownloadExcel from "../components/DownLoadExcel";

const ComplaintAnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSBT, setLoadingSBT] = useState(false);

  // Filters
  const [brand, setBrand] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statewiseData, setStatewiseData] = useState([]);
  const [productName, setProductName] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");


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
    setLoadingSBT(true);
    try {
      const res = await http_request.get("/getStatewiseBrandData", {});
      if (res.data?.chartData) {
        setData(res.data.chartData);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoadingSBT(false);
    }
  };
  // const filteredData = data.filter((item) => {
  //   const itemDate = new Date(item.date);
  //   const start = startDate ? new Date(startDate) : null;
  //   const end = endDate ? new Date(endDate) : null;

  //   if (brand && item.brandName !== brand) return false;
  //   if (state && item.state !== state) return false;
  //   if (district && item.district !== district) return false;
  //   if (start && itemDate < start) return false;
  //   if (end && itemDate > end) return false;

  //   return true;
  // });


  const filteredData = data.filter((item) => {
    const itemDate = new Date(item.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (brand && item.brandName !== brand) return false;
    if (state && item.state !== state) return false;
    if (district && item.district !== district) return false;
    if (productName && item.productName !== productName) return false;
    if (detailedDescription && item.detailedDescription !== detailedDescription) return false;
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;

    return true;
  });

  // console.log("filteredData",filteredData);

  const aggregateByKey = (items, key) => {
    const result = [[key.charAt(0).toUpperCase() + key.slice(1), "Complaints"]];
    const countMap = {};

    items.forEach((item) => {
      const keyVal = item[key];
      if (!keyVal) return;
      countMap[keyVal] = (countMap[keyVal] || 0) + (item.count || 0);
    });

    Object.entries(countMap).forEach(([k, v]) => {
      result.push([k, v]);
    });

    return result;
  };
  
  const brandOptions = [...new Set(data.map((d) => d.brandName).filter(Boolean))];
   
  // const stateOptions = brand
  //   ? [...new Set(data.filter((d) => d.brandName === brand).map((d) => d.state).filter(Boolean))]
  //   : [];
  // const districtOptions = brand && state
  //   ? [...new Set(data.filter((d) => d.brandName === brand && d.state === state).map((d) => d.district).filter(Boolean))]
  //   : [];
  const stateOptions = [...new Set(data.map(d => d.state).filter(Boolean))];

  const districtOptions = [
    ...new Set(
      data
        .filter((d) => !state || d.state === state)
        .map((d) => d.district)
        .filter(Boolean)
    ),
  ];
  const brandChartData = aggregateByKey(filteredData, "brandName");
  const stateChartData = aggregateByKey(filteredData, "state");
  const districtChartData = aggregateByKey(filteredData, "district");
  const productChartData = aggregateByKey(filteredData, "productName");
  const issueChartData = aggregateByKey(filteredData, "detailedDescription");

  const chartOptions = (title) => ({
    title,
    pieSliceText: "value",
    is3D: true,
    chartArea: { width: "90%", height: "80%" },
    legend: { position: "right", textStyle: { fontSize: 12 } },
    slices: {
      0: { offset: 0.05 },
      1: { offset: 0.05 },
    },
  });


  const gradients = [
    "from-pink-50 to-pink-100",
    "from-blue-50 to-blue-100",
    "from-green-50 to-green-100",
    "from-yellow-50 to-yellow-100",
    "from-purple-50 to-purple-100",
    "from-teal-50 to-teal-100",
  ];
  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Complaint Analytics</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setState("");
                setDistrict("");
              }}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Select Brand</option>
              {brandOptions.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setDistrict("");
              }}
              // disabled={!brand}
              className="border border-gray-300 rounded p-2 disabled:bg-gray-100"
            >
              <option value="">Select State</option>
              {stateOptions.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              // disabled={!brand || !state}
              className="border border-gray-300 rounded p-2 disabled:bg-gray-100"
            >
              <option value="">Select District</option>
              {districtOptions.map((d, i) => (
                <option key={i} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Select Product</option>
              {[...new Set(data.map((d) => d.productName).filter(Boolean))].map((p, i) => (
                <option key={i} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              className="border border-gray-300 rounded p-2"
            >
              <option value="">Select Issue</option>
              {[...new Set(data.map((d) => d.detailedDescription).filter(Boolean))].map((desc, i) => (
                <option key={i} value={desc}>
                  {desc}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              // disabled={!brand || !state || !district}
              className="border border-gray-300 rounded p-2 disabled:bg-gray-100"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              // disabled={!brand || !state || !district}
              className="border border-gray-300 rounded p-2 disabled:bg-gray-100"
            />
            <div>
              {filteredData?.length > 0 ? <DownloadExcel
                data={filteredData}
                fileName="BrandData"
                fieldsToInclude={["brandName", "date", "district", "state", "count"]}
              />
                : ""}
            </div>
          </div>

          {loadingSBT ? (
            <div className="flex justify-center items-center h-60">
              <ReactLoader />
            </div>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-gray-500">No data to display.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {brandChartData.length > 1 && (
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="350px"
                  data={brandChartData}
                  options={chartOptions("Complaints by Brand")}
                />
              )}
              {stateChartData.length > 1 && (
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="350px"
                  data={stateChartData}
                  options={chartOptions("Complaints by State")}
                />
              )}
              {districtChartData.length > 1 && (
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="350px"
                  data={districtChartData}
                  options={chartOptions("Complaints by District")}
                />
              )}
              {productChartData.length > 1 && (
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="350px"
                  data={productChartData}
                  options={chartOptions("Complaints by Product")}
                />
              )}

              {issueChartData.length > 1 && (
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="350px"
                  data={issueChartData}
                  options={chartOptions("Complaints by Issue Description")}
                />
              )}

            </div>
          )}
        </div>
      </div>

      <>
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <ReactLoader />
          </div>
        )
          :
          (<div>
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
          )}
      </>




    </>
  );
};

export default ComplaintAnalyticsPage;
