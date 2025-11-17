
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import DealerList from './dealerList';
import { useUser } from '@/app/components/UserContext';
import { ReactLoader } from '@/app/components/common/Loading';
 


const Dealer = () => {

  const [dealers, setDealers] = useState([])
  const [refresh, setRefresh] = useState("")
const [loading, setLoading] = useState(true);

  const [value, setValue] = React.useState(null);
 const { user } = useUser();
  
 
  useEffect(() => {
   
    if (user) {
        setValue(user);
    }
    getAllDealers()
  }, [refresh,user])

  const getAllDealers = async () => {
    try {
      let response = await http_request.get("/getAllDealer")
      let { data } = response;

      setDealers(data)
       setLoading(false);
    }
    catch (err) {
      console.log(err);
       setLoading(false);
    }
  }

  // const data = dealers?.map((item, index) => ({ ...item, i: index + 1 }));
  const filData=value?.user?.role==="BRAND"?dealers?.filter((f)=>f?.brandId===value?.user?._id):dealers
  const data = filData?.map((item, index) => ({ ...item, i: index + 1 }));
  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
       {loading ? (
              <div className="flex justify-center items-center  h-[80vh]">
                <ReactLoader />
              </div>
            ) : (
      <>
       <DealerList data={data}user={value?.user} RefreshData={RefreshData} />
        
      </>)}
    </Sidenav>
  )
}

export default Dealer