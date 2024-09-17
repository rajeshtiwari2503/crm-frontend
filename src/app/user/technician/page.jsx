
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import TechnicianList from './technicianList';
 



const Technician = () => {

  const [technician, setTechnician] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = useState(null)

  useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
        setValue(JSON.parse(storedValue));
    }
    getAllTechnician()

  }, [refresh])

  const getAllTechnician = async () => {
    try {
      let response = await http_request.get("/getAllTechnician")
      let { data } = response;

      setTechnician(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const filterData=value?.user?.role==="ADMIN"?technician:value?.user?.role==="BRAND"?technician?.filter((f)=>f?.brandId===value?.user?._id):
                              technician?.filter((f)=>f?.serviceCenterId===value?.user?._id)

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <TechnicianList userData={value?.user}data={data} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Technician