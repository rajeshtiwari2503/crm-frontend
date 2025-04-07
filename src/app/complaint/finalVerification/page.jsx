
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import VerificationComplaintList from './verificationComplaintList';
import PincodeDistanceCalculator from './Distance';
import { useUser } from '@/app/components/UserContext';
 



const Verification = () => {

  const [complaint, setComplaint] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [sparepart, setSparepart] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);
const [transactions, setTransactions] = useState([]);

 const { user } = useUser();
   // console.log("usercancel",user,value);
   
   
     useEffect(() => {
   
       if (user) {
         setValue(user)
       }
    getAllComplaint()
    getAllTechnician()
    getAllSparepart()
    getTransactions()
  }, [refresh,user])

  const getTransactions = async () => {
    try {
      const endPoint = user?.user?.role === "ADMIN"||user?.user?.role === "EMPLOYEE" 
        ? `/getAllServicePayment` 
        : value?.user?.role === "BRAND" 
        ? `/getTransactionByBrandId/${user?.user?._id}` 
        : `/getTransactionByCenterId/${user?.user?._id}`;
   
      const response = await http_request.get(endPoint);
      
      let { data } = response;
      
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }  
  };
  
  const getAllComplaint = async () => {
    try {
      let response = await http_request.get("/getComplaintsByFinalVerification")
      let { data } = response;

      setComplaint(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const getAllTechnician = async () => {
    try {
      let response = await http_request.get("/getAllService")
      let { data } = response;

      setTechnicians(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const getAllSparepart = async () => {
    try {
      let response = await http_request.get("/getAllSparePart")
      let { data } = response;

      setSparepart(data)
    }
    catch (err) {
      console.log(err);
    }
  }
  const techData =value?.user?.role==="SERVICE"? technicians?.filter((f1) => f1?.serviceCenterId ===value?.user?._id):technicians

  // Final Verification
  // const sortData = user?.user?.role==="EMPLOYEE"?complaint?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):complaint;

  const selectedBrandIds = user?.user?.brand?.map(b => b.value) || [];
  const hasStateZone = user?.user?.stateZone?.length > 0;
  const hasBrand = selectedBrandIds.length > 0;
  
  const sortData = user?.user?.role === "EMPLOYEE"
    ? complaint?.filter(f1 => {
        const matchState = hasStateZone ? user?.user?.stateZone.includes(f1?.state) : true;
        const matchBrand = hasBrand ? selectedBrandIds.includes(f1?.brandId) : true;
        return matchState && matchBrand;
      })
    : complaint;

    
  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));



  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <VerificationComplaintList  sparepart={sparepart} data={data}transactions={transactions} technicians={techData}userData={value?.user} RefreshData={RefreshData} />
        {/* <PincodeDistanceCalculator /> */}
      </>
    </Sidenav>
  )
}

export default Verification