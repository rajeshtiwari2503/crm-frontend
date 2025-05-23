
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import NotificationList from './notificationList';
import { ReactLoader } from '../components/common/Loading';




const Notification = () => {

  const [notification, setNotification] = useState([])
  const [refresh, setRefresh] = useState("")

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllNotification()

  }, [refresh])

  const getAllNotification = async () => {
    const storedValue = localStorage.getItem("user");
    const userType = JSON.parse(storedValue)
    try {
      setLoading(true);
      const endPoint = (userType?.user?.role) === "ADMIN" ? `/getAllNotification` : (userType?.user?.role) === "USER" ? `/getNotificationByUserId/${userType?.user?._id}`
        : (userType?.user?.role) === "BRAND" ? `/getNotificationByBrandId/${userType?.user?._id}`
          : (userType?.user?.role) === "SERVICE" ? `/getNotificationByServiceCenterId/${userType?.user?._id}`
            : (userType?.user?.role) === "TECHNICIAN" ? `/getNotificationByTechnicianId/${userType?.user?._id}`
              : (userType?.user?.role) === "DEALER" ? `/getNotificationByDealerId/${userType?.user?._id}`
                : ""
      let response = await http_request.get(endPoint)
      let { data } = response;
      setNotification(data)
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      setLoading(false);
    }
  }

  const data = notification?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <div className='flex justify-center'>
        <div className='md:w-full w-[260px]'>
         {loading===true ? <div className="flex items-center justify-center h-[80vh]">
                       <ReactLoader />
                     </div>
         :
          <NotificationList data={data} RefreshData={RefreshData} />
         }
        </div>
      </div>
    </Sidenav>
  )
}

export default Notification