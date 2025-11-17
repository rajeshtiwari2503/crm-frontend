"use client";
import React, { useEffect, useState } from 'react';
import Sidenav from '../components/Sidenav';
import Clock from './attendance';
import AdminAttendanceList from './adminAttendanceList';
import SalarySlipAdmin from './salarySlipAdmin';
import UserAttendanceList from './userAttendanceList';
import { useUser } from '../components/UserContext';
import SalarySlip from './salarySlipUser';

const Attendance = () => {
    const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState(null);

  const isAdmin = user?.user?.role === "ADMIN";

  useEffect(() => {
    if (user?.user?.role) {
      const defaultTab = user.user.role === "ADMIN" ? "attendance" : "clock";
      setSelectedTab(defaultTab);
      console.log("Default tab set to:", defaultTab);
    }
  }, [user]);
// console.log("selectedTab",);

    return (
        <Sidenav>
            <div>
                {/* Tabs */}
                <div className="flex space-x-4 mb-6 border-b pb-2">
                    {isAdmin ? (
                        <>
                            <button
                                onClick={() => setSelectedTab('attendance')}
                                className={`px-4 py-2 rounded-t-md font-semibold ${selectedTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Attendance List
                            </button>
                            <button
                                onClick={() => setSelectedTab('salary')}
                                className={`px-4 py-2 rounded-t-md font-semibold ${selectedTab === 'salary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Salary Slip
                            </button>

                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setSelectedTab('clock')}
                                className={`px-4 py-2 rounded-t-md font-semibold ${selectedTab === 'clock' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Clock
                            </button>
                            {/* <button
                                onClick={() => setSelectedTab('salary')}
                                className={`px-4 py-2 rounded-t-md font-semibold ${selectedTab === 'salary' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Salary Slip
                            </button> */}
                            <button
                                onClick={() => setSelectedTab('attendance')}
                                className={`px-4 py-2 rounded-t-md font-semibold ${selectedTab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Attendance List
                            </button>
                        </>
                    )}
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 gap-4">
                    {isAdmin ? (
                        <>
                            {selectedTab === 'salary' && <SalarySlipAdmin />}
                            {selectedTab === 'attendance' && <AdminAttendanceList />}
                        </>
                    ) : (
                        <>
                            {selectedTab === 'clock' && <Clock />}
                            {selectedTab === 'salary' && <SalarySlip />}
                            {selectedTab === 'attendance' && (
                                <UserAttendanceList userId={user?.user?._id} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </Sidenav>
    );
};

export default Attendance;
