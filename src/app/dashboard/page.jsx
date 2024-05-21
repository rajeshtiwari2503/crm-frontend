"use client"
import React from 'react'
import Sidenav from '../components/Sidenav'
import AdminDashboard from './adminDashboard'
import BrandDashboard from './brandDashboard'
import ServiceDashboard from './serviceDashboard'
import EmployeeDashboard from './employeeDashboard'


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
       :""
  }
      </>
    </Sidenav>
  )
}

export default Dashboard