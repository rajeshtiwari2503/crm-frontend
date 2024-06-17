
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import OrderList from './OrderList';




const Order = () => {

  const [order, setOrder] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllOrder()

  }, [refresh])

  const getAllOrder = async () => {
    try {
      let response = await http_request.get("/getAllOrder")
      let { data } = response;

      setOrder(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const data = order?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <OrderList data={data} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Order