"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '../../../../http-request'
import ComplaintNatureList from './complaintNatureList'
import { useUser } from '@/app/components/UserContext'
import { ReactLoader } from '@/app/components/common/Loading'

const ComplaintNature = () => {
  const [complaintNature, setComplaintNature] = useState([])
  const [product, setProduct] = useState([])
  const [refresh, setRefresh] = useState("")
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useUser();


  useEffect(() => {

    if (user) {
      setUserData(user);
    }
    getAllComplaintNature()
    getAllProduct()
  }, [refresh, user])

  useEffect(() => {
  if (user) setUserData(user);
  fetchData();
}, [refresh, user]);

const fetchData = async () => {
  setLoading(true);
  await Promise.all([getAllComplaintNature(), getAllProduct()]);
  setLoading(false);
};
   
const getAllComplaintNature = async () => {
  try {
    const response = await http_request.get("/getAllComplaintNature");
    const { data } = response;
    setComplaintNature(data);
  } catch (err) {
    console.error("Error fetching complaint natures", err);
  }
};

const getAllProduct = async () => {
  try {
    const response = await http_request.get("/getAllProduct");
    const { data } = response;
    setProduct(data);
  } catch (err) {
    console.error("Error fetching products", err);
  }
};


  const filterData = userData?.user.role === "ADMIN" ? complaintNature : userData?.user.role === "BRAND" ? complaintNature?.filter((f) =>
    f?.brandId === userData?.user?._id) : userData?.user.role === "BRAND EMPLOYEE" ? complaintNature?.filter((f) =>
      f?.brandId === userData?.user?.brandId) : []

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const filterProduct = userData?.user.role === "ADMIN" ? product : userData?.user.role === "BRAND" ? product?.filter((f) =>
    f?.brandId === userData?.user?._id) : userData?.user.role === "BRAND EMPLOYEE" ? product?.filter((f) =>
      f?.brandId === userData?.user?.brandId) : []
  const RefreshData = (data) => {
    setRefresh(data)
  }
  return (
    <>
      <Sidenav>
        {loading ? (
          <div className="flex justify-center items-center  h-[80vh]">
            <ReactLoader />
          </div>
        ) : (
          <ComplaintNatureList product={filterProduct} data={data} RefreshData={RefreshData} />
        )}
      </Sidenav>
    </>
  )
}

export default ComplaintNature