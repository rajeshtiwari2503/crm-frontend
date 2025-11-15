 


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
        console.log("data",data);
        
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

  // const aggregateByKey = (items, key) => {
  //   const result = [[key.charAt(0).toUpperCase() + key.slice(1), "Complaints"]];
  //   const countMap = {};

  //   items.forEach((item) => {
  //     const keyVal = item[key];
  //     if (!keyVal) return;
  //     countMap[keyVal] = (countMap[keyVal] || 0) + (item.count || 0);
  //   });

  //   Object.entries(countMap).forEach(([k, v]) => {
  //     result.push([k, v]);
  //   });

  //   return result;
  // };

const aggregateByKey = (items, key) => {
  const result = [[key.charAt(0).toUpperCase() + key.slice(1), "Complaints"]];
  const countMap = {};

  items.forEach((item) => {
    const keyVal = item[key];
    if (!keyVal) return;
    countMap[keyVal] = (countMap[keyVal] || 0) + (item.count || 0);
  });

  Object.entries(countMap).forEach(([k, v]) => {
    result.push([`${k} (${v})`, v]); // <-- Include number in the label
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
    pieSliceText: "label",
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

  const filteredStatewiseData = Object.fromEntries(
  Object.entries(statewiseData)
    .filter(([stateName]) => !state || stateName === state) // filter by state
    .map(([stateName, brands]) => {
      const filteredBrands = Object.fromEntries(
        Object.entries(brands)
          .filter(([brandName]) => !brand || brand === brandName) // filter by brand
          .map(([brandName, districts]) => {
            const filteredDistricts = Object.fromEntries(
              Object.entries(districts)
                .filter(([districtName]) => !district || district === districtName) // filter by district
            );
            return [brandName, filteredDistricts];
          })
          .filter(([_, districts]) => Object.keys(districts).length > 0) // remove empty brands
      );

      if (Object.keys(filteredBrands).length === 0) return null; // remove empty states
      return [stateName, filteredBrands];
    })
    .filter(Boolean)
);



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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
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
          (
          <div>
            <h3 className="text-xl mb-4">Detailed Pending Complaints by State</h3>
         
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6">
  {Object.entries(filteredStatewiseData).map(([stateName, brands], stateIndex) => {
    // Total complaints for the state
    const totalStateCount = Object.values(brands).reduce((brandAcc, districts) => {
      return brandAcc + Object.values(districts).reduce((districtAcc, districtData) => districtAcc + (districtData.count || 0), 0);
    }, 0);

    return (
      <div
        key={stateIndex}
        className={`bg-gradient-to-br ${gradients[stateIndex % gradients.length]} text-gray-800 rounded-xl shadow-lg p-5 transition-transform transform hover:scale-100 hover:shadow-2xl`}
      >
        {/* State Header */}
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-gray-300">
          <Business fontSize="medium" className="text-gray-800" />
          <span className="text-lg md:text-xl font-bold">{stateName} ({totalStateCount})</span>
        </div>

        {/* Brands */}
        {Object.entries(brands).map(([brandName, districts], brandIndex) => {
          const brandTotal = Object.values(districts).reduce((acc, districtData) => acc + (districtData.count || 0), 0);

          let brandColor = "text-green-600";
          if (brandTotal > 5) brandColor = "text-red-600";
          else if (brandTotal > 2) brandColor = "text-yellow-600";

          return (
            <div key={brandIndex} className="mb-4">
              {/* Brand Header */}
              <div className={`text-sm md:text-base font-semibold mb-2 ${brandColor}`}>
                {brandName} ({brandTotal})
              </div>

              {/* Districts */}
              {Object.entries(districts).map(([districtName, districtData], districtIndex) => {
                const count = districtData.count || 0;

                let districtColor = "text-green-600";
                if (count > 5) districtColor = "text-red-600";
                else if (count > 2) districtColor = "text-yellow-600";

                return (
                  <div key={districtIndex} className="ml-3 mb-3">
                    {/* District Header */}
                    <div className="flex items-center justify-between gap-2 text-sm md:text-base py-1">
                      <div className="flex items-center gap-2">
                        <ReportProblem fontSize="small" className={districtColor} />
                        <span className="text-gray-700 font-medium">{districtName}</span>
                      </div>
                      <span className={`font-semibold ${districtColor}`}>{count}</span>
                    </div>

                    {/* Individual complaints */}
                    {districtData.complaints && districtData.complaints.map((c, idx) => (
                      <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center text-xs md:text-sm ml-5 py-1 gap-1">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${c.color === "green" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {c.status}
                        </span>
                        <span className="text-gray-500 font-mono">{c.hoursOpen}h</span>
                        <span className="text-gray-600 font-mono truncate">{c.complaintId}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  })}
</div>







        </div>
 )
        }
      </>




    </>
  );
};

export default ComplaintAnalyticsPage;



//  "use client";

// import React, { useState, useEffect } from "react";
// import Chart from "react-google-charts";
// import { Business, ReportProblem, FilterList, Clear } from "@mui/icons-material";
// import http_request from "../../../http-request";

// const ComplaintAnalyticsPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingSBT, setLoadingSBT] = useState(false);
//   const [rawStatewiseData, setRawStatewiseData] = useState({});

//   // Filters
//   const [brand, setBrand] = useState("");
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [productName, setProductName] = useState("");
//   const [detailedDescription, setDetailedDescription] = useState("");

//   useEffect(() => {
//     fetchAllComplaintData();
//     fetchStatewiseData();
//   }, []);

//   const fetchStatewiseData = async () => {
//     try {
//       setLoading(true);
//       // Simulated API call - replace with actual API
   
//       const response = await http_request.get("/getStatewisePendingComplaints");
//       const result = await response.json();
//       setRawStatewiseData(result.data || {});
//       setLoading(false);
//     } catch (error) {
//       setLoading(false);
//       console.error("Error fetching data:", error);
//     }
//   };

//   const fetchAllComplaintData = async () => {
//     setLoadingSBT(true);
//     try {
//       // Simulated API call - replace with actual API
     
//        const response = await http_request.get("/getStatewiseBrandData");
//       const result = await response.json();
//       if (result.data?.chartData) {
//         setData(result.data.chartData);
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

//   // Filter the chart data
//   const filteredData = data.filter((item) => {
//     const itemDate = new Date(item.date);
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     if (brand && item.brandName !== brand) return false;
//     if (state && item.state !== state) return false;
//     if (district && item.district !== district) return false;
//     if (productName && item.productName !== productName) return false;
//     if (detailedDescription && item.detailedDescription !== detailedDescription) return false;
//     if (start && itemDate < start) return false;
//     if (end && itemDate > end) return false;

//     return true;
//   });

//   // Filter the statewise data based on selected filters
//   // const getFilteredStatewiseData = () => {
//   //   let filtered = JSON.parse(JSON.stringify(rawStatewiseData));

//   //   // Apply state filter
//   //   if (state) {
//   //     filtered = { [state]: filtered[state] || {} };
//   //   }

//   //   // Apply brand and district filters
//   //   Object.keys(filtered).forEach(stateName => {
//   //     const stateData = filtered[stateName];
      
//   //     if (brand) {
//   //       // Keep only selected brand
//   //       filtered[stateName] = { [brand]: stateData[brand] || {} };
//   //     }

//   //     // Apply district filter
//   //     Object.keys(filtered[stateName]).forEach(brandName => {
//   //       if (district) {
//   //         const districtCount = filtered[stateName][brandName][district];
//   //         filtered[stateName][brandName] = districtCount ? { [district]: districtCount } : {};
//   //       }
//   //     });

//   //     // Remove empty brands
//   //     Object.keys(filtered[stateName]).forEach(brandName => {
//   //       if (Object.keys(filtered[stateName][brandName]).length === 0) {
//   //         delete filtered[stateName][brandName];
//   //       }
//   //     });

//   //     // Remove empty states
//   //     if (Object.keys(filtered[stateName]).length === 0) {
//   //       delete filtered[stateName];
//   //     }
//   //   });

//   //   return filtered;
//   // };

//   const getFilteredStatewiseData = () => {
//   let filtered =  rawStatewiseData;

//   // Apply state filter
//   if (state) {
//     filtered = { [state]: filtered[state] || {} };
//   }

//   // Apply brand and district filters
//   Object.keys(filtered).forEach((stateName) => {
//     const stateData = filtered[stateName];

//     // Only filter brand if a brand is selected
//     if (brand) {
//       filtered[stateName] = { [brand]: stateData[brand] || {} };
//     }

//     // Apply district filter
//     Object.keys(filtered[stateName]).forEach((brandName) => {
//       if (district) {
//         const districtCount = filtered[stateName][brandName][district];
//         filtered[stateName][brandName] = districtCount ? { [district]: districtCount } : {};
//       }
//     });

//     // Remove empty brands
//     Object.keys(filtered[stateName]).forEach((brandName) => {
//       if (Object.keys(filtered[stateName][brandName]).length === 0) {
//         delete filtered[stateName][brandName];
//       }
//     });

//     // Remove empty states
//     if (Object.keys(filtered[stateName]).length === 0) {
//       delete filtered[stateName];
//     }
//   });

//   return filtered;
// };


//   const filteredStatewiseData = getFilteredStatewiseData();

//   const aggregateByKey = (items, key) => {
//     const result = [[key.charAt(0).toUpperCase() + key.slice(1), "Complaints"]];
//     const countMap = {};

//     items.forEach((item) => {
//       const keyVal = item[key];
//       if (!keyVal) return;
//       countMap[keyVal] = (countMap[keyVal] || 0) + (item.count || 0);
//     });

//     Object.entries(countMap).forEach(([k, v]) => {
//       result.push([k, v]);
//     });

//     return result;
//   };

//   const brandOptions = [...new Set(data.map((d) => d.brandName).filter(Boolean))];
//   const stateOptions = [...new Set(data.map(d => d.state).filter(Boolean))];
//   const districtOptions = [
//     ...new Set(
//       data
//         .filter((d) => !state || d.state === state)
//         .map((d) => d.district)
//         .filter(Boolean)
//     ),
//   ];
//   const productOptions = [...new Set(data.map((d) => d.productName).filter(Boolean))];
//   const issueOptions = [...new Set(data.map((d) => d.detailedDescription).filter(Boolean))];

//   const brandChartData = aggregateByKey(filteredData, "brandName");
//   const stateChartData = aggregateByKey(filteredData, "state");
//   const districtChartData = aggregateByKey(filteredData, "district");
//   const productChartData = aggregateByKey(filteredData, "productName");
//   const issueChartData = aggregateByKey(filteredData, "detailedDescription");

//   const chartOptions = (title) => ({
//     title,
//     pieSliceText: "value",
//     is3D: true,
//     chartArea: { width: "90%", height: "80%" },
//     legend: { position: "right", textStyle: { fontSize: 12 } },
//     slices: {
//       0: { offset: 0.05 },
//       1: { offset: 0.05 },
//     },
//   });

//   const gradients = [
//     "from-pink-50 to-pink-100",
//     "from-blue-50 to-blue-100",
//     "from-green-50 to-green-100",
//     "from-yellow-50 to-yellow-100",
//     "from-purple-50 to-purple-100",
//     "from-teal-50 to-teal-100",
//   ];

//   const clearFilters = () => {
//     setBrand("");
//     setState("");
//     setDistrict("");
//     setStartDate("");
//     setEndDate("");
//     setProductName("");
//     setDetailedDescription("");
//   };

//   const hasActiveFilters = brand || state || district || startDate || endDate || productName || detailedDescription;

//   const downloadExcel = () => {
//     if (filteredData.length === 0) return;
    
//     const headers = ["Brand", "State", "District", "Product", "Issue", "Date", "Count"];
//     const csvContent = [
//       headers.join(","),
//       ...filteredData.map(item => 
//         [
//           item.brandName || "",
//           item.state || "",
//           item.district || "",
//           item.productName || "",
//           item.detailedDescription || "",
//           item.date || "",
//           item.count || 0
//         ].join(",")
//       )
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", `complaint_analytics_${new Date().toISOString().split('T')[0]}.csv`);
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-8">
//       {/* Filters Section */}
//       <div className="bg-white shadow-lg rounded-xl p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2">
//             <FilterList className="text-gray-700" />
//             <h2 className="text-2xl font-bold text-gray-800">Complaint Analytics</h2>
//           </div>
//           {hasActiveFilters && (
//             <button
//               onClick={clearFilters}
//               className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
//             >
//               <Clear fontSize="small" />
//               Clear Filters
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//           <select
//             value={brand}
//             onChange={(e) => setBrand(e.target.value)}
//             className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">All Brands</option>
//             {brandOptions.map((b, i) => (
//               <option key={i} value={b}>{b}</option>
//             ))}
//           </select>

//           <select
//             value={state}
//             onChange={(e) => {
//               setState(e.target.value);
//               setDistrict("");
//             }}
//             className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">All States</option>
//             {stateOptions.map((s, i) => (
//               <option key={i} value={s}>{s}</option>
//             ))}
//           </select>

//           <select
//             value={district}
//             onChange={(e) => setDistrict(e.target.value)}
//             className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">All Districts</option>
//             {districtOptions.map((d, i) => (
//               <option key={i} value={d}>{d}</option>
//             ))}
//           </select>

//           <select
//             value={productName}
//             onChange={(e) => setProductName(e.target.value)}
//             className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           >
//             <option value="">All Products</option>
//             {productOptions.map((p, i) => (
//               <option key={i} value={p}>{p}</option>
//             ))}
//           </select>

//           <select
//             value={detailedDescription}
//             onChange={(e) => setDetailedDescription(e.target.value)}
//             className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent col-span-1 sm:col-span-2"
//           >
//             <option value="">All Issues</option>
//             {issueOptions.map((desc, i) => (
//               <option key={i} value={desc}>{desc}</option>
//             ))}
//           </select>

//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             placeholder="Start Date"
//             className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />

//           <input
//             type="date"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             placeholder="End Date"
//             className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />

//           {filteredData?.length > 0 && (
//             <button
//               onClick={downloadExcel}
//               className="bg-green-600 text-white rounded-lg p-3 hover:bg-green-700 transition-colors font-medium"
//             >
//               Download Excel
//             </button>
//           )}
//         </div>

//         {hasActiveFilters && (
//           <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-800">
//               <strong>Active Filters:</strong> {filteredData.length} complaints found
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Charts Section */}
//       <div className="bg-white shadow-lg rounded-xl p-6">
//         <h3 className="text-xl font-bold mb-6 text-gray-800">Complaint Distribution Charts</h3>
//         {loadingSBT ? (
//           <div className="flex justify-center items-center h-60">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : filteredData.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No data to display. Try adjusting your filters.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {brandChartData.length > 1 && (
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <Chart
//                   chartType="PieChart"
//                   width="100%"
//                   height="350px"
//                   data={brandChartData}
//                   options={chartOptions("Complaints by Brand")}
//                 />
//               </div>
//             )}
//             {stateChartData.length > 1 && (
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <Chart
//                   chartType="PieChart"
//                   width="100%"
//                   height="350px"
//                   data={stateChartData}
//                   options={chartOptions("Complaints by State")}
//                 />
//               </div>
//             )}
//             {districtChartData.length > 1 && (
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <Chart
//                   chartType="PieChart"
//                   width="100%"
//                   height="350px"
//                   data={districtChartData}
//                   options={chartOptions("Complaints by District")}
//                 />
//               </div>
//             )}
//             {productChartData.length > 1 && (
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <Chart
//                   chartType="PieChart"
//                   width="100%"
//                   height="350px"
//                   data={productChartData}
//                   options={chartOptions("Complaints by Product")}
//                 />
//               </div>
//             )}
//             {issueChartData.length > 1 && (
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <Chart
//                   chartType="PieChart"
//                   width="100%"
//                   height="350px"
//                   data={issueChartData}
//                   options={chartOptions("Complaints by Issue")}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Statewise Pending Complaints Section */}
//       <div className="bg-white shadow-lg rounded-xl p-6">
//         <h3 className="text-xl font-bold mb-6 text-gray-800">Pending Complaints by State</h3>
//         {loading ? (
//           <div className="flex justify-center items-center h-60">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : Object.keys(filteredStatewiseData).length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {Object.entries(filteredStatewiseData).map(([stateName, brands], stateIndex) => (
//               <div
//                 key={stateIndex}
//                 className={`bg-gradient-to-br ${gradients[stateIndex % gradients.length]} text-gray-800 rounded-xl shadow-md p-5 transition-transform transform hover:scale-105 hover:shadow-lg`}
//               >
//                 <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-300">
//                   <Business fontSize="small" className="text-gray-700" />
//                   <span className="text-base font-bold">{stateName}</span>
//                 </div>

//                 {Object.entries(brands).map(([brandName, districts], brandIndex) => (
//                   <div key={brandIndex} className="mb-3">
//                     <div className="text-sm font-semibold text-gray-700 mb-1">{brandName}</div>
//                     {Object.entries(districts).map(([districtName, count], districtIndex) => (
//                       <div
//                         key={districtIndex}
//                         className="flex items-center justify-between gap-2 text-sm ml-2 py-1"
//                       >
//                         <div className="flex items-center gap-1">
//                           <ReportProblem fontSize="small" className="text-red-600" />
//                           <span className="text-gray-700">{districtName}</span>
//                         </div>
//                         <span className="font-semibold text-red-600">{count}</span>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No pending complaints found with current filters.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ComplaintAnalyticsPage;