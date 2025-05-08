'use client';
import { useEffect, useState } from 'react';
import http_request from "../../../http-request";

const UserAttendanceList = ({ userId }) => {
  const [records, setRecords] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchDailyData = async (date) => {
    try {
      const res = await http_request.get(`/attendance/getDailyAttendanceByUserId?date=${date}&userId=${userId}`);
      const datav = res?.data?.map((item, index) => ({ ...item, i: index + 1 }));
      setRecords(datav);
    } catch (err) {
      console.error('Failed to fetch daily attendance:', err);
    }
  };

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7); // "YYYY-MM"
    setSelectedMonth(currentMonth);
  }, []);

  useEffect(() => {
    if (selectedMonth) fetchMonthlyData(selectedMonth);
  }, [selectedMonth]);

  const fetchMonthlyData = async (month) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('month', month);
      queryParams.append('userId', userId);

      const res = await http_request.get(`/attendance/getMonthlyAttendanceByUserId?${queryParams.toString()}`);
      const datav = res?.data?.map((item, index) => ({ ...item, i: index + 1 }));
      setMonthlyRecords(datav);
    } catch (err) {
      console.error('Failed to fetch monthly attendance:', err);
      setMonthlyRecords([]);
    }
  };

  // Fetch daily data initially
  useEffect(() => {
    if (selectedDate) fetchDailyData(selectedDate);
  }, [selectedDate]);

  // Fetch monthly data only when a month is selected


  //   console.log("monthlyRecords",monthlyRecords);

  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">📊 Attendance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Date  </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Daily Records Table */}
      {records.length > 0 && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">🗓 Daily Attendance</h2>
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden mb-10">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sr. No.</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock In</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock Out</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Breaks</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Task Comment</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Hours</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {records.map((rec) => (
                <tr key={rec._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 ">{rec.i}</td>
                  <td className="px-4 py-2">{rec.user || 'Unknown'}</td>
                  <td className="px-4 py-2">{rec.clockIn ? new Date(rec.clockIn).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2">{rec.clockOut ? new Date(rec.clockOut).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2">{rec?.location || '-'}</td>
                  <td className="px-4 py-2">
                    {rec.breaks?.length > 0
                      ? rec.breaks.map((b, index) => (
                        <div key={index}>
                          {new Date(b.breakIn).toLocaleTimeString()} - {new Date(b.breakOut).toLocaleTimeString()}
                        </div>
                      ))
                      : '-'}
                  </td>
                  <td className="text-left px-4 py-2">{rec?.taskComment || '-'}</td>
                  <td className="px-4 py-2">{rec.totalHours || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Monthly Summary Section */}
      {monthlyRecords.length > 0 && (
        <div className='overflow-x-auto'>
          <h2 className="text-xl font-semibold mb-4">📅 Monthly Attendance Summary</h2>
          {monthlyRecords.map((month, idx) => (
            <div key={idx} className="mb-6 border rounded-lg shadow-sm">
              <div className="bg-gray-100 p-4 flex justify-between items-center">
                <div>
                  <span className="font-medium">{month.monthYear}</span> — Total Entries: <strong>{month.totalEntries}</strong>
                </div>
              </div>

              <div className="p-4 bg-white">
                {month.days.map((day, i) => (
                  <div key={i} className="mb-4">
                    <div className="font-semibold text-blue-600 mb-2">
                      📌 {new Date(day.date).toDateString()} — {day.totalEntries} entries
                    </div>
                    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden mb-10">
                      <thead className="bg-blue-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Sr. No.</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">User</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock In</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Clock Out</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Breaks</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Task Comment</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Hours</th>
                      </tr>
                    </thead>
                    <tbody>
                      {day.records.map((rec, rIdx) => (
                        <tr key={rec._id} className="border-t text-sm font-medium text-gray-700 hover:bg-gray-50">
                          <td className="text-left px-4 py-2">{rIdx + 1}</td>
                          <td className="text-left px-4 py-2">{rec.user || 'Unknown'}</td>
                          <td className="text-left px-4 py-2">{rec.clockIn ? new Date(rec.clockIn).toLocaleString() : '-'}</td>
                          <td className="text-left px-4 py-2">{rec.clockOut ? new Date(rec.clockOut).toLocaleString() : '-'}</td>
                          <td className="px-4 py-2">{rec?.location || '-'}</td>
                          <td className="text-left px-4 py-2">
                            {rec.breaks?.length > 0
                              ? rec.breaks.map((b, index) => (
                                <div key={index}>
                                  {new Date(b.breakIn).toLocaleTimeString()} - {new Date(b.breakOut).toLocaleTimeString()}
                                </div>
                              ))
                              : '-'}
                          </td>
                          <td className="text-left px-4 py-2">{rec?.taskComment || '-'}</td>
                          <td className="text-left px-4 py-2">{rec.totalHours || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                ))}
            </div>
            </div>
      ))}
    </div>
  )
}
    </div >
  );
};

export default UserAttendanceList;
