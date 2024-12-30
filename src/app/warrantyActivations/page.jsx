"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../http-request'
import WarrantyActivationList from './activationList'

 

const WarrantyActivation = (props) => {
  const [warrantyActivation, setWarrantyActivation] = useState([])
  const [product, setProduct] = useState([])

  const [refresh, setRefresh] = useState("")
  const [userData, setUserData] = React.useState(null);
  useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setUserData(JSON.parse(storedValue));
    }
    getAllWarrantyActivation()
    getAllProduct()
  }, [refresh])


  const getAllWarrantyActivation = async () => {
    let response = await http_request.get("/getAllActivationWarranty")
    let { data } = response;
    // console.log(data);

    setWarrantyActivation(data)
  }
  const getAllProduct = async () => {
    let response = await http_request.get("/getAllProduct")
    let { data } = response;

    setProduct(data)
  }
  const filterData = userData?.user?.role === "ADMIN" ? warrantyActivation : warrantyActivation?.filter((f) => f?.brandId === userData?.user?._id)

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <>
       
        <Sidenav>
          <WarrantyActivationList data={data} userData={userData?.user} brandData={props?.brandData} product={product} RefreshData={RefreshData} />
        </Sidenav>
    
    </>
  )
}

export default WarrantyActivation