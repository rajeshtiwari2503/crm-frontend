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
      const res = await http_request.get(`/wallet-payment-summary?month=06&year=2025&sortBy=high` );
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Service Center</th>
                <th className="p-2">Type</th>
                <th className="p-2">Total Payment</th>
                <th className="p-2">Unpaid Complaints</th>
              </tr>
            </thead>
            <tbody>
              {summary.length > 0 ? (
                summary.map((item, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.type}</td>
                    <td className="p-2">₹{item.totalAmount}</td>
                    <td className="p-2">{item.unpaidCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-2 text-center text-gray-500">No data found</td>
                </tr>
              )}
            </tbody>
          </table>
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
