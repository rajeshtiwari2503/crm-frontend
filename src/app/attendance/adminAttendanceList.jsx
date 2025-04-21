 'use client';
import { useEffect, useState } from 'react';
import http_request from "../../../http-request";

const AdminAttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('month', selectedMonth);
        if (selectedDate) queryParams.append('date', selectedDate);

        const res = await http_request.get(`/attendance/getMonthlyAttendance?${queryParams.toString()}`);
        const datav = res?.data?.map((item, index) => ({ ...item, i: index + 1 }));
        // setRecords(datav);
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      }
    };

    fetchData();
  }, [selectedMonth ]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await http_request.get(`/attendance/getDailyAttendance?date=${selectedDate}`);
        const datav=res?.data?.map((item,index)=>({ ...item ,i:index + 1}));
        setRecords(datav);
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
      }
    };
    if (selectedDate) fetchData();
  }, [selectedDate]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">📊 Attendance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date (Optional)</label>
         
           <input
           type="date"
           value={selectedDate}
           onChange={(e) => setSelectedDate(e.target.value)}
           className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"

         />
        
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sr. No.</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock In</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock Out</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Breaks</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Hours</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {records.map((rec) => (
              <tr key={rec._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{rec.i}</td>
                <td className="px-4 py-2">{rec.user || 'Unknown'}</td>
                <td className="px-4 py-2">{rec.clockIn ? new Date(rec.clockIn).toLocaleString() : '-'}</td>
                <td className="px-4 py-2">{rec.clockOut ? new Date(rec.clockOut).toLocaleString() : '-'}</td>
                <td className="px-4 py-2">
                  {rec.breaks?.length > 0
                    ? rec.breaks.map((b, index) => (
                        <div key={index}>
                          {new Date(b.breakIn).toLocaleTimeString()} - {new Date(b.breakOut).toLocaleTimeString()}
                        </div>
                      ))
                    : '-'}
                </td>
                <td className="px-4 py-2">{rec.totalHours || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAttendanceList;
