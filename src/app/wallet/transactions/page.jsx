"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import TransactionList from './TransactionList'
import http_request from '../../../../http-request'
import { useUser } from '@/app/components/UserContext'

const transactions = ({ }) => {

  const [transactions, setTransactions] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [value, setValue] = React.useState(null);
  const [wallet, setWallet] = React.useState(null);
  const [refresh, setRefresh] = React.useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();


  useEffect(() => {

    if (user) {
      setValue(user);
     
    }
    if (value) {
      getTransactions();
      getWalletById()
      getWalletDetails()
    }
    
  }, [refresh, user]);

  const getWalletById = async () => {
    try {
      setLoading(true);

      let response = await http_request.get(`/getWalletByCenterId/${value?.user?._id}`);
      let { data } = response;
      setWallet(data)
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const getWalletDetails = async () => {
    try {

      setLoading(true);
      const response = await http_request.get(`/bankDetailByUser/${value?.user?._id}`);
      const { data } = response
      setBankDetails(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  const getTransactions = async () => {
    try {
      const endPoint = value?.user?.role === "ADMIN" 
        ? `/getAllTransaction` 
        : value?.user?.role === "BRAND" 
        ? `/getTransactionByBrandId/${value?.user?._id}` 
        : `/getTransactionByCenterId/${value?.user?._id}`;
  
      console.log("endPoint", endPoint);
      setLoading(true);
      
      // Use endPoint variable correctly here
      const response = await http_request.get(endPoint);
      
      let { data } = response;
      console.log("data", data);
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
      <TransactionList RefreshData={RefreshData} wallet={wallet} bankDetails={bankDetails} data={transData} loading={loading} value={value?.user } />
    </Sidenav>
  )
}

export default transactions