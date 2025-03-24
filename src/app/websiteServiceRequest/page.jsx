"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../http-request'
import { useUser } from '../components/UserContext'
import RequestList from './RequestList'

 

const WarrantyActivation = (props) => {
  const [serviceRequest, setServiceRequest] = useState([])
  const [refresh, setRefresh] = useState("")
  const [userData, setUserData] = React.useState(null);
   const { user } = useUser();
             
            
             useEffect(() => {
              
               if (user) {
                setUserData(user);
               }
     
    
    getAllWarrantyActivation()
  
  }, [refresh,user])


  const getAllWarrantyActivation = async () => {
    try{
      let response = await http_request.get("/getAllServiceRequest")
      let { data } = response;
      // console.log(data);
  
      setServiceRequest(data)
    }
   
    catch(err){
      console.log(err);
      
    }
  }
  
  const filterData = userData?.user?.role === "ADMIN" ? serviceRequest :userData?.user?.role === "BRAND EMPLOYEE"? serviceRequest?.filter((f) => f?.brandId === userData?.user?.brandId):serviceRequest?.filter((f) => f?.brandId === userData?.user?._id)

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <>
       
        <Sidenav>
          <RequestList data={data} userData={userData?.user}   RefreshData={RefreshData} />
        </Sidenav>
    
    </>
  )
}

export default WarrantyActivation