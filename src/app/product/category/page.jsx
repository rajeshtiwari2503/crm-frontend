"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import CategoryList from './categoryList'
import http_request from '.././../../../http-request'
import { ReactLoader } from '@/app/components/common/Loading'
const Category = () => {
  const [categories, setCategories] = useState([])
  const [refresh, setRefresh] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories()
  }, [refresh])

  const getAllCategories = async () => {
    try {
      setLoading(true); // 👈 Start loading
      const response = await http_request.get("/getAllProductCategory");
      const { data } = response;
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false); // 👈 Stop loading
    }
  };
  const RefreshData = (data) => {
    setRefresh(data)
  }

  const data = categories?.map((item, index) => ({ ...item, i: index + 1 }));

  return (
    <>
      <Sidenav>
        {loading ? (
          <div className="flex justify-center items-center  h-[80vh]">
            <ReactLoader />
          </div>
        ) : (
          <CategoryList data={data} RefreshData={RefreshData} />
        )}
      </Sidenav>
    </>
  )
}

export default Category