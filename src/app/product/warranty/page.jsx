"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import WarrantyList from './WarrantyList'
import ProductWarrantyPage from './paginationWithWarrantyList'

const Warranty = () => {
    const [warranty, setWarranty] = useState([])
    const [product, setProduct] = useState([])
    const [brand, setBrand] = useState([])

    const [refresh, setRefresh] = useState("")
    const [user, setUser] = useState(null)

    useEffect(() => {
      getAllwarranty()
      getAllProduct()
      getAllBrand()
    }, [refresh])
  
  
    const getAllwarranty = async () => {
      const storedValue = localStorage.getItem("user");
      const user=JSON.parse(storedValue)
      setUser(user?.user)
      const reqData=user?.user?.role==="ADMIN"?"/getAllProductWarranty" :`/getAllProductWarrantyById/${user?.user?._id}`
      let response = await http_request.get(reqData)
      let { data } = response;
  
      setWarranty (data?.data)
    }
    const getAllProduct = async () => {
      const storedValue = localStorage.getItem("user");
      const user=JSON.parse(storedValue)
      setUser(user?.user)
        let response = await http_request.get("/getAllProduct")
        let { data } = response;
    
        setProduct (data)
      }

      const getAllBrand = async () => {
        let response = await http_request.get("/getAllBrand")
        let { data } = response;
    
        setBrand (data)
      }
    const data = warranty?.map((item, index) => ({ ...item, i: index + 1}));
 
    const RefreshData = (data) => {
      setRefresh(data)
    }

    return (
        <>
            <Sidenav>
               
                {/* <WarrantyList data={data}brand={brand}product={product}user={user} RefreshData={RefreshData}/> */}
                <ProductWarrantyPage brand={brand}product={product}user={user} RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Warranty