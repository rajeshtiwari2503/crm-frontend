"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '../../../../http-request'
import ComplaintNatureList from './complaintNatureList'
import { useUser } from '@/app/components/UserContext'

const ComplaintNature = () => {
  const [complaintNature, setComplaintNature] = useState([])
  const [product, setProduct] = useState([])
  const [refresh, setRefresh] = useState("")
  const [userData, setUserData] = useState(null)

  const { user } = useUser();


  useEffect(() => {

    if (user) {
      setUserData(user);
    }
    getAllComplaintNature()
    getAllProduct()
  }, [refresh,user])

  const getAllComplaintNature = async () => {
    let response = await http_request.get("/getAllProduct")
    let { data } = response;

    setProduct(data)
  }
  const getAllProduct = async () => {
    let response = await http_request.get("/getAllComplaintNature")
    let { data } = response;

    setComplaintNature(data)
  }

  const filterData = userData?.user.role === "ADMIN" ? complaintNature : userData?.user.role === "BRAND" ? complaintNature?.filter((f) =>
    f?.brandId === userData?.user?._id) : complaintNature

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const filterProduct = userData?.user.role === "ADMIN" ? product : userData?.user.role === "BRAND" ? product?.filter((f) =>
    f?.brandId === userData?.user?._id) : product
  const RefreshData = (data) => {
    setRefresh(data)
  }
  return (
    <>
      <Sidenav>

        <ComplaintNatureList product={filterProduct} data={data} RefreshData={RefreshData} />
      </Sidenav>
    </>
  )
}

export default ComplaintNature