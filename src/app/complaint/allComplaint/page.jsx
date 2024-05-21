
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import ComplaintList from './complaintList';



const Service = () => {

  const [complaint, setComplaint] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllComplaint()

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

  const data = complaint?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <ComplaintList data={data} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Service