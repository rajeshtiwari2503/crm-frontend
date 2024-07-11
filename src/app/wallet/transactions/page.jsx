 "use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import TransactionList from './TransactionList'
import http_request from '../../../../http-request'

 const transactions = ({}) => {

  const [transactions, setTransactions] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
    const [value, setValue] = React.useState(null);
    const [wallet, setWallet] = React.useState(null);
    const [refresh, setRefresh] = React.useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setValue(JSON.parse(storedValue));
        }
        getTransactions();
        getWalletById()
        getWalletDetails()
    }, [refresh]);

    const getWalletById = async () => {
        try {
            setLoading(true);
            const storedValue = localStorage.getItem("user");
           const userD=JSON.parse(storedValue)
          let response = await http_request.get(`/getWalletByCenterId/${userD?.user?._id}`);
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
            const storedValue = localStorage.getItem("user");
            const value1 = (JSON.parse(storedValue));
            setLoading(true);
            const response = await http_request.get(`/bankDetailByUser/${value1?.user?._id}`);
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
            setLoading(true);
            const response = await http_request.get(`/bankDetailByUser/${value?.user?._id}`);
            let {data}=response
            setTransactions( data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };
    const RefreshData = (data) => {
        setRefresh(data)
      }

     
   return (
    <Sidenav>
        <TransactionList RefreshData={RefreshData}wallet={wallet}bankDetails={bankDetails} data={transactions} loading={loading} value={value} />
    </Sidenav>
   )
 }
 
 export default transactions