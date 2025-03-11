 "use client";
import React, { useState, useEffect } from "react";
import Sidenav from "../components/Sidenav";
import { Chart } from "react-google-charts"; // Import Chart component from react-google-charts
import http_request from "../../../http-request"
import { ReactLoader } from "../components/common/Loading";

const StatewisePendingComplaints = () => {
  const [statewiseData, setStatewiseData] = useState([]);
  const [locationwiseData, setLocationwiseData] = useState([]);
  const [loading, setLoading] = useState(false);

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
  }, []); // Empty dependency array to fetch data once on component mount

  const fetchAllComplaintData = async () => {
    try {
      setLoading(true)
      const response = await http_request.get("/getAllComplaint"); // Adjust the API path if needed
      let { data } = response;
      // setLocationwiseData(data);
      setLoading(false)
    } catch (error) {
      setLoading(false)

      console.error("Error fetching data:", error);
    }
  };
// console.log("locationwiseData",locationwiseData)
  // Prepare the data for the Pie Chart (converting statewiseData into the correct format)
  const chartData = [
    ["State", "Pending Complaints"],
    ...statewiseData?.map(item => [item._id, item.count]),
  ];

  // Options for the Pie Chart
  const options = {
    title: "State-wise Pending Complaints",
    is3D: true,
    slices: {
      0: { offset: 0.1 },
      1: { offset: 0.1 },
    },
    pieSliceText: "value",
  };

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
const complaints=locationwiseData
const states = [...new Set(complaints.map((c) => c.state))];

// Extract unique cities based on selected state
const cities = state ? [...new Set(complaints.filter((c) => c.state === state).map((c) => c.district))] : [];

// Filter complaints based on selected values
const filteredComplaints = complaints.filter((complaint) => {
  const complaintDate = new Date(complaint.createdAt);
  return (
    (state ? complaint.state === state : true) &&
    (city ? complaint.district === city : true) &&
    (startDate ? complaintDate >= new Date(startDate) : true) &&
    (endDate ? complaintDate <= new Date(endDate) : true)
  );
});

console.log("filteredComplaints",filteredComplaints);

// Generate chart data
const generateChartData = () => {
  const dataMap = new Map();
  filteredComplaints.forEach((complaint) => {
    const key = state ? city || complaint.district : complaint.state; // Show city if state is selected, otherwise show states
    dataMap.set(key, (dataMap.get(key) || 0) + 1);
  });

  return [["Location", "Complaints"], ...Array.from(dataMap.entries())];
};

const chartDataLoc = generateChartData();

const optionsLoc = {
  title: "Complaints Distribution",
  is3D: true,
    slices: {
      0: { offset: 0.1 },
      1: { offset: 0.1 },
    },
    pieSliceText: "value",
};

// console.log("stateCounts",stateCounts);

  return (
    <>
   <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filter Complaints</h2>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* State Dropdown */}
        <select value={state} onChange={(e) => { setState(e.target.value); setCity(""); }} className="border p-2 rounded w-full">
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City Dropdown (Filtered Based on Selected State) */}
        <select value={city} onChange={(e) => setCity(e.target.value)} className="border p-2 rounded w-full" disabled={!state}>
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded w-full" />

        {/* End Date */}
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded w-full" />
      </div>

      {/* Chart Display */}
      {chartData.length > 1 ? (
        <Chart chartType="PieChart" width="100%" height="400px" data={chartDataLoc} options={optionsLoc} />
      ) : (
        <p className="text-gray-600 text-center mt-4">No complaints found for the selected filters.</p>
      )}
    </div>
   {loading? <div className="h-[400px] flex justify-center items-center"> <ReactLoader /></div>
  
      :<div>
        {/* <h2 className="text-lg mb-2">Analytics</h2> */}

        {/* Pie Chart Section */}
        <div className="grid grid-cols-12 gap-4 mb-8">
          <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
            <h3 className="text-xl mb-4">Statewise Pending Complaints</h3>
            {statewiseData.length > 0 ? (
              <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={chartData}  // Pass the formatted chart data here
                options={options} // Pass the chart options here
              />
            ) : (
              <p>No data available.</p>
            )}
          </div>
        </div>

        {/* Statewise Pending Complaints Data (optional table or detailed list) */}
        <div className="grid grid-cols-12 gap-4">
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
        </div>
      </div>
}
      </>
  );
};

export default StatewisePendingComplaints;
