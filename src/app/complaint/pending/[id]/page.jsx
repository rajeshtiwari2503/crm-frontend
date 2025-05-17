 "use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation';
import http_request from "../../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import PendingParamComplaintList from './PendingListByParam';
import { useUser } from '@/app/components/UserContext';
import { ReactLoader } from '@/app/components/common/Loading';

const Pending = () => {
  const [complaint, setComplaint] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [value, setValue] = useState(null);
  const [loading, setloading] = React.useState(false);

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
        // setloading(true)
      let response = await http_request.get("/getAllTechnician");
      let { data } = response;
      setTechnicians(data);
        // setloading(false)
    } catch (err) {
      console.log(err);
        // setloading(false)
    }
  };

  const fetchPendingComplaints = async () => {
    try {
       setloading(true)
      const response = await http_request.get(`/getPendingComplaints/${daysRange}`);
      setComplaint(response.data);
       setloading(false)
    } catch (err) {
       setloading(false)
      console.error("Error fetching complaints:", err);
    }
  };

   const datacc=daysRange==="schedule"?complaint?.scheduleToday:complaint?.data

  //  const sortData = user?.user?.role==="EMPLOYEE"?datacc?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):datacc;

  const selectedBrandIds = user?.user?.brand?.map(b => b.value) || [];
  const hasStateZone = user?.user?.stateZone?.length > 0;
  const hasBrand = selectedBrandIds.length > 0;
  
  const sortData = user?.user?.role === "EMPLOYEE"
    ? datacc?.filter(f1 => {
        const matchState = hasStateZone ? user?.user?.stateZone.includes(f1?.state) : true;
        const matchBrand = hasBrand ? selectedBrandIds.includes(f1?.brandId) : true;
        return matchState && matchBrand;
      })
    : datacc;
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
       {loading === true ? (
                    <div className="flex items-center justify-center h-[80vh]">
                      <ReactLoader />
                    </div>
                  ) : (
      <PendingParamComplaintList 
        data={data} 
        technicians={techData} 
        userData={value?.user} 
        RefreshData={RefreshData} 
        
      />
                  )}
    </Sidenav>
  );
};

export default Pending;
