
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import OrderList from './orderList';
import { useUser } from '@/app/components/UserContext';




const Order = () => {

  const [order, setOrder] = useState([])
  const [refresh, setRefresh] = useState("")
  const [sparepart, setSparepart] = useState([])
  const [serviceCenter, setServiceCenter] = useState([])
  const [brands, setBrands] = useState([])
  const [value, setValue] = React.useState(null);
const {user}=useUser()
  useEffect(() => {
 
    if (user) {
      setValue(user);
    }
    getAllOrder()
    getAllSparepart()
    getAllServiceCenter()
    getAllBrand()
  }, [refresh,user])

  const getAllOrder = async () => {
    const storedValue = localStorage.getItem('user');
    const userInfo = storedValue ? JSON.parse(storedValue) : null;
  
    try {
      let endPoint=
     userInfo?.user?.role === 'ADMIN'|| userInfo?.user?.role === 'EMPLOYEE'? 
         '/getAllOrder'
        : userInfo?.user?.role === 'BRAND'? 
         `/getAllOrderById?brandId=${userInfo?.user?._id}`
         : `/getAllOrderById?serviceCenterId=${userInfo?.user?._id}`
     
  
      let response = await http_request.get(endPoint);
      let { data } = response;
  
      setOrder(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const getAllSparepart = async () => {
    try {
      let response = await http_request.get("/getAllSparePart")
      let { data } = response;

      setSparepart(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const getAllServiceCenter = async () => {
    try {
      let response = await http_request.get("/getAllService")
      let { data } = response;

      setServiceCenter(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const getAllBrand = async () => {
    try {
      let response = await http_request.get("/getAllBrand")
      let { data } = response;

      setBrands(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const data = order?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  const filterSparepart= value?.user?.role === "ADMIN" ? sparepart : value?.user?.role === "BRAND" ? sparepart?.filter((f) =>
    f?.brandId === value?.user?._id) : sparepart
// console.log(filterSparepart);

  return (
    <Sidenav>
      <Toaster />
      <>
        <OrderList data={data} userData={value} brand={brands} serviceCenter={serviceCenter} sparepart={filterSparepart} RefreshData={RefreshData} />
      </>
    </Sidenav>
  )
}

export default Order