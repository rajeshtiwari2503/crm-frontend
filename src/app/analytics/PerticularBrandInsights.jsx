import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import http_request from "../../../http-request";

const PerticularBrandights = (props) => {
  const [complaintInsights, setComplaintInsights] = useState({
    complaintsByBrand: [],
    complaintsByLocationAndProduct: [],
    commonFaults: [],
    pendingComplaintsByBrand:[]
  });
  const [filterBrand, setFilterBrand] = useState(props?.user?.brandName);
  const [loading, setLoading] = useState(true);
//  console.log(props?.user?._id);
 
  useEffect(() => {
    if (props?.user?._id) {
      setFilterBrand(props.user.brandName);
    }
  }, [props.user]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await http_request.get("/getComplaintInsights");
        let { complaintsByBrand, pendingComplaintsByBrand,complaintsByLocationAndProduct, commonFaults } = response.data;

        setComplaintInsights({
          complaintsByBrand,
          complaintsByLocationAndProduct,
          commonFaults,
          pendingComplaintsByBrand,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const prepareChartData = (data) => {
    return [
      ["Category", "Count"],
      ...data.map((item) => {
        const category = item?._id?.product || item._id;
        return [category, item.count];
      }),
    ];
  };

  const chartOptions = {
    title: "All Complaints",
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0.1 } },
    pieSliceText: "value",
  };
  const chartOptionsPending = {
    title: "Pending Complaints",
    is3D: true,
    slices: { 0: { offset: 0.1 }, 1: { offset: 0.1 } },
    pieSliceText: "value",
  };
  const filteredComplaintsByBrand = filterBrand
    ? complaintInsights.complaintsByBrand.filter(
        (item) => item._id.toLowerCase() === filterBrand.toLowerCase()
      )
    : complaintInsights.complaintsByBrand;

  const filteredComplaintsByLocationAndProduct = filterBrand
    ? complaintInsights.complaintsByLocationAndProduct.filter(
        (item) => item?._id?.productBrand?.toLowerCase() === filterBrand.toLowerCase()
      )
    : complaintInsights.complaintsByLocationAndProduct;
    const filteredPendingComplaintsByBrand = filterBrand
    ? complaintInsights?.pendingComplaintsByBrand?.filter(
        (item) => item._id.toLowerCase() === filterBrand.toLowerCase()
      )
    : complaintInsights?.pendingComplaintsByBrand;
  const filteredCommonFaults = filterBrand
    ? complaintInsights.commonFaults.filter(
        (item) => item?.productBrand?.toLowerCase() === filterBrand.toLowerCase()
      )
    : complaintInsights.commonFaults;

  if (loading) {
    return <div>Loading...</div>;
  }
console.log("filteredComplaintsByBrand",filteredComplaintsByBrand);

  return (
    <div className="container mx-auto p-6">
      {/* Brand Filter */}
      <div className="mb-4">
        <button className="px-4 py-2 rounded bg-blue-700 text-white">
          Brand Complaint Stats
        </button>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
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
        </div> */}

      
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
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Pending Complaints</h3>
          {filteredPendingComplaintsByBrand.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartData(filteredPendingComplaintsByBrand)}
              options={chartOptionsPending}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
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

      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Detailed Complaints by Brand</h3>
          {filteredComplaintsByBrand.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Brand</th>
                  <th className="px-4 py-2">Complaints</th>
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

        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Detailed Complaints by Product</h3>
          {filteredComplaintsByLocationAndProduct.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Complaints</th>
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

      {/* Remaining UI */}
      {/* <div className="mt-8">
        <h3 className="text-2xl mb-4">Additional Insights</h3>
        <p className="text-gray-700">Add more charts, filters, or other UI components here.</p>
      </div> */}
    </div>
  );
};

export default PerticularBrandights;
