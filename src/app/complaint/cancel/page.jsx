
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import CancelComplaintList from './cancelComplaintList';



const Cancel = () => {

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
  const sortData = complaint?.filter((f1) => f1?.status ==="CANCEL")
  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));



  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <CancelComplaintList data={data} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Cancel