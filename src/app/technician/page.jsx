
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import TechnicianList from './technicianList';
 



const Technician = () => {

  const [technician, setTechnician] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
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

  const data = technician?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <TechnicianList data={data} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Technician