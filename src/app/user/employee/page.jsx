
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav'
import { ReactLoader } from '@/app/components/common/Loading';
import EmployeeList from './employeeList';
import { useUser } from '@/app/components/UserContext';
 


const Employee = () => {

  const [employees, setEmployees] = useState([])
  const [refresh, setRefresh] = useState("")
const { user } = useUser()
  useEffect(() => {
    getAllEmployees()

  }, [refresh,user])

  const getAllEmployees = async () => {
    try {
      let response = await http_request.get("/getAllEmployee")
      let { data } = response;

      setEmployees(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  const data1 = user?.user?.role==="ADMIN"? employees
  :employees?.filter((f)=>f?.brandId===user?.user?._id)
const data=data1?.map((item, index) => ({ ...item, i: index + 1 }))
  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <Sidenav>
      <Toaster />
      <>
      <EmployeeList data={data} user={user?.user} RefreshData={RefreshData} />
       
      </>
    </Sidenav>
  )
}

export default Employee