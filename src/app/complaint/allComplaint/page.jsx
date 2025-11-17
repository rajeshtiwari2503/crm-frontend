
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import ComplaintList from './complaintList';
import { useUser } from '@/app/components/UserContext';
import { ReactLoader } from '@/app/components/common/Loading';
import { useSearchParams } from 'next/navigation';
// import SendOtp from './sendOtp';




const Service = ({ dashboard }) => {

  const [complaint, setComplaint] = useState([])
  const [serviceCenter, setServiceCenter] = useState([])
  const [refresh, setRefresh] = useState("")
  const [value, setValue] = React.useState(null);
  const [page, setPage] = useState(1); // Default page
  const [limit, setLimit] = useState(5); // Items per page

  const [totalPages, setTotalPages] = React.useState(0);
  const { user } = useUser()
  const [complaintLoading, setComplaintLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(true);


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


  //  const getAllComplaint = async () => {
  //     try {
  //       setComplaintLoading(true);
  //       if (!user?.user?.role || !user?.user?._id) return;

  //       let role = user.user.role;
  //       let id = user.user._id;

  //       let queryParams = new URLSearchParams();
  //       queryParams.append("page", page);
  //       queryParams.append("limit", limit);

  //       if (role === "BRAND") queryParams.append("brandId", id);
  //       else if (role === "SERVICE") queryParams.append("serviceCenterId", id);
  //       else if (role === "TECHNICIAN") queryParams.append("technicianId", id);
  //       else if (role === "CUSTOMER") queryParams.append("userId", id);
  //       else if (role === "DEALER") queryParams.append("dealerId", id);

  //       let response =
  //         role === "ADMIN" || role === "EMPLOYEE"
  //           ? await http_request.get(`/getAllComplaint?page=${page}&limit=${limit}`)
  //           : await http_request.get(`/getAllComplaintByRole?${queryParams.toString()}`);

  //       let { data } = response;
  //       // console.log("data",data?.data);

  //       setTotalPages(Math.ceil((data?.totalComplaints || 0)));
  //       setComplaint(data?.data);
  //     } catch (err) {
  //       setComplaintLoading(false);
  //       console.error("Error fetching complaints:", err);
  //     }
  //     finally {
  //       setComplaintLoading(false);
  //     }
  //   };

  const searchParams = useSearchParams(); // ✅ use the hook at the top level of component



  const getAllComplaint = async () => {
    try {
      setComplaintLoading(true);

      const roleFromURL = searchParams.get("role");
      const idFromURL =
        searchParams.get("brandId") ||
        searchParams.get("serviceCenterId") ||
        searchParams.get("technicianId") ||
        searchParams.get("userId") ||
        searchParams.get("employeeId")||
        searchParams.get("dealerId");

      const effectiveRole = roleFromURL || user?.user?.role;
      const effectiveId = idFromURL || user?.user?._id;

      if (!effectiveRole || !effectiveId) return;

      let queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      switch (effectiveRole) {
        case "BRAND":
          queryParams.append("brandId", effectiveId);
          break;
        case "SERVICE":
          queryParams.append("serviceCenterId", effectiveId);
          break;
        case "TECHNICIAN":
          queryParams.append("technicianId", effectiveId);
          break;
        case "CUSTOMER":
          queryParams.append("userId", effectiveId);
          break;
        case "DEALER":
          queryParams.append("dealerId", effectiveId);
          break;
           case "EMPLOYEE":
            queryParams.append("employeeId", effectiveId);
            break;
        
      }

      //  UY1906KI457  console.log("queryParams", queryParams.toString());

      const response =
        effectiveRole === "ADMIN"  
          ? await http_request.get(`/getAllComplaint?page=${page}&limit=${limit}`)
          : await http_request.get(`/getAllComplaintByRole?${queryParams.toString()}`);
      let { data } = response;
      setTotalPages(Math.ceil((data?.totalComplaints || 0)));
      setComplaint(data?.data);
    } catch (error) {
      console.error("Error fetching complaints", error);
    } finally {
      setComplaintLoading(false);
    }
  };




  const getAllServiceCenter = async () => {
    try {
      setServiceLoading(true);
      let response = await http_request.get("/getAllServiceCenterAction");
      let { data } = response;
      setServiceCenter(data);
    } catch (err) {
      console.log(err);
    } finally {
      setServiceLoading(false);
    }
  };

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
          {(complaintLoading || serviceLoading) ? (
            <div className="flex items-center justify-center h-[80vh]">
              <ReactLoader />
            </div>
          ) : (
            <ComplaintList data={data} serviceCenter={serviceCenter}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              dashboard={dashboard}
              totalPage={totalPages} userData={value?.user} RefreshData={RefreshData} />
          )}
        </>
        {/* <SendOtp />   */}
      </Sidenav>

    </>
  )
}

export default Service