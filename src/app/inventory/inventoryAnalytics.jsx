import { useEffect, useState } from 'react';

import { Chart } from 'react-google-charts';

import http_request from "../../../http-request"
import { ReactLoader } from '../components/common/Loading';

export default function AnalyticsDashboard() {
    const [data, setData] = useState(null);

    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true); // Start loading
                const response = await http_request.get('/getAllServiceCenterOrdersAndDepositsAnalytics');
                setData(response.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center ">
                <ReactLoader />
            </div>
        );
    }

    if (!data || !data.serviceCenters?.length) {
        return (
            <div className="text-center text-gray-500 mt-10">
                No analytics data available.
            </div>
        );
    }
    const pieChartData = [
        ['Status', 'Count'],
        ['Approved', data.approvedOrderCountAll],
        ['Not Approved', data.notApprovedOrderCountAll],
        ['Canceled', data.canceledOrderCountAll],
    ];

    const pieChartOptions = {
        title: 'Order Status Distribution',
        is3D: true,
        colors: ['#22c55e', '#facc15', '#ef4444'],
        pieSliceText: 'value'
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
        <div className="p-6 space-y-4   ">
            <h1 className="md:text-3xl text-xl font-bold text-gray-800">Service Center Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center">
                {/* Left: Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-center  ">


                  
                    {/* Summary Card 2 */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-600">Total Order Value</h2>
                        <p className="text-xl font-bold text-gray-900">₹{data.totalOrderPriceAll.toLocaleString()}</p>
                    </div>

                    {/* Summary Card 3 */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-600">Total Deposits</h2>
                        <p className="text-xl font-bold text-gray-900">₹{data.totalDepositAll.toLocaleString()}</p>
                    </div>

                    

                    {/* Summary Card 5 */}
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-600">Approved Orders</h2>
                        <p className="text-xl font-bold text-gray-900">{data.approvedOrderCountAll}</p>
                    </div>

                    {/* Summary Card 6 */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-600">Not Approved</h2>
                        <p className="text-xl font-bold text-gray-900">{data.notApprovedOrderCountAll}</p>
                    </div>

                    {/* Summary Card 7 */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-600">Canceled Orders</h2>
                        <p className="text-xl font-bold text-gray-900">{data.canceledOrderCountAll}</p>
                    </div>
                      {/* Summary Card 1 */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 shadow rounded-lg p-6">
                        <h2 className="text-sm font-medium text-gray-600">Total Orders</h2>
                        <p className="text-xl font-bold text-gray-900">{data.totalOrdersAll}</p>
                    </div>

                </div>
                {/* Right: Google Pie Chart */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Order Status Overview</h2>
                    <Chart
                        chartType="PieChart"
                        data={pieChartData}
                        options={pieChartOptions}
                        width={'100%'}
                        height={'250px'}
                    />
                </div>
            </div>

            <div className="">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {[...data.serviceCenters]
                        .sort((a, b) => b.totalOrderPrice - a.totalOrderPrice)
                        .map((center) => {
                            const isDepositGreater = center.totalDeposit > center.totalOrderPrice;

                            return (
                                <div
                                    key={center.serviceCenterId}
                                    className={`text-gray-800 rounded-xl shadow p-4 transition-transform transform hover:scale-105
              ${isDepositGreater
                                            ? 'bg-gradient-to-br from-green-100 to-green-600'
                                            : 'bg-gradient-to-br from-red-100 to-red-600'
                                        }`}
                                >
                                    {/* Service Center Name */}
                                    <h2 className="text-lg font-semibold truncate capitalize" title={center.serviceCenterName}>
                                        {center.serviceCenterName}
                                    </h2>

                                    <div className="mt-2 space-y-1 text-sm">
                                        <div className="flex  justify-between">
                                            <span>Total Orders:</span>
                                            <span className="font-medium">{center.totalOrders}</span>
                                        </div>
                                        <div className="flex justify-between ">
                                            <span className="flex justify-between text-green-600">Approved:</span>
                                            <span className="font-bold">{center.approvedOrderCount}</span>
                                        </div>
                                        <div className="flex justify-between ">
                                            <span className='text-yellow-600'>Not Approved:</span>
                                            <span className=" font-bold">{center.notApprovedOrderCount}</span>
                                        </div>
                                        <div className="flex justify-between text-red-600">
                                            <span>Canceled:</span>
                                            <span className="font-bold">{center.canceledOrderCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Order Value:</span>
                                            <span className="font-medium">₹{center.totalOrderPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Deposits:</span>
                                            <span className="font-medium">₹{center.totalDeposit.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>


        </div>
    );
}
