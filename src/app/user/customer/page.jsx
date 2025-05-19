
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import { ReactLoader } from '@/app/components/common/Loading';
import CustomerList from './customerList';
import { useUser } from '@/app/components/UserContext';


const Customer = () => {

  const [users, setUsers] = useState([])
  const [refresh, setRefresh] = useState("")
   const [loading, setLoading] = useState(true);
  const {user}=useUser()
  useEffect(() => {
    getAllUsers()

  }, [refresh,user])

  const getAllUsers = async () => {
    try {
       setLoading(true);
      let response = await http_request.get("/getAllUser")
      let { data } = response;

      setUsers(data)
       setLoading(false);
    }
    catch (err) {
       setLoading(false);
      console.log(err);
    }
  }
const data1=user?.user?.role==="ADMIN"?users :user?.user?.role==="BRAND EMPLOYEE"? users?.filter((f)=>f?.brandId===user?.user?.brandId): users?.filter((f)=>f?.brandId===user?.user?._id)
  const data = data1?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }
 

  return (
    <Sidenav>
      <Toaster />
       {loading ? (
              <div className="flex justify-center items-center h-screen">
                <ReactLoader />
              </div>
            ) : (
      <>
         <CustomerList data={data} RefreshData={RefreshData} />
        
      </>
            )}
    </Sidenav>
  )
}

export default Customer