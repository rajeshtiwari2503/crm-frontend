"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import SubCategoryList from '../../subCategory/SubCategoryList'
import http_request from '../../../../../../http-request'

const SubCategory = ({params}) => {
  const [categories, setCategories] = useState(null)
  const [subCategories, setSubCategories] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllSubCategories()
    getCategoryById()
  }, [refresh])

  const getAllSubCategories = async() => {
    try{
        let response = await http_request.get(`/getSubCategoryByCateId/${params.id}`)
        let { data } = response;
    
        setSubCategories(data)
    }
  catch(err){
    console.log(err);
    
  }
}
  const getCategoryById = async() => {
    try{
        let response = await http_request.get(`/getProductCategory/${params.id}`)
        let { data } = response;
    
        setCategories(data)
    }
  catch(err){
    console.log(err);
    
  }
  }
  const RefreshData = (data) => {
    setRefresh(data)
  }

  const data = subCategories?.map((item, index) => ({ ...item, i: index + 1 }));
//  console.log("ggyyty",categories);
 
  return (
    <>
      <Sidenav>

        <SubCategoryList data={data}category={categories} RefreshData={RefreshData}/>
      </Sidenav>
    </>
  )
}

export default SubCategory