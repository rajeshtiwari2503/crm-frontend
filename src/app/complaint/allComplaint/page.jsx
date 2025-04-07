
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import ComplaintList from './complaintList';
import { useUser } from '@/app/components/UserContext';
 



const Service = ({ dashboard }) => {

  const [complaint, setComplaint] = useState([])
  const [serviceCenter, setServiceCenter] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);
  const [page, setPage] = useState(1); // Default page
  const [limit, setLimit] = useState(5); // Items per page

  const [totalPages, setTotalPages] = React.useState(0);
  const { user } = useUser()
  useEffect(() => {
    getAllComplaint()
    getAllServiceCenter()

    if (user) {
      setValue(user);
    }
  }, [refresh, user, page, limit])

  // const getAllComplaint = async () => {
  //   try {
  //     let response = await http_request.get("/getAllComplaint")
  //     let { data } = response;
  //     setTotalPages(data?.totalComplaints || 0);
  //     setComplaint(data?.data)
  //   }
  //   catch (err) {
  //     console.log(err);
  //   }
  // }


  // const getAllComplaint = async () => {
  //   try {
  //     if (!user?.user?.role || !user?.user?._id) return; // Ensure role & ID exist

  //     let role = user.user.role;
  //     let id = user.user._id;

  //     // Construct query parameters based on role
  //     let queryParams = new URLSearchParams();

  //     if (role === "BRAND") queryParams.append("brandId", id);
  //     else if (role === "SERVICE") queryParams.append("serviceCenterId", id);
  //     else if (role === "TECHNICIAN") queryParams.append("technicianId", id);
  //     else if (role === "CUSTOMER") queryParams.append("userId", id);
  //     else if (role === "DEALER") queryParams.append("dealerId", id);

  //     let response = role==="ADMIN"||role==="EMPLOYEE"  ?await http_request.get("/getAllComplaint"):await http_request.get(`/getAllComplaintByRole?${queryParams.toString()}`);
  //     let { data } = response;

  //     setTotalPages(data?.totalComplaints || 0);
  //     setComplaint(data?.data);
  //   } catch (err) {
  //     console.error("Error fetching complaints:", err);
  //   }
  // };



  const getAllComplaint = async () => {
    try {
      if (!user?.user?.role || !user?.user?._id) return;

      let role = user.user.role;
      let id = user.user._id;

      let queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      if (role === "BRAND") queryParams.append("brandId", id);
      else if (role === "SERVICE") queryParams.append("serviceCenterId", id);
      else if (role === "TECHNICIAN") queryParams.append("technicianId", id);
      else if (role === "CUSTOMER") queryParams.append("userId", id);
      else if (role === "DEALER") queryParams.append("dealerId", id);

      let response =
        role === "ADMIN" || role === "EMPLOYEE"
          ? await http_request.get(`/getAllComplaint?page=${page}&limit=${limit}`)
          : await http_request.get(`/getAllComplaintByRole?${queryParams.toString()}`);

      let { data } = response;
      // console.log("data",data?.data);

      setTotalPages(Math.ceil((data?.totalComplaints || 0)));
      setComplaint(data?.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };







  const getAllServiceCenter = async () => {
    try {
      let response = await http_request.get("/getAllService")
      let { data } = response;

      setServiceCenter(data)
    }
    catch (err) {
      console.log(err);
    }
  }

  // const sortData = user?.user?.role==="EMPLOYEE"?complaint?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):complaint;
  const sortData = complaint;

  const data = sortData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <>
       
        <Sidenav>
          <Toaster />
          <>
            <ComplaintList data={data} serviceCenter={serviceCenter}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              dashboard={dashboard}
              totalPage={totalPages} userData={value?.user} RefreshData={RefreshData} />
          </>
        </Sidenav>
    
    </>
  )
}

export default Service