"use client"
import React from 'react'
import Sidenav from '../components/Sidenav'
import AdminDashboard from './adminDashboard'
import BrandDashboard from './brandDashboard'
import ServiceDashboard from './serviceDashboard'
import EmployeeDashboard from './employeeDashboard'
import UserDashboard from './userDashboard'
import DealerDashboard from './deallerDashboard'
import http_request from "../../../http-request"


const Dashboard = () => {

  const [value, setValue] = React.useState(null);
  const [dashData, setData] = React.useState("");

  React.useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
    getAllDashboard()
  }, []);

  const getAllDashboard = async () => {
    try {
      let response = await http_request.get("/dashboardDetails")
      let { data } = response;

      setData(data)
    }
    catch (err) {
      console.log(err);
    }
  }
 

  return (
    <Sidenav  >
      <>
      {value?.user?.role==="ADMIN" ?
       <AdminDashboard  dashData={dashData} userData={value?.user} />
       : value?.user?.role==="BRAND" ?
       <BrandDashboard dashData={dashData}userData={value?.user}/>  
       : value?.user?.role==="SERVICE" ?
       <ServiceDashboard dashData={dashData} userData={value?.user}/>
       : value?.user?.role==="EMPLOYEE" ?
       <EmployeeDashboard dashData={dashData} userData={value?.user}/>
       :value?.user?.role==="USER" ?
       <UserDashboard dashData={dashData} userData={value?.user}/>
       :value?.user?.role==="TECHNICIAN" ?
       <UserDashboard dashData={dashData} userData={value?.user}/>
       :value?.user?.role==="DEALER" ?
       <DealerDashboard dashData={dashData} userData={value?.user}/>:""
  }
      </>
    </Sidenav>
  )
}

export default Dashboard