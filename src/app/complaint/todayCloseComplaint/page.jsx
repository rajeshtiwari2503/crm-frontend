
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import { useUser } from '@/app/components/UserContext';
import TodayCloseComplaintList from './todayCloseComplaintList';
import { ReactLoader } from '@/app/components/common/Loading';


const PartPending = () => {

  const [complaint, setComplaint] = useState([])
  const [refresh, setRefresh] = useState("")

  const [value, setValue] = React.useState(null);

  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  });

  const [loading, setLoading] = useState(false);


  useEffect(() => {

    if (user) {
      setValue(user)
    }
    getAllComplaint()

  }, [refresh, user, selectedDate])

  const getAllComplaint = async () => {
    setLoading(true);
    try {
      const response = await http_request.get(`/getTodayCompletedComplaints?date=${selectedDate}`);
      setComplaint(response.data);
    } catch (err) {
      console.log(err);
      setComplaint([]);
    } finally {
      setLoading(false);
    }
  };


  // const sortData = user?.user?.role==="EMPLOYEE"?complaint?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):complaint;

  const selectedBrandIds = user?.user?.brand?.map(b => b.value) || [];
  const hasStateZone = user?.user?.stateZone?.length > 0;
  const hasBrand = selectedBrandIds.length > 0;

  const sortData = user?.user?.role === "EMPLOYEE"
    ? complaint?.filter(f1 => {
      const matchState = hasStateZone ? user?.user?.stateZone.includes(f1?.state) : true;
      const matchBrand = hasBrand ? selectedBrandIds.includes(f1?.brandId) : true;
      return matchState && matchBrand;
    })
    : complaint;

  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));



  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <div className="mb-6">
        <label htmlFor="date" className="block text-sm font-semibold text-gray-800 mb-2">
          Select Date
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm outline-none transition duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {loading ? (
        <div  >
          <ReactLoader />
        </div>
      ) : (
        <TodayCloseComplaintList data={data} userData={value?.user} RefreshData={RefreshData} />
      )}

    </Sidenav>
  )
}

export default PartPending