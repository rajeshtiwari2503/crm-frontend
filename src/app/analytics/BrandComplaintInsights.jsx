import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts"; // Import Chart component from react-google-charts
import http_request from "../../../http-request"; // HTTP request utility to fetch data

const BrandComplaintInsights = () => {
  const [complaintInsights, setComplaintInsights] = useState({
    complaintsByBrand: [],
    complaintsByLocationAndProduct: [],
    commonFaults: [],
  });
  const [filterBrand, setFilterBrand] = useState(""); // State to manage the selected brand
  const [loading, setLoading] = useState(true); // State to track data loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await http_request.get("/getComplaintInsights"); // Adjust the API endpoint as needed
        let { complaintsByBrand, complaintsByLocationAndProduct, commonFaults } = response.data;

        setComplaintInsights({
          complaintsByBrand,
          complaintsByLocationAndProduct,
          commonFaults,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to only run the effect once on mount

  console.log(complaintInsights);
  console.log(filterBrand);

  // Prepare the data for each of the Pie Charts
  const prepareChartData = (data) => {
    return [
      ["Category", "Count"],
      ...data.map((item) => {
        const category = item?._id?.product || item._id; // Ensure _id exists and handle the case when product is not present
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

  // Filter the complaints by brand if a filter is applied
  const filteredComplaintsByBrand = filterBrand
    ? complaintInsights.complaintsByBrand.filter(
        (item) => item._id.toLowerCase() === filterBrand.toLowerCase()
      )
    : complaintInsights.complaintsByBrand;

  // Apply filtering to complaintsByLocationAndProduct and commonFaults as well
  const filteredComplaintsByLocationAndProduct = filterBrand
    ? complaintInsights.complaintsByLocationAndProduct.filter(
        (item) => item?._id?.productBrand && item?._id?.productBrand.toLowerCase() === filterBrand.toLowerCase()
      )
    : complaintInsights.complaintsByLocationAndProduct;

  const filteredCommonFaults = filterBrand
    ? complaintInsights.commonFaults.filter(
        (item) => item?.productBrand?.toLowerCase() === filterBrand.toLowerCase()
      )
    : complaintInsights.commonFaults;

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while data is being fetched
  }

  return (
    <div className="container mx-auto p-6">
      {/* Brand Filter */}
      <div className="mb-4">
        <label htmlFor="brandFilter" className="block text-lg font-medium mb-2">
          Filter by Brand:
        </label>
        <select
          id="brandFilter"
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">All Brands</option>
          {complaintInsights.complaintsByBrand.map((item, index) => (
            <option key={index} value={item._id}>
              {item._id}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* Complaints by Brand Pie Chart */}
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Complaints by Brand</h3>
          {filteredComplaintsByBrand.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartData(filteredComplaintsByBrand)}
              options={chartOptions}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Complaints by Location and Product Pie Chart */}
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Complaints by Product</h3>
          {filteredComplaintsByLocationAndProduct.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartData(filteredComplaintsByLocationAndProduct)}
              options={chartOptions}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Common Faults Pie Chart */}
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Common Faults</h3>
          {filteredCommonFaults.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartData(filteredCommonFaults)}
              options={chartOptions}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
      </div>

      {/* Detailed Data Tables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Complaints by Brand Data Table */}
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Detailed Complaints by Brand</h3>
          {filteredComplaintsByBrand.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">  Complaints</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaintsByBrand.map((item, index) => (
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
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Detailed Complaints by Product</h3>
          {filteredComplaintsByLocationAndProduct.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">  Complaints</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaintsByLocationAndProduct.map((item, index) => (
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
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Common Faults</h3>
          {filteredCommonFaults.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Fault Type</th>
                  <th className="px-4 py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommonFaults.map((item, index) => (
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
