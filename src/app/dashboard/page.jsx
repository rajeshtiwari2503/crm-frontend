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
import TechnicianDashboard from './technicianDashboard'
import { useUser } from '../components/UserContext'


const Dashboard = () => {
  const { user } = useUser();
  const [value, setValue] = React.useState(user);
  const [dashData, setData] = React.useState("");
 
   
  
  React.useEffect(() => {
   
    if (user) {
      setValue(user);
      if(user?.user.role === "EMPLOYEE" ){
        getAllEmpDashboard()
      
       } else{
        getAllDashboard()
       }
       
      
    }
    
  }, [user]);


  const getAllEmpDashboard = async () => {
    try {
      
      let response = await http_request.post("/dashboardDetailsByEmployeeStateZone", { stateZone: user?.user?.stateZone,brand:user?.user?.brand }); // ✅ Send POST request with body
      let { data } = response;
      console.log(data);
  
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllDashboard = async () => {
    
    try {
    
      const endPoint=user?.user.role==="ADMIN"||user?.user.role==="EMPLOYEE"? "/dashboardDetails"
      :user?.user.role==="DEALER"?`/dashboardDetailsByDealerId/${user?.user?._id}`
      :user?.user.role==="BRAND"?`/dashboardDetailsByBrandId/${user?.user?._id}`
      :user?.user.role==="BRAND EMPLOYEE"?`/dashboardDetailsByBrandId/${user?.user?.brandId}`
      :user?.user.role==="USER"?`/dashboardDetailsByUserId/${user?.user?._id}`
      :user?.user.role==="TECHNICIAN"?`/dashboardDetailsByTechnicianId/${user?.user?._id}`
      :user?.user.role==="SERVICE"?`/dashboardDetailsBySeviceCenterId/${user?.user?._id}`
      :""
      let response = await http_request.get(endPoint)
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
        {value?.user?.role === "ADMIN" ?
          <AdminDashboard dashData={dashData} userData={value?.user} />
          : value?.user?.role === "BRAND"|| value?.user?.role === "BRAND EMPLOYEE"  ?
            <BrandDashboard dashData={dashData} userData={value?.user} />
            : value?.user?.role === "SERVICE" ?
              <ServiceDashboard dashData={dashData} userData={value?.user} />
              : value?.user?.role === "EMPLOYEE" ?
                <EmployeeDashboard dashData={dashData} userData={value?.user} />
                : value?.user?.role === "USER" ?
                  <UserDashboard dashData={dashData} userData={value?.user} />
                  : value?.user?.role === "TECHNICIAN" ?
                    <TechnicianDashboard dashData={dashData} userData={value?.user} />
                    : value?.user?.role === "DEALER" ?
                      <DealerDashboard dashData={dashData} userData={value?.user} /> : ""
        }
      </>
    </Sidenav>
  )
}

export default Dashboard