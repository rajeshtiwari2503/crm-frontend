"use client";
import { useEffect, useState } from "react";
import http_request from "../../../http-request";
import { useUser } from "../components/UserContext";
import { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { ReactLoader } from "../components/common/Loading";

export default function SalarySlipAdmin() {
    const { user } = useUser();
    const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));
    const [slips, setSlips] = useState([]);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchSlips = async () => {
        if (!user?.user?._id) return;

        setLoading(true);
        try {
            const res = await http_request.get(`/attendance/getSalaryAdminSlip?month=${month}`);
            setSlips(res.data || []);
            setSelectedSlip(null); // reset selection on month change
        } catch (err) {
            console.error("Error fetching slips:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlips();
    }, [month]);

    return (
        <div className="p-4">
            <Toaster />
            <h2 className="text-xl font-bold mb-4">Salary Slips</h2>

            {/* Month Picker */}
            <label className="block mb-2 font-medium">Select Month:</label>
            <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border w-1/2 p-2 rounded mb-6"
            />

            {loading ? (
                <div className="h-[200px] flex justify-center items-center">
                    <ReactLoader />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {/* List of Employees */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Employees</h3>
                        <ul className="border rounded p-2 grid grid-cols-5 gap-4">
                            {slips.map((slip, idx) => (
                                <li key={idx}>
                                    <button
                                        className={`w-full text-left p-2 hover:bg-blue-100 rounded ${selectedSlip?.user?._id === slip.user._id ? "bg-blue-100 font-semibold" : ""
                                            }`}
                                        onClick={() => setSelectedSlip(slip)}
                                    >
                                        {slip.user.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Selected Salary Slip */}
                    <div>
                        {selectedSlip ? (
                            <div className="border border-gray-300 rounded p-4 shadow-sm">
                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    {/* User Information */}
                                    <div className="border rounded p-4">
                                        <h3 className="text-lg font-semibold mb-2">User Information</h3>
                                        <p><strong>Name:</strong> {selectedSlip?.user?.name}</p>
                                        <p><strong>Email:</strong> {selectedSlip?.user?.email}</p>
                                    </div>

                                    {/* Salary Details */}
                                    <div className="border rounded p-4">
                                        <h3 className="text-lg font-semibold mb-2">Salary Details</h3>
                                        <p><strong>Month:</strong> {selectedSlip.month}</p>
                                        <p><strong>Daily Salary:</strong> ₹{selectedSlip.dailySalary}</p>
                                        <p><strong>Present Days:</strong> {selectedSlip.presentDays}</p>
                                        <p><strong>Sunday Days:</strong> {selectedSlip.sundayDays}</p>
                                        <p><strong>Total Salary:</strong> ₹{selectedSlip.totalSalary}</p>
                                    </div>
                                </div>


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
                                        {selectedSlip.slip.map((day, idx) => (
                                            <tr key={idx}   className={`border-t ${
                                                day.day === "Sun"
                                                  ? "bg-yellow-50 text-yellow-700 font-semibold"
                                                  : day.status.startsWith("Present")
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
                                            <td className="p-2 border text-center">{`${selectedSlip.presentDays} Present and  ${ selectedSlip.sundayDays} Sunday = `} {`${selectedSlip.presentDays + selectedSlip.sundayDays}  `} </td>
                                            <td className="p-2 border">₹{selectedSlip.totalSalary}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">Select an employee to view their salary slip.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
