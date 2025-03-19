
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import { ReactLoader } from '@/app/components/common/Loading';
import ServiceList from './serviceList';
import { useUser } from '@/app/components/UserContext';



const Service = () => {

  const [service, setService] = useState([])
  const [refresh, setRefresh] = useState("")

  const [value, setValue] = React.useState(null);

  const { user } = useUser();


  useEffect(() => {

    if (user) {
      setValue(user);
    }
    getAllService()

  }, [refresh, user])

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
  // const filData = value?.user?.role === "BRAND" ? service?.filter((f) => f?.brandId === value?.user?._id) :
  //   value?.user?.role === "EMPLOYEE" ? service?.filter((f1) => user?.user?.stateZone?.includes(f1?.state))
  //     : service
 
  const filData = value?.user?.role === "BRAND" 
  ? service?.filter((f) => f?.brandId === value?.user?._id) 
  : value?.user?.role === "EMPLOYEE" 
    ? service?.filter((f1) => 
        user?.user?.stateZone
          ?.map(state => state?.trim().toLowerCase()) // Normalize stateZone values
          ?.includes(f1?.state?.trim().toLowerCase()) // Compare with normalized state
      )
    : service;



  const data = filData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <ServiceList data={data} user={value?.user} RefreshData={RefreshData} />

      </>
    </Sidenav>
  )
}

export default Service