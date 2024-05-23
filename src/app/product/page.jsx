"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../http-request'
import ProductList from './ProductList'
 


const Product = () => {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    const [refresh, setRefresh] = useState("")

    useEffect(() => {
      getAllProducts()
      getAllCategories()
    }, [refresh])
  
  
    const getAllProducts = async () => {
      let response = await http_request.get("/getAllProduct")
      let { data } = response;
  
      setProducts(data)
    }
    const getAllCategories = async () => {
      let response = await http_request.get("/getAllProductCategory")
      let { data } = response;
  
      setCategories(data)
    }
    const data = products?.map((item, index) => ({ ...item, i: index + 1}));

    const RefreshData = (data) => {
      setRefresh(data)
    }


    return (
        <>
            <Sidenav>
               
                <ProductList categories={categories} data={data}RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Product