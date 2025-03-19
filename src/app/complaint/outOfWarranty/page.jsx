
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import OutOfWarrantyList from './outOfComplaintList';
import { useUser } from '@/app/components/UserContext';
 



const OutOfWarranty = () => {

  const [complaint, setComplaint] = useState([])
  const [serviceCenter, setServiceCenter] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);

 const { user } = useUser();
   
      useEffect(() => {
    
        if (user) {
          setValue(user)
        }
    getAllComplaint()
    getAllServiceCenter()
    
  }, [refresh,user])

  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getAllBrandComplaint")
      let { data } = response;

      setComplaint(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const getAllServiceCenter = async () => {
    try {
      let response = await http_request.get("/getAllService")
      let { data } = response;

      setServiceCenter(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const sortData = complaint?.filter((f1) => f1?.warrantyStatus ==="false")
  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <OutOfWarrantyList data={data} serviceCenter={serviceCenter} userData={value?.user} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default OutOfWarranty