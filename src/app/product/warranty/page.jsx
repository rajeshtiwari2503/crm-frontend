"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../../http-request'
import WarrantyList from './WarrantyList'
import ProductWarrantyPage from './paginationWithWarrantyList'
import { useUser } from '@/app/components/UserContext'

const Warranty = () => {
    const [warranty, setWarranty] = useState([])
    const [product, setProduct] = useState([])
    const [brand, setBrand] = useState([])

    const [refresh, setRefresh] = useState("")
    const [value, setUser] = useState(null)

   const { user } = useUser();
           
          
           useEffect(() => {
            
             if (user) {
              setUser(user)
              // getAllwarranty()
             }
     
      getAllProduct()
      getAllBrand()
    }, [refresh,user])
  
  
    // const getAllwarranty = async () => {
      
    //   try{

    
    //   const reqData=value?.user?.role==="ADMIN"?"/getAllProductWarranty" :`/getAllProductWarrantyById/${value?.user?._id}`
    //   let response = await http_request.get(reqData)
    //   let { data } = response;
  
    //   setWarranty (data?.data)
    //   }
    //   catch(err){
    //     console.log(err);
        
    //   }
    // }
    const getAllProduct = async () => {
      
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
                <ProductWarrantyPage brand={brand}product={product}user={value} RefreshData={RefreshData}/>
            </Sidenav>
        </>
    )
}

export default Warranty