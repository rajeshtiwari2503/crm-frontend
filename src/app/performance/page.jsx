"use client"
import React from 'react'
import Sidenav from '../components/Sidenav'
 
import http_request from "../../../http-request"
import TechnicianDashboard from '../dashboard/technicianDashboard'
 


const Performance = () => {

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
    const storedValue = localStorage.getItem("user");
    const user1 = JSON.parse(storedValue);
    try {
    
      const endPoint=user1?.user.role==="ADMIN"? "/dashboardDetails"
      :user1?.user.role==="DEALER"?`/dashboardDetailsByDealerId/${user1?.user?._id}`
      :user1?.user.role==="BRAND"?`/dashboardDetailsByBrandId/${user1?.user?._id}`
      :user1?.user.role==="USER"?`/dashboardDetailsByUserId/${user1?.user?._id}`
      :user1?.user.role==="TECHNICIAN"?`/dashboardDetailsByTechnicianId/${user1?.user?._id}`
      :user1?.user.role==="SERVICE"?`/dashboardDetailsBySeviceCenterId/${user1?.user?._id}`
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
        { 
                   value?.user?.role === "TECHNICIAN" ?
                    <TechnicianDashboard performance={true} dashData={dashData} userData={value?.user} />
                      : ""
        }
      </>
    </Sidenav>
  )
}

export default Performance