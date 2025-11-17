"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation';
import http_request from "../../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import PartPendingParamComplaintList from './PartPendingByParam';
import { ReactLoader } from '@/app/components/common/Loading';

const PartPending = () => {
  const [complaint, setComplaint] = useState([]);
  const [refresh, setRefresh] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [value, setValue] = useState(null);
  const [loading, setloading] = React.useState(false);

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
      setloading(true)
      const response = await http_request.get(`/getPartPendingComplaints/${daysRange}`);
      setComplaint(response.data.data);
      setloading(false)
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setloading(false)
    }
  };



  const data = complaint?.map((item, index) => ({
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
        <PartPendingParamComplaintList
          data={data}
          technicians={techData}
          userData={value?.user}
          RefreshData={RefreshData}

        />
      )}
    </Sidenav>
  );
};

export default PartPending;
