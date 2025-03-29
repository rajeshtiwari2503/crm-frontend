 
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import FeedbackList from './feedbackList';


const Feedback = () => {

  const [feedbacks, setFeedbacks] = useState([])

  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllFeedback()

  }, [refresh])

  const getAllFeedback = async () => {
    try {
      let user = localStorage.getItem("user");
      let obj = JSON.parse(user);
  
      // Construct the correct API endpoint based on user role
      const endpoint =
        obj?.user?.role === "ADMIN"
          ? `/getAllFeedback`
          : obj?.user?.role === "BRAND"
          ? `/getFeedbackByBrandId/${obj?.user?._id}`
          : obj?.user?.role === "SERVICE"
          ? `/getFeedbackByServiceCenterId/${obj?.user?._id}`
          : obj?.user?.role === "TECHNICIAN"
          ? `/getFeedbackByTechnicianId/${obj?.user?._id}`
          : `/getFeedbackByUserId/${obj?.user?._id}`;
  
      // Make the API call with the correct endpoint
      let response = await http_request.get(endpoint);
      let { data } = response;
  
      setFeedbacks(data);
    } catch (err) {
      console.log(err);
    }
  };
  
 
  const data = feedbacks?.map((item, index) => ({ ...item, i: index + 1}));

  const RefreshData = (data) => {
    setRefresh(data)
  }
 
  return (
    <Sidenav>
        <>
      <Toaster />
      <div className='flex justify-center'>
      <div className='md:w-full w-[260px]'>
     <FeedbackList data={data}   RefreshData={RefreshData}/>
       {/* <Thankyou /> */}
       </div>
       </div>
       </>
    </Sidenav>
  )
}

export default Feedback