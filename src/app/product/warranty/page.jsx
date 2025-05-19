"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import WarrantyList from './WarrantyList'
import ProductWarrantyPage from './paginationWithWarrantyList'
import { useUser } from '@/app/components/UserContext'
import { ReactLoader } from '@/app/components/common/Loading'

const Warranty = () => {
  const [warranty, setWarranty] = useState([])
  const [product, setProduct] = useState([])
  const [brand, setBrand] = useState([])
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState("")
  const [value, setUser] = useState(null)

  const { user } = useUser();


  // useEffect(() => {

  //   if (user) {
  //     setUser(user?.user)
  //     // getAllwarranty()
  //   }

  //   getAllProduct()
  //   getAllBrand()
  // }, [refresh, user])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [refresh, user])

  const fetchData = async () => {
    setLoading(true)
    try {
      await Promise.all([

        getAllProduct(),
        getAllBrand()
      ])
    } catch (err) {
      console.error("Error fetching warranty data:", err)
    }
    setLoading(false)
  }


  const getAllProduct = async () => {

    let response = await http_request.get("/getAllProduct")
    let { data } = response;

    setProduct(data)
  }

  const getAllBrand = async () => {
    let response = await http_request.get("/getAllBrand")
    let { data } = response;

    setBrand(data)
  }
  const data = warranty?.map((item, index) => ({ ...item, i: index + 1 }));

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

          <ProductWarrantyPage brand={brand} product={product} user={value} RefreshData={RefreshData} />
        )}
      </Sidenav>
    </>
  )
}

export default Warranty