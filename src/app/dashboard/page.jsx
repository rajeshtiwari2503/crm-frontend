// "use client"
// import React from 'react'
// import Sidenav from '../components/Sidenav'
// import AdminDashboard from './adminDashboard'
// import BrandDashboard from './brandDashboard'
// import ServiceDashboard from './serviceDashboard'
// import EmployeeDashboard from './employeeDashboard'
// import UserDashboard from './userDashboard'
// import DealerDashboard from './deallerDashboard'
// import http_request from "../../../http-request"
// import TechnicianDashboard from './technicianDashboard'
// import { useUser } from '../components/UserContext'


// const Dashboard = () => {
//   const { user } = useUser();
//   const [value, setValue] = React.useState(user);
//   const [dashData, setData] = React.useState("");



//   React.useEffect(() => {

//     if (user) {
//       setValue(user);
//       if(user?.user.role === "EMPLOYEE" ){
//         getAllEmpDashboard()

//        } else{
//         getAllDashboard()
//        }


//     }

//   }, [user]);


//   const getAllEmpDashboard = async () => {
//     try {

//       let response = await http_request.post("/dashboardDetailsByEmployeeStateZone", { stateZone: user?.user?.stateZone,brand:user?.user?.brand }); // ✅ Send POST request with body
//       let { data } = response;
//       console.log(data);

//       setData(data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getAllDashboard = async () => {

//     try {

//       const endPoint=user?.user.role==="ADMIN"||user?.user.role==="EMPLOYEE"? "/dashboardDetails"
//       :user?.user.role==="DEALER"?`/dashboardDetailsByDealerId/${user?.user?._id}`
//       :user?.user.role==="BRAND"?`/dashboardDetailsByBrandId/${user?.user?._id}`
//       :user?.user.role==="BRAND EMPLOYEE"?`/dashboardDetailsByBrandId/${user?.user?.brandId}`
//       :user?.user.role==="USER"?`/dashboardDetailsByUserId/${user?.user?._id}`
//       :user?.user.role==="TECHNICIAN"?`/dashboardDetailsByTechnicianId/${user?.user?._id}`
//       :user?.user.role==="SERVICE"?`/dashboardDetailsBySeviceCenterId/${user?.user?._id}`
//       :""
//       let response = await http_request.get(endPoint)
//       let { data } = response;

//       setData(data)
//     }
//     catch (err) {
//       console.log(err);
//     }
//   }


//   return (
//     <Sidenav  >
//       <>
//         {value?.user?.role === "ADMIN" ?
//           <AdminDashboard dashData={dashData} userData={value?.user} />
//           : value?.user?.role === "BRAND"|| value?.user?.role === "BRAND EMPLOYEE"  ?
//             <BrandDashboard dashData={dashData} userData={value?.user} />
//             : value?.user?.role === "SERVICE" ?
//               <ServiceDashboard dashData={dashData} userData={value?.user} />
//               : value?.user?.role === "EMPLOYEE" ?
//                 <EmployeeDashboard dashData={dashData} userData={value?.user} />
//                 : value?.user?.role === "USER" ?
//                   <UserDashboard dashData={dashData} userData={value?.user} />
//                   : value?.user?.role === "TECHNICIAN" ?
//                     <TechnicianDashboard dashData={dashData} userData={value?.user} />
//                     : value?.user?.role === "DEALER" ?
//                       <DealerDashboard dashData={dashData} userData={value?.user} /> : ""
//         }
//       </>
//     </Sidenav>
//   )
// }

// export default Dashboard


'use client'
import React, { useEffect, useState } from 'react';
import Sidenav from '../components/Sidenav';
import AdminDashboard from './adminDashboard';
import BrandDashboard from './brandDashboard';
import ServiceDashboard from './serviceDashboard';
import EmployeeDashboard from './employeeDashboard';
import UserDashboard from './userDashboard';
import DealerDashboard from './deallerDashboard';
import TechnicianDashboard from './technicianDashboard';
import http_request from "../../../http-request";
import { useUser } from '../components/UserContext';
import { Dialog } from '@mui/material';
 
import { useSocketContext } from '../components/socketContext/SocketContext';




