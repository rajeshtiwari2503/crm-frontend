"use client"
import { useEffect, useState } from 'react';
import http_request from "../../../http-request";

const AdminAttendanceList = () => {
  const [records, setRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await http_request.get(`/attendance/getDailyAttendance?date=${selectedDate}`);
        setRecords(res.data);
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
      }
    };
    if (selectedDate) fetchData();
  }, [selectedDate]);


  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🗓 Attendance for {selectedDate}</h1>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>User</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Breaks</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec._id} className="border-t text-center">
              <td>{rec.user || 'Unknown'}</td>
              <td>{rec.clockIn ? new Date(rec.clockIn).toLocaleString() : '-'}</td>
              <td>{rec.clockOut ? new Date(rec.clockOut).toLocaleString() : '-'}</td>
              <td>
                {rec.breaks?.length > 0
                  ? rec.breaks.map((b, index) => (
                    <div key={index}>
                      {new Date(b.breakIn).toLocaleTimeString()} - {new Date(b.breakOut).toLocaleTimeString()}
                    </div>
                  ))
                  : '-'}
              </td>
              <td>{rec.totalHours || '-'}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default AdminAttendanceList;
