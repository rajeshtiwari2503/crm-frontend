"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import StockList from './stockList'
const Stock = () => {
    const [stocks, setStocks] = useState([])
    const [products, setProducts] = useState([])

    const [refresh, setRefresh] = useState("")

    useEffect(() => {
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
  
    const data = stocks?.map((item, index) => ({ ...item, i: index + 1}));

    const RefreshData = (data) => {
      setRefresh(data)
    }

    return (
        <>
            <Sidenav>
               
                <StockList data={data} products={products} RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Stock