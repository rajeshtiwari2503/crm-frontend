"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import CategoryList from './categoryList'
import http_request from '.././../../../http-request'
const Category = () => {
  const [categories, setCategories] = useState([])
  const [refresh, setRefresh] = useState("")

  useEffect(() => {
    getAllCategories()
  }, [refresh])

  const getAllCategories = async() => {
    let response = await http_request.get("/getAllProductCategory")
    let { data } = response;

    setCategories(data)
  }
  const RefreshData = (data) => {
    setRefresh(data)
  }

  const data = categories?.map((item, index) => ({ ...item, i: index + 1 }));

  return (
    <>
      <Sidenav>

        <CategoryList data={data} RefreshData={RefreshData}/>
      </Sidenav>
    </>
  )
}

export default Category