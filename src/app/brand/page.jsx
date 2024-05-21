
"use client"
import React, { useEffect, useState } from 'react'
import Sidenav from '../components/Sidenav'
import BrandList from './brandList'
import http_request from "../../../http-request"
import { ReactLoader } from '../components/common/Loading'
import { Toaster } from 'react-hot-toast';


const Brand = () => {

  const [brands, setBrands] = useState([])

  useEffect(() => {
    getAllBrand()
  }, [])

  const getAllBrand = async () => {
    let response = await http_request.get("/getAllBrand")
    let { data } = response;

    setBrands(data)
  }

  const data = brands?.map((item, index) => ({ ...item, i: index + 1}));

  return (
    <Sidenav>
      <Toaster />
      <>
        {brands.length > 0 ? <BrandList data={data}/>
          :<ReactLoader />  
        }
      </>
    </Sidenav>
  )
}

export default Brand