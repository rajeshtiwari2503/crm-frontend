 "use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import TransactionList from './TransactionList'
import http_request from '../../../../http-request'

 const transactions = ({}) => {

  const [transactions, setTransactions] = useState([]);
    const [value, setValue] = React.useState(null);
    const [refresh, setRefresh] = React.useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setValue(JSON.parse(storedValue));
        }
        getTransactions();
    }, [refresh]);

    

    const getTransactions = async () => {
        try {
            setLoading(true);
            const response = await http_request.get(`/bankDetailByUser/${value?.user?._id}`);
            setTransactions(response.data.reverse());
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
        <TransactionList RefreshData={RefreshData} data={transactions} value={value} />
    </Sidenav>
   )
 }
 
 export default transactions