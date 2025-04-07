
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import PendingComplaintList from './pendingList';
import { useUser } from '@/app/components/UserContext';
 



const Pending = () => {

  const [complaint, setComplaint] = useState([])
  const [refresh, setRefresh] = useState("")
  const [technicians, setTechnicians] = useState([])

  const [value, setValue] = React.useState(null);

  const { user } = useUser();
    // console.log("usercancel",user,value);
    
    
      useEffect(() => {
    
        if (user) {
          setValue(user)
        }
    getAllComplaint()
    getAllTechnician()
    
  }, [refresh,user])
  const getAllTechnician = async () => {
    try {
      let response = await http_request.get("/getAllTechnician")
      let { data } = response;

      setTechnicians(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getComplaintsByPending")
      let { data } = response;

      setComplaint(data)
    }
    catch (err) {
      console.log(err);
    }
  }
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

  const techData =value?.user?.role==="SERVICE"? technicians?.filter((f1) => f1?.serviceCenterId ===value?.user?._id)
                :technicians 

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <PendingComplaintList data={data}technicians={techData} userData={value?.user} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Pending