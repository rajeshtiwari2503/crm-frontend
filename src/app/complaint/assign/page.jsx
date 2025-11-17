
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import AssignComplaintList from './assignComplaintList';
import { useUser } from '@/app/components/UserContext';
import { ReactLoader } from '@/app/components/common/Loading';



const Assign = () => {

  const [complaint, setComplaint] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [sparepart, setSparepart] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);
  const [loading, setloading] = React.useState(false);

  const { user } = useUser()
  useEffect(() => {
    getAllComplaint()
    getAllTechnician()
    getAllSparepart()
    if (user) {
      setValue(user);
    }
  }, [refresh, user])
  const getAllComplaint = async () => {
    try {
      setloading(true)
      let response = await http_request.get("/getComplaintsByAssign")
      let { data } = response;

      setComplaint(data)
      setloading(false)
    }
    catch (err) {
      console.log(err);
      setloading(false)
    }
  }
  const getAllTechnician = async () => {
    try {
      let response = await http_request.get("/getAllTechnician")
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
  const techData = value?.user?.role === "SERVICE" ? technicians?.filter((f1) => f1?.serviceCenterId === value?.user?._id) : technicians


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
      {loading === true ? (
        <div className="flex items-center justify-center h-[80vh]">
          <ReactLoader />
        </div>
      ) : (
        <>
          <AssignComplaintList sparepart={sparepart} data={data} technicians={techData} userData={value?.user} RefreshData={RefreshData} />
        </>)}
    </Sidenav>
  )
}

export default Assign