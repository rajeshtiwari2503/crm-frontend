
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

 const { user } = useUser();
   // console.log("usercancel",user,value);
   
   
     useEffect(() => {
   
       if (user) {
         setValue(user)
       }
    getAllComplaint()
    getAllTechnician()
    getAllSparepart()
    
  }, [refresh,user])
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
  // const sortData = complaint?.filter((f1) => f1?.status ==="FINAL VERIFICATION")
  const data = complaint?.map((item, index) => ({ ...item, i: index + 1 }));



  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
        <VerificationComplaintList  sparepart={sparepart} data={data}technicians={techData}userData={value?.user} RefreshData={RefreshData} />
        {/* <PincodeDistanceCalculator /> */}
      </>
    </Sidenav>
  )
}

export default Verification