"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '../../../../../../http-request'
import SubCategoryList from '../subCategoryList'
import { ReactLoader } from '@/app/components/common/Loading'

const SubCategory = ({ params }) => {
  const [categories, setCategories] = useState(null)
  const [subCategories, setSubCategories] = useState([])
  const [refresh, setRefresh] = useState("")
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSubCategories()
    getCategoryById()
  }, [refresh])

  const getAllSubCategories = async () => {
    try {
      setLoading(true);
      let response = await http_request.get(`/getSubCategoryByCateId/${params.id}`)
      let { data } = response;

      setSubCategories(data)
      setLoading(false);
    }
    catch (err) {
      console.log(err);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }
  const getCategoryById = async () => {
    try {
      let response = await http_request.get(`/getProductCategory/${params.id}`)
      let { data } = response;

      setCategories(data)
    }
    catch (err) {
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
        {loading ? (
          <div className="flex justify-center items-center  h-[80vh]">
            <ReactLoader />
          </div>
        ) : (
          <SubCategoryList data={data} category={categories} RefreshData={RefreshData} />
        )}
      </Sidenav>
    </>
  )
}

export default SubCategory