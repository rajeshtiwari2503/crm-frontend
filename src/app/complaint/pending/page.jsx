
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
  // const sortData = complaint?.filter((f1) => f1?.status ==="PENDING")
  const data = complaint?.map((item, index) => ({ ...item, i: index + 1 }));

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