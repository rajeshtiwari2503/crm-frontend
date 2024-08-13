"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '../../../../http-request'
import ComplaintNatureList from './complaintNatureList'

const ComplaintNature = () => {
    const [complaintNature, setComplaintNature] = useState([])
    const [product, setProduct] = useState([])
    const [refresh, setRefresh] = useState("")

    useEffect(() => {
      getAllComplaintNature()
      getAllProduct()
    }, [refresh])
  
    const getAllComplaintNature = async () => {
      let response = await http_request.get("/getAllProduct")
      let { data } = response;
  
      setProduct(data)
    }
    const getAllProduct = async () => {
      let response = await http_request.get("/getAllComplaintNature")
      let { data } = response;
  
      setComplaintNature(data)
    }
    const data = complaintNature?.map((item, index) => ({ ...item, i: index + 1}));
    const RefreshData = (data) => {
      setRefresh(data)
    }
    return (
        <>
            <Sidenav>
               
                <ComplaintNatureList product={product} data={data}RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default ComplaintNature