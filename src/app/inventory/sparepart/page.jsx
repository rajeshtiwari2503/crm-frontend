"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import SparepartList from './sparepartList'
const Sparepart = () => {
    const [spareparts, setSpareparts] = useState([])

    const [refresh, setRefresh] = useState("")

    useEffect(() => {
      getAllSpareparts()
    }, [refresh])
  
  
    const getAllSpareparts = async () => {
      let response = await http_request.get("/getAllSparepart")
      let { data } = response;
  
      setSpareparts (data)
    }
  
    const data = spareparts?.map((item, index) => ({ ...item, i: index + 1}));

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