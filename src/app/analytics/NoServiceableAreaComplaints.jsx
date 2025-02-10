"use client";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import http_request from "../../../http-request";
import { ReactLoader } from "../components/common/Loading";

const NoServiceableAreaComplaints = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await http_request.get("/getNoServiceableAreaComplaints");
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle State Filter
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    filterData(state, startDate, endDate);
  };

  // Handle Date Range Filter (if applicable)
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    filterData(selectedState, start, end);
  };

  // Filter Data
  const filterData = (state, start, end) => {
    let filtered = data;

    if (state) {
      filtered = filtered.filter((item) => item.state === state);
    }

    if (start && end) {
      // Assuming there's a `createdAt` field in the response
      filtered = filtered.filter(
        (item) =>
          new Date(item.createdAt) >= new Date(start) &&
          new Date(item.createdAt) <= new Date(end)
      );
    }

    setFilteredData(filtered);
  };

  // Prepare data for chart
  const chartData = [
    ["State", "Number of Complaints"],
    ...Object.entries(
      filteredData.reduce((acc, item) => {
        acc[item.state] = (acc[item.state] || 0) + 1;
        return acc;
      }, {})
    ).map(([state, count]) => [state, count]),
  ];

  // Chart Options
  const chartOptions = {
    title: "State-wise Complaints",
    is3D: true,
    pieSliceText: "value",
  };

  // Unique States for Dropdown
  const uniqueStates = Array.from(new Set(data.map((item) => item.state)));

  return (
    <>
      {loading ? <div className="h-[400px] flex justify-center items-center"> <ReactLoader /></div>

        :
        <div className="min-h-screen bg-gray-100 p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Complaints Dashboard</h1>

          {/* Filter Section */}
          <div className="mb-6 bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* State Filter */}
              <div>
                <label htmlFor="state-select" className="block text-sm font-medium mb-2">
                  Filter by State
                </label>
                <select
                  id="state-select"
                  value={selectedState}
                  onChange={handleStateChange}
                  className="p-2 border rounded w-full"
                >
                  <option value="">All States</option>
                  {uniqueStates.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              {/* <div>
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <div className="flex space-x-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => handleDateChange(date, endDate)}
                placeholderText="Start Date"
                className="p-2 border rounded w-full"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => handleDateChange(startDate, date)}
                placeholderText="End Date"
                className="p-2 border rounded w-full"
              />
            </div>
          </div> */}
            </div>
          </div>

          {/* Visualization Section */}
          <div className="mb-6 bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">State-wise Complaints</h2>
            {loading ? (
              <p>Loading...</p>
            ) : filteredData.length > 0 ? (
              <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={chartData}
                options={chartOptions}
              />
            ) : (
              <p>No data available for the selected filters.</p>
            )}
          </div>

          {/* Data Table Section */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Detailed Complaints Data</h2>
            {loading ? (
              <p>Loading...</p>
            ) : filteredData.length > 0 ? (
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">User Name</th>
                    <th className="border px-4 py-2">Phone Number</th>
                    <th className="border px-4 py-2">District</th>
                    <th className="border px-4 py-2">State</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{item.userName}</td>
                      <td className="border px-4 py-2">{item.phoneNumber}</td>
                      <td className="border px-4 py-2">{item.district}</td>
                      <td className="border px-4 py-2">{item.state}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data available for the selected filters.</p>
            )}
          </div>
        </div>
      }
    </>
  );
};

export default NoServiceableAreaComplaints;
