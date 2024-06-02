
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import NotificationList from './notificationList';
 



const Notification = () => {

  const [notification, setNotification] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllNotification()

  }, [refresh])

  const getAllNotification = async () => {
    try {
      let response = await http_request.get("/getAllNotification")
      let { data } = response;

      setNotification(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const data = notification?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <NotificationList data={data} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Notification