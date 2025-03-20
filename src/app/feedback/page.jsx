 
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

  const getAllFeedback = async() => {
    try{
      let user = localStorage.getItem("user");
      let obj = JSON.parse(user);
        const userDT=userDT?.user?.role==="ADMIN"?`/getAllFeedback`
        :userDT?.user?.role==="BRAND"?`/getFeedbackByBrandId/${userDT?.user?._id}`
       : userDT?.user?.role==="SERVICE"?`/getFeedbackByServiceCenterId/${userDT?.user?._id}`
        :userDT?.user?.role==="TECHNICIAN"?`/getFeedbackByTechnicianId/${userDT?.user?._id}`
        :`/getFeedbackByUserId/${userDT?.user?._id}`
      let response = await http_request.get("/getAllFeedback")
      let { data } = response;
  
      setFeedbacks(data)
    }
    
    catch(err){
      console.log(err);
    }
  }
 
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