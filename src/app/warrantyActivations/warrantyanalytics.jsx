"use client";

import React, { useEffect, useState } from "react";
import http_request from '.././../../http-request';
import { Chart } from "react-google-charts";
import { ReactLoader } from "../components/common/Loading";

export default function WarrantyAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch analytics data (initially without brand filter)
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true); // start loader
                const url = selectedBrand
                    ? `/warranty-analyticsByBrand?brand=${encodeURIComponent(selectedBrand)}`
                    : "/warranty-analytics";

                const response = await http_request.get(url);
                setAnalytics(response.data);

                if (!selectedBrand) {
                    const uniqueBrands = [
                        ...new Set(response.data.groupedAnalytics.map(item => item._id.brandName).filter(Boolean))
                    ];
                    setBrands(uniqueBrands);
                }

                setTimeout(() => setLoading(false), 400); // slight delay to improve UI smoothness
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [selectedBrand]);


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <ReactLoader />
            </div>
        );
    }


    // Prepare brand-wise totals for Pie Chart (filtered brand or all brands)
  // Always group by brand for pie chart
const brandTotals = analytics.groupedAnalytics.reduce((acc, item) => {
  const brand = item._id.brandName || "Unknown Brand";
  acc[brand] = (acc[brand] || 0) + item.count;
  return acc;
}, {});

const pieChartData = [
  ["Brand", "Activated Count"],
  ...Object.entries(brandTotals),
];



 

    return (
        <div className="max-w-7xl mx-auto px-4  ">
             <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <h2 className="text-2xl font-bold   text-center text-gray-900 tracking-tight">
                📈 Warranty Activation Analytics
            </h2>

              <div className="flex justify-center mb-5 mt-5">
                <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-sm flex items-center space-x-4">
                    <label htmlFor="brand-select" className="text-gray-700 font-medium">
                        Filter by Brand:
                    </label>
                    <select
                        id="brand-select"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Brands</option>
                        {brands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            </div>
                {/* Summary Cards */}

                <div className=" grid grid-cols-1 md:grid-cols-4   gap-4">
                    <SummaryCard title="Today Activated" count={analytics.todayActivated} color="bg-indigo-500" />
                    <SummaryCard title="This Week Activated" count={analytics.weekActivated} color="bg-emerald-500" />
                    <SummaryCard title="This Month Activated" count={analytics.monthActivated} color="bg-purple-500" />
                    <SummaryCard title="This Year Activated" count={analytics.yearActivated} color="bg-orange-500" />

                </div>

             
          




            {/* Pie Chart: Brand Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6  bg-white p-6 rounded-xl shadow-lg mb-10 transition-all duration-300 hover:shadow-2xl">
                {/* Pie Chart: Brand Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-lg   transition-all duration-300 hover:shadow-2xl">
                    <h3 className="text-md font-semibold mb-4 text-gray-800">Brand-wise Warranty Activations</h3>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={pieChartData}
                        options={{
                            is3D: true,
                            pieSliceText: "value",
                            chartArea: { width: "90%", height: "85%" },
                            legend: { position: "bottom" },
                        }}
                    />
                </div>

                {/* Pie Chart: State-wise Activations */}
                <div className="bg-white p-6 rounded-xl shadow-lg   transition-all duration-300 hover:shadow-2xl">
                    <h3 className="text-md font-semibold mb-4 text-gray-800">State-wise Warranty Activations</h3>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={[
                            ["State", "Activated Count"],
                            ...Object.entries(
                                analytics.groupedAnalytics.reduce((acc, item) => {
                                    const key = item._id.state || "Unknown";
                                    acc[key] = (acc[key] || 0) + item.count;
                                    return acc;
                                }, {})
                            ),
                        ]}
                        options={{
                            is3D: true,
                            pieSliceText: "value",
                            chartArea: { width: "90%", height: "85%" },
                            legend: { position: "bottom" },
                        }}
                    />
                </div>

                {/* Pie Chart: District-wise Activations */}
                <div className="bg-white p-6 rounded-xl shadow-lg mt-10 transition-all duration-300 hover:shadow-2xl">
                    <h3 className="text-md font-semibold mb-4 text-gray-800">District-wise Warranty Activations</h3>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={[
                            ["District", "Activated Count"],
                            ...Object.entries(
                                analytics.groupedAnalytics.reduce((acc, item) => {
                                    const key = item._id.district || "Unknown";
                                    acc[key] = (acc[key] || 0) + item.count;
                                    return acc;
                                }, {})
                            ),
                        ]}
                        options={{
                            is3D: true,
                            pieSliceText: "value",
                            chartArea: { width: "90%", height: "85%" },
                            legend: { position: "bottom" },
                        }}
                    />
                </div>

                {/* Pie Chart: Product-wise Activations */}
                <div className="bg-white p-6 rounded-xl shadow-lg mt-10 transition-all duration-300 hover:shadow-2xl">
                    <h3 className="text-md font-semibold mb-4 text-gray-800">Product-wise Warranty Activations</h3>
                    <Chart
                        chartType="PieChart"
                        width="100%"
                        height="400px"
                        data={[
                            ["Product", "Activated Count"],
                            ...Object.entries(
                                analytics.groupedAnalytics.reduce((acc, item) => {
                                    const key = item._id.productName || "Unknown";
                                    acc[key] = (acc[key] || 0) + item.count;
                                    return acc;
                                }, {})
                            ),
                        ]}
                        options={{
                            is3D: true,
                            pieSliceText: "value",
                            chartArea: { width: "90%", height: "85%" },
                            legend: { position: "bottom" },
                        }}
                    />
                </div>

            </div>


        </div>

    );
}

// Card component
function SummaryCard({ title, count, color }) {
    return (
        <div className={`rounded-lg shadow-lg px-6 py-2 my-2 text-white ${color} hover:scale-105 transition-transform duration-300`}>
            <p className="text-sm font-medium opacity-80 mb-2">{title}</p>
            <p className="text-xl font-bold">{count}</p>
        </div>
    );
}


// Helper function to assign colors
function getColor(index) {
    const colors = [
        "#4285F4", "#EA4335", "#FBBC05", "#34A853", "#9C27B0", "#00ACC1",
        "#F4511E", "#7CB342", "#F06292", "#5E35B1"
    ];
    return colors[index % colors.length];
}
