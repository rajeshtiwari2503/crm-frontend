"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import BankDetailsList from './BankDetailsList'
 
 
 
 const BankDetails = () => {
    const [brandDetails, setBrandDetails] = useState();
    const [walletDetails, setWalletDetails] = useState([]);
   
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getBrandDetails();
        getWalletDetails();
    }, []);

    const getBrandDetails = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            const response = await http_request.get(`/getBrandBy/${user?._id}`);
            setBrandDetails(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const getWalletDetails = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            const response = await http_request.get(`/getWalletTransaction/${user?._id}`);
            setWalletDetails(response.data.reverse());
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };
   return (
    <Sidenav>
        <BankDetailsList />
    </Sidenav>
   )
 }
 
 export default BankDetails