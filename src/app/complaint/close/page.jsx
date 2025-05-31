
"use client"
import React, { useEffect, useState } from 'react'
import http_request from "../../../../http-request"
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import CloseComplaintList from './closeComplaintList';
import { useUser } from '@/app/components/UserContext';
import { ReactLoader } from '@/app/components/common/Loading';
import { useSearchParams } from 'next/navigation';



const Close = () => {

  const [complaint, setComplaint] = useState([])
  const [refresh, setRefresh] = useState("")

  const [value, setValue] = React.useState(null);
const [transactions, setTransactions] = useState([]);
 const [loading, setloading] = React.useState(false);
  const [page, setPage] = useState(1); // Default page
  const [limit, setLimit] = useState(5); // Items per page

  const [totalPages, setTotalPages] = React.useState(0);
 const { user } = useUser();
 
 
   useEffect(() => {
 
     if (user) {
       setValue(user)
     }
    getAllComplaint()
    getTransactions()
  }, [refresh,user, page, limit])

  const getTransactions = async () => {
    try {
      const endPoint = user?.user?.role === "ADMIN"||user?.user?.role === "EMPLOYEE" 
        ? `/getAllServicePayment` 
        : value?.user?.role === "BRAND" 
        ? `/getTransactionByBrandId/${user?.user?._id}` 
        : `/getTransactionByCenterId/${user?.user?._id}`;
   
      const response = await http_request.get(endPoint);
      
      let { data } = response;
      
      setTransactions(data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }  
  };
  // const getAllComplaint = async () => {
  //   try {
  //         setloading(true)
  
  //    if (!user?.user?.role || !user?.user?._id) return;

  //     let role = user.user.role;
  //     let id = user.user._id;

  //     let queryParams = new URLSearchParams();
  //     queryParams.append("page", page);
  //     queryParams.append("limit", limit);

  //     if (role === "BRAND") queryParams.append("brandId", id);
  //     else if (role === "SERVICE") queryParams.append("serviceCenterId", id);
  //     else if (role === "TECHNICIAN") queryParams.append("technicianId", id);
  //     else if (role === "CUSTOMER") queryParams.append("userId", id);
  //     else if (role === "DEALER") queryParams.append("dealerId", id);

  //     let response =
  //       role === "ADMIN" || role === "EMPLOYEE"
  //         ? await http_request.get(`/getComplaintsByComplete?page=${page}&limit=${limit}`)
  //         : await http_request.get(`/getCompleteComplaintByRole?page=${page}&limit=${limit}?${queryParams.toString()}`);

  //     let { data } = response;
  //     // console.log("data",data?.data);

  //     setTotalPages(Math.ceil((data?.totalComplaints || 0)));
  //     setComplaint(data?.data);
  //   } catch (err) {
  //     setloading(false);
  //     console.error("Error fetching complaints:", err);
  //   }
  //   finally {
  //     setloading(false);
  //   }
  // }
  // const sortData = user?.user?.role==="EMPLOYEE"?complaint?.filter((f1) => user?.user?.stateZone?.includes(f1?.state)):complaint;

  
    const searchParams = useSearchParams(); // ✅ use the hook at the top level of component
  
  
  
    const getAllComplaint = async () => {
      try {
        setloading(true);
  
        const roleFromURL = searchParams.get("role");
        const idFromURL =
          searchParams.get("brandId") ||
          searchParams.get("serviceCenterId") ||
          searchParams.get("technicianId") ||
          searchParams.get("userId") ||
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
        }
  
        // console.log("queryParams", queryParams.toString());
  
        const response =
          effectiveRole === "ADMIN" || effectiveRole === "EMPLOYEE"
            ? await http_request.get(`/getComplaintsByComplete?page=${page}&limit=${limit}`)
         : await http_request.get(`/getCompleteComplaintByRole?page=${page}&limit=${limit}?${queryParams.toString()}`);
        let { data } = response;
        setTotalPages(Math.ceil((data?.totalComplaints || 0)));
        setComplaint(data?.data);
      } catch (error) {
        console.error("Error fetching complaints", error);
      } finally {
        setloading(false);
      }
    };
  
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
        <CloseComplaintList  page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit} totalPage={totalPages}  data={data}userData={value?.user}transactions={transactions} RefreshData={RefreshData} />
        </>
      )}
    
    </Sidenav>
  )
}

export default Close