
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import { ReactLoader } from '@/app/components/common/Loading';
import ServiceList from './serviceList';
 


const Service = () => {

  const [service, setService] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllService()

  }, [refresh])

  const getAllService = async () => {
    try {
      let response = await http_request.get("/getAllService")
      let { data } = response;

      setService(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const data = service?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <ServiceList data={data} RefreshData={RefreshData} />
     
      </>
    </Sidenav>
  )
}

export default Service