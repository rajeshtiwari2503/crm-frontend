 
"use client"
import React, { useEffect, useState } from 'react'
import LocationList from './LocationList'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'


const Location = () => {

  const [locations, setLocations] = useState([])

  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllLocation()

  }, [refresh])

  const getAllLocation = async() => {
    let response = await http_request.get("/getAllLocation")
    let { data } = response;

    setLocations(data)
  }

  const data = locations?.map((item, index) => ({ ...item, i: index + 1}));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
     <LocationList data={data} RefreshData={RefreshData}/>
       
      </>
    </Sidenav>
  )
}

export default Location