"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import SparepartList from './sparepartList'
import { useUser } from '@/app/components/UserContext'
const Sparepart = () => {
    const [spareparts, setSpareparts] = useState([])

    const [refresh, setRefresh] = useState("")
    const [userData, setUserData] = useState(null)

    const { user } = useUser();
   
   
     useEffect(() => {
   
       if (user) {
         setUserData(user);
       }
      getAllSpareparts()
    }, [refresh,user])
  
  
    const getAllSpareparts = async () => {
      let response = await http_request.get("/getAllSparepart")
      let { data } = response;
  
      setSpareparts (data)
    }
    const filterData = userData?.user.role === "ADMIN" ? spareparts : userData?.user.role === "BRAND" ? spareparts?.filter((f) =>
      f?.brandId === userData?.user?._id) : userData?.user.role === "BRAND EMPLOYEE"?spareparts?.filter((f) =>
        f?.brandId === userData?.user?.brandId): []
  
    const data = filterData?.map((item, index) => ({ ...item, i: index + 1}));

    const RefreshData = (data) => {
      setRefresh(data)
    }

    return (
        <>
            <Sidenav>
               
                <SparepartList data={data} RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Sparepart