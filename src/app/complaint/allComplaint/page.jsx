
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import ComplaintList from './complaintList';
import { useUser } from '@/app/components/UserContext';



const Service = () => {

  const [complaint, setComplaint] = useState([])
  const [serviceCenter, setServiceCenter] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);
  const {user}=useUser()
  useEffect(() => {
    getAllComplaint()
    getAllServiceCenter()
    
    if (user) {
      setValue(user);
    }
  }, [refresh,user])

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint")
      let { data } = response;

      setComplaint(data?.data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const getAllServiceCenter = async () => {
    try {
      let response = await http_request.get("/getAllService")
      let { data } = response;

      setServiceCenter(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const sortData = user?.user?.role==="EMPLOYEE"?complaint?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):complaint;

  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <ComplaintList data={data} serviceCenter={serviceCenter} userData={value?.user} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Service