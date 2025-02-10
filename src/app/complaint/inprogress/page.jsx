
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import InProgressComplaintList from './inProgressList';
import { useUser } from '@/app/components/UserContext';




const InProgress = () => {

  const [complaint, setComplaint] = useState([])
  const [refresh, setRefresh] = useState("")

  const [value, setValue] = React.useState(null);

  const { user } = useUser();


  useEffect(() => {

    if (user) {
      setValue(user)
    }
    getAllComplaint()
    }, [refresh,user])

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getComplaintsByInProgress")
      let { data } = response;

      setComplaint(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  // const sortData = complaint?.filter((f1) => f1?.status ==="IN PROGRESS")
  const data = complaint?.map((item, index) => ({ ...item, i: index + 1 }));



  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <InProgressComplaintList data={data} userData={value?.user} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default InProgress