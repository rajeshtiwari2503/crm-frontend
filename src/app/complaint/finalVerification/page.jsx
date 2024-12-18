
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import VerificationComplaintList from './verificationComplaintList';
 



const Verification = () => {

  const [complaint, setComplaint] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [sparepart, setSparepart] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);

  
  useEffect(() => {
    getAllComplaint()
    getAllTechnician()
    getAllSparepart()
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
  const getAllSparepart = async () => {
    try {
      let response = await http_request.get("/getAllSparePart")
      let { data } = response;

      setSparepart(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const techData =value?.user?.role==="SERVICE"? technicians?.filter((f1) => f1?.serviceCenterId ===value?.user?._id):technicians

  // Final Verification
  const sortData = complaint?.filter((f1) => f1?.status ==="ASSIGN")
  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));



  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <VerificationComplaintList  sparepart={sparepart} data={data}technicians={techData}userData={value?.user} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Verification