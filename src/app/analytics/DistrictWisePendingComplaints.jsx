 "use client";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import http_request from "../../../http-request";

const DistrictWisePendingComplaints = () => {
  const [complaintsData, setComplaintsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await http_request.get("/getDistrictWisePendingComplaints");
        const { data } = response;
        setComplaintsData(data);
        setFilteredData(data); // Initialize filtered data with the complete dataset
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Prepare the data for the Pie Chart (converting filteredData into the correct format)
  const chartData = [
    ["District", "Pending Complaints"],
    ...filteredData.map((item) => [item.district, item.count]),
  ];

  // Options for the Pie Chart
  const options = {
    title: `Pending Complaints in ${selectedState || "All States"}`,
    is3D: true,
    slices: {
      0: { offset: 0.1 },
      1: { offset: 0.1 },
    },
    pieSliceText: "percentage",
  };

  // Handle state selection change
  const handleStateChange = (event) => {
    const selected = event.target.value;
    setSelectedState(selected);

    if (selected === "") {
      // Show all data if no state is selected
      setFilteredData(complaintsData);
    } else {
      // Filter data for the selected state
      const filtered = complaintsData.filter((item) => item.state === selected);
      setFilteredData(filtered);
    }
  };

  // Get unique states for the dropdown
  const uniqueStates = Array.from(new Set(complaintsData.map((item) => item.state)));

  return (
    <div>
      <div className="mb-4">
        {/* Dropdown to filter by state */}
        <label htmlFor="stateFilter" className="block mb-2 text-lg font-medium">
          Filter by State:
        </label>
        <select
          id="stateFilter"
          className="border border-gray-300 rounded p-2"
          value={selectedState}
          onChange={handleStateChange}
        >
          <option value="">All States</option>
          {uniqueStates.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Pie Chart Section */}
      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">District-wise Pending Complaints</h3>
          {filteredData.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={chartData} // Pass the formatted chart data here
              options={options} // Pass the chart options here
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>

      {/* Filtered Data Table */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">
            Detailed Pending Complaints for {selectedState || "All States"}
          </h3>
          {filteredData.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">State</th>
                  <th className="px-4 py-2">District</th>
                  <th className="px-4 py-2">Pending Complaints</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{item.state}</td>
                    <td className="border px-4 py-2">{item.district}</td>
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
  );
};

export default DistrictWisePendingComplaints;
