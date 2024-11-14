import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts"; // Import Chart component from react-google-charts
import http_request from "../../../http-request";

const BrandComplaintInsights = () => {
  const [complaintInsights, setComplaintInsights] = useState({
    complaintsByBrand: [],
    complaintsByLocationAndProduct: [],
    commonFaults: []
  });

  useEffect(() => {
    // Fetch data from the backend API
    const fetchData = async () => {
      try {
        const response = await http_request.get("/getComplaintInsights");
        let { complaintsByBrand, complaintsByLocationAndProduct, commonFaults } = response.data;

        // Setting the response data to the state
        setComplaintInsights({
          complaintsByBrand,
          complaintsByLocationAndProduct,
          commonFaults
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data once on component mount

  // Prepare the data for each of the Pie Charts
  const prepareChartData = (data) => {
    return [
      ["Category", "Count"],
      ...data.map((item) => {
        const category = item._id.product || item._id; // Access product if _id is an object
        return [category, item.count];
      }),
    ];
  };

  // Chart options
  const chartOptions = {
    title: "Pending Complaints",
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0.1 } },
    pieSliceText: "percentage",
  };

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 mb-8">
        {/* Complaints by Brand Pie Chart */}
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Complaints by Brand</h3>
          {complaintInsights.complaintsByBrand.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartData(complaintInsights.complaintsByBrand)}
              options={chartOptions}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Complaints by Location and Product Pie Chart */}
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Complaints by   Product</h3>
          {complaintInsights.complaintsByLocationAndProduct.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartData(complaintInsights.complaintsByLocationAndProduct)}
              options={chartOptions}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Common Faults Pie Chart */}
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Common Faults</h3>
          {complaintInsights.commonFaults.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartData(complaintInsights.commonFaults)}
              options={chartOptions}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>

      {/* Detailed Data Tables */}
      <div className="grid grid-cols-12 gap-4">
        {/* Complaints by Brand Data Table */}
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Detailed Complaints by Brand</h3>
          {complaintInsights.complaintsByBrand.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">Pending Complaints</th>
                </tr>
              </thead>
              <tbody>
                {complaintInsights.complaintsByBrand.map((item, index) => (
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

        {/* Complaints by Location and Product Data Table */}
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Detailed Complaints by   Product</h3>
          {complaintInsights.complaintsByLocationAndProduct.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Pending Complaints</th>
                </tr>
              </thead>
              <tbody>
                {complaintInsights.complaintsByLocationAndProduct.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{item._id.product}</td>
                    <td className="border px-4 py-2">{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Common Faults Data Table */}
        <div className="col-span-12 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Common Faults</h3>
          {complaintInsights.commonFaults.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Fault Type</th>
                  <th className="px-4 py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {complaintInsights.commonFaults.map((item, index) => (
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

export default BrandComplaintInsights;
