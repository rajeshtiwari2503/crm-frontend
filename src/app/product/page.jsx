"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../http-request'
import ProductList from './ProductList'
 


const Product = () => {
    const [brands, setBrands] = useState([])
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])

    const [refresh, setRefresh] = useState("")

    useEffect(() => {
      getAllProducts()
      getAllCategories()
      getAllSubCategories()
      getAllBrands()
    }, [refresh])
  
  
    const getAllProducts = async () => {
      try{
      let response = await http_request.get("/getAllProduct")
      let { data } = response;
  
      setProducts(data)
    }
    catch(err){
      console.log(err);
      
    }
  }


    const getAllCategories = async () => {
      try{
      let response = await http_request.get("/getAllProductCategory")
      let { data } = response;
  
      setCategories(data)
    }
    catch(err){
      console.log(err);
      
    }
  }
    const getAllSubCategories = async () => {
      try{
      let response = await http_request.get("/getAllSubCategory")
      let { data } = response;
  
      setSubCategories(data)
    }
    catch(err){
      console.log(err);
      
    }
  }


    const getAllBrands = async () => {
      try{
        let response = await http_request.get("/getAllBrand")
        let { data } = response;
    
        setBrands(data)
      }
     
      catch(err){
        console.log(err);
        
      }
    }
    const data = products 
   

    const RefreshData = (data) => {
      setRefresh(data)
    }

    

    return (
        <>
            <Sidenav>
               
                <ProductList subCategories={subCategories}categories={categories} brands={brands}  data={data}RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Product