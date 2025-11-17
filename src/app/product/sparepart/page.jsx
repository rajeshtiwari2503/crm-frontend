"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import SparepartList from './sparepartList'
import { useUser } from '@/app/components/UserContext'
import { ReactLoader } from '@/app/components/common/Loading'
const Sparepart = () => {
  const [spareparts, setSpareparts] = useState([])

  const [refresh, setRefresh] = useState("")
  const [userData, setUserData] = useState(null)
 const [loading, setLoading] = useState(false)
  const { user } = useUser();


  useEffect(() => {

    if (user) {
      setUserData(user);
    }
    getAllSpareparts()
  }, [refresh, user])


  const getAllSpareparts = async () => {
    setLoading(true); // Start loading
    try {
      let response = await http_request.get("/getAllSparepart");
      let { data } = response;
      setSpareparts(data);
    } catch (err) {
      console.error("Failed to fetch spare parts:", err);
    } finally {
      setLoading(false); // End loading
    }
  };
  const filterData = userData?.user.role === "ADMIN" ? spareparts : userData?.user.role === "BRAND" ? spareparts?.filter((f) =>
    f?.brandId === userData?.user?._id) : userData?.user.role === "BRAND EMPLOYEE" ? spareparts?.filter((f) =>
      f?.brandId === userData?.user?.brandId) : []

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

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
          <SparepartList data={data} RefreshData={RefreshData} />
        )}
      </Sidenav>
    </>
  )
}

export default Sparepart