"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import BankDetailsList from './BankDetailsList'
import http_request from '../../../../http-request'


const BankDetails = () => {
    const [bankDetails, setBankDetails] = useState([]);
    const [value, setValue] = React.useState(null);
    const [refresh, setRefresh] = React.useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setValue(JSON.parse(storedValue));
        }
        getWalletDetails();
    }, [refresh]);



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
    const RefreshData = (data) => {
        setRefresh(data)
    }
    return (
        <Sidenav>
            <BankDetailsList RefreshData={RefreshData} data={bankDetails} value={value} />
        </Sidenav>
    )
}

export default BankDetails