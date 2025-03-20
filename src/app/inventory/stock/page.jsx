"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import StockList from './stockList'
import { useUser } from '@/app/components/UserContext'
const Stock = () => {
    const [stocks, setStocks] = useState([])
    const [products, setProducts] = useState([])

    const [refresh, setRefresh] = useState("")
    const [value, setValue] = useState(null)
const {user}=useUser()
    useEffect(() => {
      if(user){
        setValue(user?.user)
      }
     
      getAllStocks()
      getAllProducts()
    }, [refresh,user])
  
  console.log("user",user);
  
    const getAllStocks = async () => {
      try{
        const storedValue = localStorage.getItem("user");
        const userType = JSON.parse(storedValue)
        const req=userType?.user?.role==="SERVICE"?"/getAllUserStock":"/getAllStock"
      let response = await http_request.get(req)
      let { data } = response;
  
      setStocks (data)
    }
      catch(err){
        console.log(err);
        
      }
    }
     
    const getAllProducts = async () => {
      let response = await http_request.get("/getAllSparepart")
      let { data } = response;
  
      setProducts (data)
    }
  const filteData=value?.role==="ADMIN"?stocks: value?.role==="EMPLOYEE"?stocks:value?.role==="BRAND"?stocks?.filter((f)=>f?.brandId===value?._id):
   value?.role==="SERVICE"?stocks?.filter((f)=>f?.serviceCenterId===value?._id):[]
    const data = filteData?.map((item, index) => ({ ...item, i: index + 1}));

    const RefreshData = (data) => {
      setRefresh(data)
    }
    const filterProduct = value?.role === "ADMIN" ? products : value?.role === "BRAND" ? products?.filter((f) =>
      f?.brandId === value?._id) : products
    return (
        <>
            <Sidenav>
            <div className='flex justify-center'>
            <div className='md:w-full w-[260px]'>
                <StockList data={data} products={filterProduct} userData={user}  RefreshData={RefreshData}/>
                </div>
                </div>
            </Sidenav>
        </>
    )
}

export default Stock