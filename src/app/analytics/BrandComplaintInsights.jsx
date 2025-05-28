import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts"; // Import Chart component from react-google-charts
import http_request from "../../../http-request"; // HTTP request utility to fetch data
import { ReactLoader } from "../components/common/Loading";

const BrandComplaintInsights = () => {
  const [complaintInsights, setComplaintInsights] = useState({
    complaintsByBrand: [],
    complaintsByLocationAndProduct: [],
    commonFaults: [],
    pendingComplaintsByBrand: [],
    complaintsByStateAndDistrict: []
  });
  const [filterBrand, setFilterBrand] = useState(""); // State to manage the selected brand
  const [loading, setLoading] = useState(true); // State to track data loading


  const [activeTab, setActiveTab] = useState('brandALLData');
  const bgColorsBrandALLData = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-teal-100',
  ];
  const bgColorsBrand = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100', 'bg-indigo-100', 'bg-teal-100',
  ];
  const bgColorsProduct = [
    'bg-rose-100', 'bg-emerald-100', 'bg-cyan-100', 'bg-orange-100', 'bg-sky-100', 'bg-fuchsia-100', 'bg-lime-100',
  ];
  const bgColorsCommon = [
    'bg-yellow-100', 'bg-red-100', 'bg-green-100', 'bg-blue-100', 'bg-indigo-100', 'bg-teal-100', 'bg-purple-100',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await http_request.get("/getComplaintInsights"); // Adjust the API endpoint as needed
        let { complaintsByBrand, complaintsByLocationAndProduct, pendingComplaintsByBrand, commonFaults, complaintsByStateAndDistrict } = response.data;


        setComplaintInsights({
          complaintsByBrand,
          complaintsByLocationAndProduct,
          pendingComplaintsByBrand,
          commonFaults,
          complaintsByStateAndDistrict
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to only run the effect once on mount

  // console.log(complaintInsights);
  // console.log(filterBrand);

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
  const prepareChartDataByState = (data) => {
    const stateCounts = {};

    data.forEach(item => {
      const state = item._id.state || 'Unknown';
      if (stateCounts[state]) {
        stateCounts[state] += item.count;
      } else {
        stateCounts[state] = item.count;
      }
    });

    // chartData must be defined and returned here:
    const chartData = [
      ['State', 'Complaints'],
      ...Object.entries(stateCounts)
    ];

    return chartData;
  };

const prepareChartDataByDistrict = (data) => {
  const districtCounts = {};

  data.forEach(item => {
    const district = item._id.district || 'Unknown';
    if (districtCounts[district]) {
      districtCounts[district] += item.count;
    } else {
      districtCounts[district] = item.count;
    }
  });

  const chartData = [
    ['District', 'Complaints'],
    ...Object.entries(districtCounts)
  ];

  return chartData;
};


  // Chart options
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
  const filteredPendingComplaintsByBrand = filterBrand
    ? complaintInsights.pendingComplaintsByBrand.filter(
      (item) => item._id.toLowerCase() === filterBrand.toLowerCase()
    )
    : complaintInsights.pendingComplaintsByBrand;

  const filteredCommonFaults = filterBrand
    ? complaintInsights.commonFaults.filter(
      (item) => item?.productBrand?.toLowerCase() === filterBrand.toLowerCase()
    )
    : complaintInsights.commonFaults;
  const filteredCommonDataFaults = filterBrand
    ? complaintInsights?.complaintsByStateAndDistrict.filter(
      (item) =>
        item?.productBrand?.toLowerCase() === filterBrand.toLowerCase()
    )
    : complaintInsights?.complaintsByStateAndDistrict;


  if (loading) {
    return <div className="h-[400px] flex justify-center items-center"> <ReactLoader /></div>


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
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Complaints by Brand</h3>
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
        {/* Complaints by State Pie Chart */}
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-xl mb-4">Complaints by State</h3>

          {filteredCommonDataFaults?.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartDataByState(filteredCommonDataFaults)}
              options={{
                title: "Complaints Distribution by State",
                is3D: true,
                pieSliceText: "value",
              }}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>
        <div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white ">
          <h3 className="text-xl mb-4">Complaints by District</h3>
          {filteredCommonDataFaults?.length > 0 ? (
            <Chart
              chartType="PieChart"
              width="100%"
              height="400px"
              data={prepareChartDataByDistrict(filteredCommonDataFaults)}
              options={{
                title: "Complaints Distribution by District",
                is3D: true,
                pieSliceText: "value",
              }}
            />
          ) : (
            <p>No data available.</p>
          )}
        </div>

      </div>

      <div>
        {/* Tabs Navigation */}
        <div className="flex space-x-4 mb-6 bg-[#09090b] p-2 rounded-lg">
          <button
            onClick={() => setActiveTab('brandALLData')}
            className={`px-4 py-2 rounded ${activeTab === 'brandALLData'
              ? 'bg-white text-[#09090b] shadow-lg hover:shadow-2xl transition-shadow duration-300'
              : 'bg-[#09090b] border border-white text-[#fafafa] hover:bg-gray-800'
              } font-semibold`}
          >
            Brand All Data
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2 rounded ${activeTab === 'brand'
              ? 'bg-white text-[#09090b] shadow-lg hover:shadow-2xl transition-shadow duration-300'
              : 'bg-[#09090b] border border-white text-[#fafafa] hover:bg-gray-800'
              } font-semibold`}
          >
            Complaints by Brand
          </button>

          <button
            onClick={() => setActiveTab('product')}
            className={`px-4 py-2 rounded ${activeTab === 'product'
              ? 'bg-white text-[#09090b] shadow-lg hover:shadow-2xl transition-shadow duration-300'
              : 'bg-[#09090b] border border-white text-[#fafafa] hover:bg-gray-800'
              } font-semibold`}
          >
            Complaints by Product
          </button>

          <button
            onClick={() => setActiveTab('common')}
            className={`px-4 py-2 rounded ${activeTab === 'common'
              ? 'bg-white text-[#09090b] shadow-lg hover:shadow-2xl transition-shadow duration-300'
              : 'bg-[#09090b] border border-white text-[#fafafa] hover:bg-gray-800'
              } font-semibold`}
          >
            Common Faults
          </button>
        </div>


        {/* Tab Content */}

        {activeTab === 'brandALLData' && (<div className="col-span-1 rounded-lg shadow px-4 py-4 bg-white">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Common Faults (Detailed)</h3>
          {filteredCommonDataFaults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommonDataFaults.map((item, index) => {
                const bgColor = bgColorsCommon[index % bgColorsCommon.length];
                return (
                  <div
                    key={index}
                    className={`rounded-xl shadow-md p-4 ${bgColor} hover:shadow-lg transition-shadow duration-300`}
                  >
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between font-semibold">
                        <div>Issue</div>
                        <div className="truncate">{item._id.issue}</div>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <div className="truncate">{item._id.state}</div>
                        <div className="truncate">{item._id.district}</div>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <div className="truncate">{item._id.productBrand}</div>
                        <div className="truncate">{item._id.productName}</div>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <div>Count</div>
                        <div className="truncate">{item.count}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>
        )}

        {activeTab === 'brand' && (
          <div className="rounded-lg shadow px-4 py-4 bg-white">
            <h3 className="text-md font-semibold mb-4 text-gray-800">Detailed Complaints by Brand</h3>
            {filteredComplaintsByBrand.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {filteredComplaintsByBrand.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-xl shadow-md p-4 ${bgColorsBrand[index % bgColorsBrand.length]} hover:shadow-lg transition-shadow duration-300`}
                  >
                    <h4 className="text-md font-bold truncate text-gray-700">{item._id}</h4>
                    <p className="text-sm text-gray-600">
                      Complaints: <span className="font-semibold">{item.count}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data available.</p>
            )}
          </div>
        )}

        {activeTab === 'product' && (
          <div className="rounded-lg shadow px-4 py-4 bg-white">
            <h3 className="text-md font-semibold mb-4 text-gray-800">Detailed Complaints by Product</h3>
            {filteredComplaintsByLocationAndProduct.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {filteredComplaintsByLocationAndProduct.map((item, index) => (
                  <div
                    key={index}
                    className={`rounded-xl shadow-md p-4 ${bgColorsProduct[index % bgColorsProduct.length]} hover:shadow-lg transition-shadow duration-300`}
                  >
                    <h4 className="text-md font-bold truncate text-gray-700">{item._id.product}</h4>
                    <p className="text-sm text-gray-600">
                      Complaints: <span className="font-semibold">{item.count}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data available.</p>
            )}
          </div>
        )}

        {activeTab === 'common' && (
          <>
            <div className="rounded-lg shadow px-4 py-4 bg-white mb-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Common Faults</h3>
              {filteredCommonFaults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {filteredCommonFaults.map((item, index) => (
                    <div
                      key={index}
                      className={`rounded-xl shadow-md p-4 ${bgColorsCommon[index % bgColorsCommon.length]} hover:shadow-lg transition-shadow duration-300`}
                    >
                      <h4 className="text-md font-bold text-gray-700 truncate">{item._id}</h4>
                      <p className="text-sm text-gray-600">
                        Count: <span className="font-semibold">{item.count}</span>
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No data available.</p>
              )}
            </div>


          </>
        )}
      </div>


    </div >
  );
};

export default BrandComplaintInsights;
