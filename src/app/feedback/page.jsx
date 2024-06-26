 
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
    
     <FeedbackList data={data}   RefreshData={RefreshData}/>
       {/* <Thankyou /> */}
       </>
    </Sidenav>
  )
}

export default Feedback