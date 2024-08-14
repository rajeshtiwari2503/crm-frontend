"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import WarrantyList from './WarrantyList'

const Warranty = () => {
    const [warranty, setWarranty] = useState([])
    const [product, setProduct] = useState([])

    const [refresh, setRefresh] = useState("")

    useEffect(() => {
      getAllwarranty()
      getAllProduct()
    }, [refresh])
  
  
    const getAllwarranty = async () => {
      let response = await http_request.get("/getAllProductWarranty")
      let { data } = response;
  
      setWarranty (data)
    }
    const getAllProduct = async () => {
        let response = await http_request.get("/getAllProduct")
        let { data } = response;
    
        setProduct (data)
      }
    const data = warranty?.map((item, index) => ({ ...item, i: index + 1}));

    const RefreshData = (data) => {
      setRefresh(data)
    }

    return (
        <>
            <Sidenav>
               
                <WarrantyList data={data} product={product} RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Warranty