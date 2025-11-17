"use client";
import React, { useState, useEffect } from "react";
import Sidenav from "../components/Sidenav";
import { Chart } from "react-google-charts"; // Import Chart component from react-google-charts
import http_request from "../../../http-request"
import { ReactLoader } from "../components/common/Loading";
import { Business, ReportProblem } from "@mui/icons-material";

const ServiceCenterWisePendingComplaints = () => {
  const [statewiseData, setStatewiseData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await http_request.get("/getServiceCenterWisePendingComplaints"); // Adjust the API path if needed
        let { data } = response;
        setStatewiseData(data);
        setLoading(false)
      } catch (error) {
        setLoading(false)
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
      {loading ? <div className="h-[400px] flex justify-center items-center"> <ReactLoader /></div>

        : <div>
          {/* <h2 className="text-lg mb-2">Analytics</h2> */}

          {/* Pie Chart Section */}
          <div className="grid grid-cols-12 gap-4 mb-8">
            <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
              <h3 className="text-xl mb-4">Service Center Pending Complaints</h3>
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
          {/* <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
            <h3 className="text-xl mb-4">Detailed Pending Complaints by State</h3>
            {statewiseData.length > 0 ? (
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Service Center</th>
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
        </div> */}



          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {statewiseData.map((item, index) => (
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
                  <span className="text-sm font-semibold text-red-600">{item.count} Pending </span>
                </div>
              </div>
            ))}
          </div>




        </div>
      }
    </>
  );
};

export default ServiceCenterWisePendingComplaints;
