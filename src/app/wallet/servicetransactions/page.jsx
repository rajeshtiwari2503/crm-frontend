"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '../../../../http-request'
import { useUser } from '@/app/components/UserContext'
import ServiceTransactionList from './serviceTransactionList'

const ServiceTransactions = ({ }) => {

  const [transactions, setTransactions] = useState([]);
 
  const [value, setValue] = React.useState(null);
 
  const [refresh, setRefresh] = React.useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();


  useEffect(() => {
    if (user?.user?._id) {
      setValue(user);
      getTransactions();
     
    }
     
  
   
  }, [refresh, user ]);

  
   
  const getTransactions = async () => {
    try {
      const endPoint = user?.user?.role === "ADMIN"||user?.user?.role === "EMPLOYEE" 
        ? `/getAllServicePayment` 
        : value?.user?.role === "BRAND" 
        ? `/getTransactionByBrandId/${user?.user?._id}` 
        : `/getTransactionByCenterId/${user?.user?._id}`;
  
      // console.log("endPoint", endPoint);
      setLoading(true);
      
      // Use endPoint variable correctly here
      const response = await http_request.get(endPoint);
      
      let { data } = response;
      
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const RefreshData = (data) => {
    setRefresh(data)
  }


  const transData =   transactions?.map((item, index) => ({ ...item, i: index + 1 })) 

// console.log("transData",transData);

  return (
    <Sidenav>
      <ServiceTransactionList RefreshData={RefreshData}   data={transData} loading={loading} value={value?.user } />
    </Sidenav>
  )
}

export default ServiceTransactions