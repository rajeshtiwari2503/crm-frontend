"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import StockList from './stockList'
const Stock = () => {
    const [stocks, setStocks] = useState([])
    const [products, setProducts] = useState([])

    const [refresh, setRefresh] = useState("")
    const [value, setValue] = useState(null)

    useEffect(() => {
      const storedValue = localStorage.getItem("user");
      const userType = JSON.parse(storedValue)
      setValue(userType?.user)
      getAllStocks()
      getAllProducts()
    }, [refresh])
  
  
    const getAllStocks = async () => {
      let response = await http_request.get("/getAllStock")
      let { data } = response;
  
      setStocks (data)
    }
    const getAllProducts = async () => {
      let response = await http_request.get("/getAllSparepart")
      let { data } = response;
  
      setProducts (data)
    }
  const filteData=value?.role==="ADMIN"?stocks:value?.role==="BRAND"?stocks?.filter((f)=>f?.brandId===value?._id):
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
               
                <StockList data={data} products={filterProduct}  RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Stock