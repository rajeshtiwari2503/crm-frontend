 "use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation';
import http_request from "../../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import PendingParamComplaintList from './PendingListByParam';
import { useUser } from '@/app/components/UserContext';

const Pending = () => {
  const [complaint, setComplaint] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [value, setValue] = useState(null);
  
  const router = useRouter();
  const params = useParams(); // Extract dynamic param from route
  const daysRange = params?.id; // Get "2-5", "0-1", or "more-than-week"
 
 const { user } = useUser();
     // console.log("usercancel",user,value);
     
     
       useEffect(() => {
     
         if (user) {
           setValue(user)
         }
    fetchPendingComplaints();
    getAllTechnician();
    
     
  }, [refresh,user]);

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

   const sortData = user?.user?.role==="EMPLOYEE"?datacc?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):datacc;

    
  const data =  sortData?.map((item, index) => ({
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
