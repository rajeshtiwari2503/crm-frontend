 "use client";
import React, { useState, useEffect } from "react";
import Sidenav from "../components/Sidenav";
import { Chart } from "react-google-charts"; // Import Chart component from react-google-charts
import http_request from "../../../http-request"

const StatewisePendingComplaints = () => {
  const [statewiseData, setStatewiseData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await http_request.get("/getStatewisePendingComplaints"); // Adjust the API path if needed
        let { data } = response;
        setStatewiseData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data once on component mount

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

  return (
   
      <div>
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
   
  );
};

export default StatewisePendingComplaints;
