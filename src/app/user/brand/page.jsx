
"use client"
import React, { useEffect, useState } from 'react'
import BrandList from './brandList'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import { ReactLoader } from '@/app/components/common/Loading';
import { useUser } from '@/app/components/UserContext';


const Brand = () => {

  const [brands, setBrands] = useState([])
  const [refresh, setRefresh] = useState("")

  const [value, setValue] = React.useState(null);
 const { user } = useUser();
//  console.log("brand",user);
 
  useEffect(() => {
     
    if (user) {
        setValue(user);
    }
    getAllBrand()

  }, [refresh,user])

  const getAllBrand = async () => {
    try {
      let response = await http_request.get("/getAllBrand")
      let { data } = response;

      setBrands(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const data = brands?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
         <BrandList userData={value?.user} data={data} RefreshData={RefreshData} />
        
      </>
    </Sidenav>
  )
}

export default Brand