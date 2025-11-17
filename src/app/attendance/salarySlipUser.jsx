 "use client";
import { useEffect, useState } from "react";
import http_request from "../../../http-request";
import { useUser } from "../components/UserContext";
import { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { ReactLoader } from "../components/common/Loading";

export default function SalarySlip() {
  const { user } = useUser();
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));
  const [slip, setSlip] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSlip = async () => {
    if (!user?.user?._id) return;

    setLoading(true);
    try {
      const  res = await http_request.get(`/attendance/getSalaryUserSlip?userId=${user?.user?._id}&month=${month}`);
       
      setSlip(res.data);
    } catch (err) {
      console.error("Error fetching slip:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlip();
  }, [month]);

  return (
    <div className="p-4">
      <Toaster />
      <h2 className="text-xl font-bold mb-4">Salary Slip</h2>

      {/* Month Selection */}
      <label className="block mb-2 font-medium">Select Month:</label>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      {loading ? (
        <div className="h-[200px] flex justify-center items-center">
          <ReactLoader />
        </div>
      ) : slip ? (
        <div className="border border-gray-300 rounded p-4 shadow-sm">
          {/* User Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">User Information</h3>
            <p><strong>Name:</strong> {slip?.user?.name}</p>
            <p><strong>Email:</strong> {slip?.user?.email}</p>
          </div>

          {/* Salary Summary */}
          <div className="mb-4 ">
            <h3 className="text-lg font-semibold">Salary Details</h3>
            <p><strong>Month:</strong> {month}</p>
            <p><strong>Daily Salary:</strong> ₹{slip.dailySalary}</p>
            <p><strong>Present Days:</strong> {slip.presentDays}</p>
            <p><strong>Sunday Days:</strong> {slip.sundayDays}</p>
            <p><strong>Total Salary:</strong> ₹{slip.totalSalary}</p>
          </div>
          </div>

          {/* Attendance Table */}
          {/* <table className="w-full mt-4 border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Day</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Daily Payment</th>
              </tr>
            </thead>
            <tbody>
              {slip?.slip?.map((day, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 border">{day.date}</td>
                  <td className="p-2 border">{day.day}</td>
                  <td
                    className={`p-2 border ${day.status === 'Present' ? 'text-green-600' : day.status === 'Absent' ? 'text-red-500' : ''}`}
                  >
                    {day.status}
                  </td>
                  <td className="p-2 border">₹{day.payment}</td>
                </tr>
              ))}
              <tr className="font-semibold bg-gray-100">
                <td colSpan={2} className="p-2 border">Total Present Days</td>
                <td className="p-2 border text-center">{slip.presentDays}</td>
                <td className="p-2 border">₹{slip.totalSalary}</td>
              </tr>
            </tbody>
          </table> */}
            <table className="w-full mt-4 border text-sm">
                                    <thead className="bg-[#09090b]">
                                        <tr>
                                            <th className="p-2 border text-white">Date</th>
                                            <th className="p-2 border text-white">Day</th>
                                            <th className="p-2 border text-white">Status</th>
                                            <th className="p-2 border text-white">Daily Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {slip?.slip.map((day, idx) => (
                                            <tr key={idx}   className={`border-t ${
                                                day.day === "Sun"
                                                  ? "bg-yellow-50 text-yellow-700 font-semibold"
                                                  : day.status === "Present"
                                                  ? "bg-green-50 text-green-700 font-semibold"
                                                  : day.status === "Absent"
                                                  ? "bg-red-50 text-red-600"
                                                  : ""
                                              }`}>
                                                <td className="p-2 border">{day.date}</td>
                                                <td className="p-2 border">{day.day}</td>
                                                
                                                <td
                                                    className={`p-2 border  `}
                                                >
                                                    {day.day === "Sun" ? "----------" : day.status}
                                                </td>
                                                <td className="p-2 border">₹{day.payment}</td>
                                            </tr>
                                        ))}
                                        <tr className="font-semibold bg-gray-100">
                                            <td colSpan={2} className="p-2 border">Total Present Days</td>
                                            <td className="p-2 border text-center">{`${slip.presentDays} Present and  ${ slip.sundayDays} Sunday = `} {`${slip.presentDays + slip.sundayDays}  `} </td>
                                            <td className="p-2 border">₹{slip.totalSalary}</td>
                                        </tr>
                                    </tbody>
                                </table>
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}