const Dashboard = () => {
  const { user } = useUser();
  const { socket, onlineUsers } = useSocketContext();

  const isOnline = onlineUsers.includes(user?.user?._id)
  // console.log("isOnline", isOnline);
  // console.log("user",user);

  const [value, setValue] = useState(user);
  const [dashData, setData] = useState("");

  // Notification state
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(null);
// console.log("notification",notification);


  useEffect(() => {
    if (!socket || !user?.user?._id) return;

    const currentUserId = user.user._id;
    const currentUserRole = user.user.role;

    const handleComplaintUpdate = (data) => {
      // console.log("🔔 Received update via socket:", data);

      const isForServiceCenter = currentUserRole === 'SERVICE' &&
        data?.assignedTo?.serviceCenterId === currentUserId;

      const isForBrand = currentUserRole === 'BRAND' &&
        data?.brandId === currentUserId;

      const isForAdmin = currentUserRole === 'ADMIN';

      console.log("🔍 Check Roles =>",
        { currentUserRole, currentUserId, isForServiceCenter, isForBrand, isForAdmin });

      if (isForServiceCenter || isForBrand || isForAdmin) {
        setNotification(data);
        setOpen(true); // ✅ Correct state name
      } else {
        console.log("⚠️ Complaint update not for this user.");
      }
    };

    socket.on("complaintStatusUpdated", handleComplaintUpdate);

    return () => {
      socket.off("complaintStatusUpdated", handleComplaintUpdate);
    };
  }, [socket, user]);

  useEffect(() => {
    if (user) {
      setValue(user);
      if (user?.user.role === "EMPLOYEE") {
        getAllEmpDashboard();
      } else {
        getAllDashboard();
      }
    }

  }, [user]);

  const getAllEmpDashboard = async () => {
    try {
      const response = await http_request.post("/dashboardDetailsByEmployeeStateZone", {
        stateZone: user?.user?.stateZone,
        brand: user?.user?.brand
      });
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllDashboard = async () => {
    try {
      const endPoint =
        user?.user.role === "ADMIN" || user?.user.role === "EMPLOYEE"
          ? "/dashboardDetails"
          : user?.user.role === "DEALER"
            ? `/dashboardDetailsByDealerId/${user?.user?._id}`
            : user?.user.role === "BRAND"
              ? `/dashboardDetailsByBrandId/${user?.user?._id}`
              : user?.user.role === "BRAND EMPLOYEE"
                ? `/dashboardDetailsByBrandId/${user?.user?.brandId}`
                : user?.user.role === "USER"
                  ? `/dashboardDetailsByUserId/${user?.user?._id}`
                  : user?.user.role === "TECHNICIAN"
                    ? `/dashboardDetailsByTechnicianId/${user?.user?._id}`
                    : user?.user.role === "SERVICE"
                      ? `/dashboardDetailsBySeviceCenterId/${user?.user?._id}`
                      : "";

      const response = await http_request.get(endPoint);
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sidenav>
      <>
        {value?.user?.role === "ADMIN" ? (
          <AdminDashboard dashData={dashData} userData={value?.user} />
        ) : value?.user?.role === "BRAND" || value?.user?.role === "BRAND EMPLOYEE" ? (
          <BrandDashboard dashData={dashData} userData={value?.user} />
        ) : value?.user?.role === "SERVICE" ? (
          <ServiceDashboard dashData={dashData} userData={value?.user} />
        ) : value?.user?.role === "EMPLOYEE" ? (
          <EmployeeDashboard dashData={dashData} userData={value?.user} />
        ) : value?.user?.role === "USER" ? (
          <UserDashboard dashData={dashData} userData={value?.user} />
        ) : value?.user?.role === "TECHNICIAN" ? (
          <TechnicianDashboard dashData={dashData} userData={value?.user} />
        ) : value?.user?.role === "DEALER" ? (
          <DealerDashboard dashData={dashData} userData={value?.user} />
        ) : (
          ""
        )}

        {/* 🔔 Notification Popup Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <div className="p-6 w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-2">🔔 Complaint Update</h2>

            <p className="text-sm text-gray-700">
              <strong>Complaint Number:</strong> {notification?.complaintNumber}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Status:</strong>{" "}
              <span className="font-medium text-blue-600">{notification?.status}</span>
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Assigned To (Service Center):</strong>{" "}
              {notification?.assignServiceCenter || notification?.assignedTo?.serviceCenterId || "N/A"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Customer Name:</strong> {notification?.fullName || "N/A"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Phone Number:</strong> {notification?.phoneNumber || "N/A"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Product Brand:</strong> {notification?.productBrand || "N/A"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Product Name:</strong> {notification?.productName || "N/A"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>District:</strong> {notification?.district || "N/A"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>State:</strong> {notification?.state || "N/A"}
            </p>

            <p className="text-sm text-gray-700 mt-1">
              <strong>Pincode:</strong> {notification?.pincode || "N/A"}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              <strong>Updated At:</strong>{" "}
              {notification?.updatedAt ? new Date(notification.updatedAt).toLocaleString() : "N/A"}
            </p>

            <p className="text-xl text-green-600 mt-4">{notification?.message}</p>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>

        </Dialog>

      </>
    </Sidenav>
  );
};

export default Dashboard;
