
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import DealerList from './dealerList';
 


const Dealer = () => {

  const [dealers, setDealers] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllDealers()

  }, [refresh])

  const getAllDealers = async () => {
    try {
      let response = await http_request.get("/getAllDealer")
      let { data } = response;

      setDealers(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const data = dealers?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
       <DealerList data={data} RefreshData={RefreshData} />
        
      </>
    </Sidenav>
  )
}

export default Dealer