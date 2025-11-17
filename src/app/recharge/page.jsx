"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../http-request'

import RechargeList from './RechargeList'
import { useUser } from '../components/UserContext'
import { ReactLoader } from '../components/common/Loading'

const Recharge = (props) => {
  const [recharge, setRecharge] = useState([])
  const [product, setProduct] = useState([])
  const [loading, setLoading] = useState(true);

  const [refresh, setRefresh] = useState("")
  const { user } = useUser();
  const [userData, setUserData] = React.useState(null);
  const [brandData, setBrandData] = useState([]);
  // useEffect(() => {

  //   if (user) {
  //     setUserData(user);
  //   }
  //   getAllRecharge()
  //   getAllProduct()
  //   getAllProductWarrantyByBrandStickers()
  // }, [refresh, user])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // your API calls
        await getAllRecharge();
        await getAllProduct();
        await getAllProductWarrantyByBrandStickers();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      setUserData(user);
      fetchData();
    }
  }, [refresh, user]);

  const getAllProductWarrantyByBrandStickers = async () => {
    try {
      let response = await http_request.get("/getAllProductWarrantyByBrandStickers")
      let { data } = response;
      // console.log("data", data);

      setBrandData(data?.data)
    }
    catch (err) {
      console.log(err);

    }
  }
  const brandStickers = brandData?.find((f) => f?.brandId === user?.user?._id)

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
  // console.log("page ", brandStickers);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <ReactLoader />
      </div>
    );
  }
  return (
    <>
      {props?.sidebar === false ?

        <div>
          {brandStickers ? ""
            : <RechargeList data={data} userData={userData?.user} brandData={props?.brandData} product={product} RefreshData={RefreshData} />

          }
        </div>
        :
        <Sidenav>

          <RechargeList data={data} userData={userData?.user} brandData={props?.brandData} product={product} RefreshData={RefreshData} />
        </Sidenav>
      }
    </>
  )
}

export default Recharge