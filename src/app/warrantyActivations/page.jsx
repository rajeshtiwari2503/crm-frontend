// "use client"
// import Sidenav from '@/app/components/Sidenav'
// import React, { useEffect, useState } from 'react'
// import http_request from '.././../../http-request'
// import WarrantyActivationList from './activationList'
// import { useUser } from '../components/UserContext'
// import { ReactLoader } from '../components/common/Loading'
// import WarrantyAnalytics from './warrantyanalytics'



// const WarrantyActivation = (props) => {
//   const [warrantyActivation, setWarrantyActivation] = useState([])
//   const [product, setProduct] = useState([])

//   const [refresh, setRefresh] = useState("")
//   const [userData, setUserData] = React.useState(null);
//   const { user } = useUser();
//   const [loading, setLoading] = useState(false);

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [limit, setLimit] = useState(10); // You can make this dynamic
//   const [totalPages, setTotalPages] = useState(0);

//   useEffect(() => {
//     if (user) {
//       setUserData(user);
//     }

//     getAllWarrantyActivation(page);
//     getAllProduct();
//   }, [refresh, user, page]);


//   const getAllWarrantyActivation = async (pageNum) => {
//     setLoading(true); // Start loading
//     try {
//       const response = await http_request.get(
//         `/getAllActivationWarrantyWithPage?page=${pageNum + 1}&limit=${limit}`
//       );
//       const { data } = response;
//       setWarrantyActivation(data?.data || []);
//       setTotalPages(data?.totalPages || 0);
//     } catch (err) {
//       console.log(err);
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };


//   // const getAllWarrantyActivation = async () => {
//   //   try{
//   //     let response = await http_request.get("/getAllActivationWarranty")
//   //     let { data } = response;
//   //     // console.log(data);

//   //     setWarrantyActivation(data)
//   //   }

//   //   catch(err){
//   //     console.log(err);

//   //   }
//   // }
//   const getAllProduct = async () => {
//     let response = await http_request.get("/getAllProduct")
//     let { data } = response;

//     setProduct(data)
//   }
//   const filterData = userData?.user?.role === "ADMIN" ||userData?.user?.role === "EMPLOYEE"? warrantyActivation : userData?.user?.role === "BRAND EMPLOYEE" ? warrantyActivation?.filter((f) => f?.brandId === userData?.user?.brandId) : warrantyActivation?.filter((f) => f?.brandId === userData?.user?._id)

//   const data = filterData

//   const RefreshData = (data) => {
//     setRefresh(data)
//   }

//   return (
//     <>

//       <Sidenav>
//         {loading === true ? (
//           <div className="flex items-center justify-center h-[80vh]">
//             <ReactLoader />
//           </div>
//         ) : (
//           <>
//           <WarrantyAnalytics />

//           <WarrantyActivationList
//             page={page}
//             setPage={setPage}
//             limit={limit}
//             setLimit={setLimit}

//             totalPage={totalPages}
//             data={data}
//             userData={userData?.user} brandData={props?.brandData} product={product} RefreshData={RefreshData} />
//               </>
//         )}
//       </Sidenav>

//     </>
//   )
// }

// export default WarrantyActivation



"use client";

import Sidenav from '@/app/components/Sidenav';
import React, { useEffect, useState } from 'react';
import http_request from '.././../../http-request';
import WarrantyActivationList from './activationList';
import { useUser } from '../components/UserContext';
import { ReactLoader } from '../components/common/Loading';
import WarrantyAnalytics from './warrantyanalytics';

const WarrantyActivation = (props) => {
  const [activeTab, setActiveTab] = useState("analytics"); // default tab
  const [warrantyActivation, setWarrantyActivation] = useState([]);
  const [product, setProduct] = useState([]);
  const [refresh, setRefresh] = useState("");
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
    getAllWarrantyActivation(page);
    getAllProduct();
  }, [refresh, user, page]);

  // const getAllWarrantyActivation = async (pageNum) => {
  //   setLoading(true);
  //   try {
  //     const response = await http_request.get(
  //       `/getAllActivationWarrantyWithPage?page=${pageNum + 1}&limit=${limit}`
  //     );
  //     const { data } = response;
  //     setWarrantyActivation(data?.data || []);
  //     setTotalPages(data?.totalPages || 0);
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const getAllWarrantyActivation = async (pageNum) => {
    setLoading(true);
    try {
      let url = `/getAllActivationWarrantyWithPage?page=${pageNum + 1}&limit=${limit}`;

      if (user.user?.role==="BRAND") {
        url += `&brandId=${user.user?._id}`;
      }

      const response = await http_request.get(url);

      const { data } = response;
      setWarrantyActivation(data?.data || []);
      setTotalPages(data?.totalPages || 0);
      setTotalItems(data?.totalItems || 0)
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllProduct = async () => {
    let response = await http_request.get("/getAllProduct");
    let { data } = response;
    setProduct(data);
  };

  const filterData = userData?.user?.role === "ADMIN" || userData?.user?.role === "EMPLOYEE"
    ? warrantyActivation
    : userData?.user?.role === "BRAND EMPLOYEE"
      ? warrantyActivation?.filter(f => f?.brandId === userData?.user?.brandId)
      : warrantyActivation?.filter(f => f?.brandId === userData?.user?._id);

  const RefreshData = (data) => setRefresh(data);
  // console.log("filterData", filterData);

  return (
    <Sidenav>
      {loading ? (
        <div className="flex items-center justify-center h-[80vh]">
          <ReactLoader />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 border-b mb-6 px-4 sm:px-8">
            <button
              className={`py-2 px-4 border-b-2 font-medium ${activeTab === "analytics"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-indigo-600"
                }`}
              onClick={() => setActiveTab("analytics")}
            >
              📊 Analytics
            </button>
            <button
              className={`py-2 px-4 border-b-2 font-medium ${activeTab === "activation"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-indigo-600"
                }`}
              onClick={() => setActiveTab("activation")}
            >
              🧾 Activation List
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "analytics" ? (
            <WarrantyAnalytics />
          ) : (
            <WarrantyActivationList
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalPage={totalPages}
              totalItems={totalItems}
              data={filterData}
              userData={userData?.user}
              brandData={props?.brandData}
              product={product}
              RefreshData={RefreshData}
            />
          )}
        </>
      )}
    </Sidenav>
  );
};

export default WarrantyActivation;
