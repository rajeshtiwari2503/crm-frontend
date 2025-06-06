// components/WalletPaymentSummary.jsx
import React, { useState, useEffect } from 'react';

import http_request from "../../../http-request"

const WalletPaymentSummary = () => {
  const [summary, setSummary] = useState([]);
  const [tatReport, setTatReport] = useState({});
  const [month, setMonth] = useState('06');
  const [year, setYear] = useState('2025');
  const [sortBy, setSortBy] = useState('high');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
   const res = await http_request.get(
  `/wallet-payment-summary?month=${month}&year=${year}&sortBy=${sortBy}`
);

      setSummary(res.data.summary);
      setTatReport(res.data.tatReport);
    } catch (err) {
      console.error("API error", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [month, year, sortBy]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Wallet Payment Summary</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded">
          {[...Array(12).keys()].map(m => (
            <option key={m + 1} value={String(m + 1).padStart(2, '0')}>
              {new Date(0, m).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border p-2 rounded"
          placeholder="Year"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="high">High Payment</option>
          <option value="low">Low Payment</option>
          <option value="alpha">A-Z</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
     <div className="p-4 max-w-7xl mx-auto">
      <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {summary.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6
            hover:shadow-lg hover:scale-[1.03] transition-transform duration-300 ease-in-out
            flex flex-col justify-between"
            style={{ minHeight: "320px" }}
          >
            {/* Name */}
            <h2
              className="text-xl font-semibold text-gray-900 mb-4 truncate"
              title={item.name}
            >
              {item.name}
            </h2>

            {/* Summary Info */}
            <div className="mb-6 text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Total Complaints:</span>
                <span>{item.totalComplaints}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Payment:</span>
                <span className="text-green-600 font-semibold">₹{item.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Average Cost:</span>
                <span>₹{Math.round(item.averagePaymentPerComplaint)}</span>
              </div>
            </div>

            {/* Paid / Unpaid Summary */}
            <div className="grid grid-cols-2 gap-4 text-center mb-4">
              <div className="bg-red-50 rounded-md p-3 border border-red-200">
                <p className="text-sm font-semibold text-red-800">Unpaid Complaints</p>
                <p className="text-2xl font-bold text-red-900">{item.unpaidCount}</p>
                <p className="text-xs text-red-700">{item.percentageUnpaid}% Unpaid</p>
              </div>
              <div className="bg-green-50 rounded-md p-3 border border-green-200">
                <p className="text-sm font-semibold text-green-800">Paid Complaints</p>
                <p className="text-2xl font-bold text-green-900">{item.paidCount}</p>
                <p className="text-xs text-green-700">{item.percentagePaid}% Paid</p>
              </div>
            </div>

            {/* TAT Report */}
            <div className="text-sm text-gray-600 border-t border-gray-200 pt-3 space-y-1">
              <p className="font-semibold text-gray-800">TAT Report (days)</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(item.tatReport).map(([range, value]) => (
                  value !== null && (
                    <div key={range} className="flex justify-between">
                      <span>{range}</span>
                      <span>{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>


      )}

      {/* TAT Report */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">TAT Report</h2>
        <ul className="list-disc ml-5">
          {tatReport && Object.keys(tatReport).map(key => (
            <li key={key}>{key} Days: {tatReport[key]}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WalletPaymentSummary;
