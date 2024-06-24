
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import AssignComplaintList from './assignComplaintList';



const Assign = () => {

  const [complaint, setComplaint] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);

  
  useEffect(() => {
    getAllComplaint()
    getAllTechnician()
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, [refresh])
  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllComplaint")
      let { data } = response;

      setComplaint(data)
    }
    catch (err) {
      console.log(err);
    }
  }
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
  const sortData = complaint?.filter((f1) => f1?.status ==="ASSIGN")
  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));



  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <AssignComplaintList   data={data}technicians={technicians}userData={value?.user} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Assign