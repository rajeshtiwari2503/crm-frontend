"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../http-request'

import RechargeList from './RechargeList'
import { useUser } from '../components/UserContext'

const Recharge = (props) => {
  const [recharge, setRecharge] = useState([])
  const [product, setProduct] = useState([])

  const [refresh, setRefresh] = useState("")
   const { user } = useUser();
  const [userData, setUserData] = React.useState(null);
  useEffect(() => {
    
    if (user) {
      setUserData(user);
    }
    getAllRecharge()
    getAllProduct()
  }, [refresh,user])


  const getAllRecharge = async () => {
    let response = await http_request.get("/getAllRecharge")
    let { data } = response;
    // console.log(data);

    setRecharge(data)
  }
  const getAllProduct = async () => {
    let response = await http_request.get("/getAllProduct")
    let { data } = response;

    setProduct(data)
  }
  const filterData = userData?.user?.role === "ADMIN" ? recharge : recharge?.filter((f) => f?.brandId === userData?.user?._id)

  const data = filterData;

  const RefreshData = (data) => {
    setRefresh(data)
  }
console.log("page ",filterData);

  return (
    <>
      {props?.sidebar === false ?


        <RechargeList data={data} brandData={props?.brandData} product={product} RefreshData={RefreshData} />

        :
        <Sidenav>

          <RechargeList data={data} userData={userData?.user} brandData={props?.brandData} product={product} RefreshData={RefreshData} />
        </Sidenav>
      }
    </>
  )
}

export default Recharge