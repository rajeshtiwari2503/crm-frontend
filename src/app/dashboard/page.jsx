"use client"
import React from 'react'
import Sidenav from '../components/Sidenav'
import AdminDashboard from './adminDashboard'
import BrandDashboard from './brandDashboard'
import ServiceDashboard from './serviceDashboard'
import EmployeeDashboard from './employeeDashboard'
import UserDashboard from './userDashboard'
import DealerDashboard from './deallerDashboard'


const Dashboard = () => {

  const [value, setValue] = React.useState(null);

  React.useEffect(() => {
    const storedValue = localStorage.getItem("user");
    if (storedValue) {
      setValue(JSON.parse(storedValue));
    }
  }, []);


  return (
    <Sidenav  >
      <>
      {value?.user?.role==="ADMIN" ?
       <AdminDashboard />
       : value?.user?.role==="BRAND" ?
       <BrandDashboard />  
       : value?.user?.role==="SERVICE" ?
       <ServiceDashboard />
       : value?.user?.role==="EMPLOYEE" ?
       <EmployeeDashboard />
       :value?.user?.role==="USER" ?
       <UserDashboard />
       :value?.user?.role==="TECHNICIAN" ?
       <UserDashboard />
       :value?.user?.role==="DEALER" ?
       <DealerDashboard />:""
  }
      </>
    </Sidenav>
  )
}

export default Dashboard