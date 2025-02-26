 "use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation';
import http_request from "../../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import PendingParamComplaintList from './PendingListByParam';

const Pending = () => {
  const [complaint, setComplaint] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [value, setValue] = useState(null);
  
  const router = useRouter();
  const params = useParams(); // Extract dynamic param from route
  const daysRange = params?.id; // Get "2-5", "0-1", or "more-than-week"
 
  
  useEffect(() => {
    fetchPendingComplaints();
    getAllTechnician();
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, [refresh]);

  const getAllTechnician = async () => {
    try {
      let response = await http_request.get("/getAllTechnician");
      let { data } = response;
      setTechnicians(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPendingComplaints = async () => {
    try {
      const response = await http_request.get(`/getPendingComplaints/${daysRange}`);
      setComplaint(response.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

   const datacc=daysRange==="schedule"?complaint?.scheduleToday:complaint?.data

  const data =  datacc?.map((item, index) => ({
    ...item,
    i: index + 1,
  }));

  const techData =
    value?.user?.role === "SERVICE"
      ? technicians?.filter((f1) => f1?.serviceCenterId === value?.user?._id)
      : technicians;

  const RefreshData = (data) => {
    setRefresh(data);
  };

  return (
    <Sidenav>
      <Toaster />
      <PendingParamComplaintList 
        data={data} 
        technicians={techData} 
        userData={value?.user} 
        RefreshData={RefreshData} 
        
      />
    </Sidenav>
  );
};

export default Pending;
