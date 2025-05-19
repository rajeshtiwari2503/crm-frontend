
// "use client"
// import React, { useEffect, useState } from 'react'
// import http_request from "../../../../http-request"
// import { Toaster } from 'react-hot-toast';
// import Sidenav from '@/app/components/Sidenav';
// import OrderList from './orderList';
// import { useUser } from '@/app/components/UserContext';




// const Order = () => {

//   const [order, setOrder] = useState([])
//   const [refresh, setRefresh] = useState("")
//   const [sparepart, setSparepart] = useState([])
//   const [serviceCenter, setServiceCenter] = useState([])
//   const [brands, setBrands] = useState([])
//   const [value, setValue] = React.useState(null);
// const {user}=useUser()
//   useEffect(() => {
 
//     if (user) {
//       setValue(user);
//     }
//     getAllOrder()
//     getAllSparepart()
//     getAllServiceCenter()
//     getAllBrand()
//   }, [refresh,user])

//   const getAllOrder = async () => {
//     const storedValue = localStorage.getItem('user');
//     const userInfo = storedValue ? JSON.parse(storedValue) : null;
  
//     try {
//       let endPoint=
//      userInfo?.user?.role === 'ADMIN'|| userInfo?.user?.role === 'EMPLOYEE'? 
//          '/getAllOrder'
//         : userInfo?.user?.role === 'BRAND'? 
//          `/getAllOrderById?brandId=${userInfo?.user?._id}`
//          : `/getAllOrderById?serviceCenterId=${userInfo?.user?._id}`
     
  
//       let response = await http_request.get(endPoint);
//       let { data } = response;
  
//       setOrder(data);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//     }
//   };

//   const getAllSparepart = async () => {
//     try {
//       let response = await http_request.get("/getAllSparePart")
//       let { data } = response;

//       setSparepart(data)
//     }
//     catch (err) {
//       console.log(err);
//     }
//   }
  
//   const getAllServiceCenter = async () => {
//     try {
//       const response = await http_request.get("/getAllService");
//       if (response?.data) {
//         const authorizedCenters = response.data.filter(
//           (center) => center.serviceCenterType === "Authorized"
//         );
//         setServiceCenter(authorizedCenters);
//       } else {
//         console.warn("No service center data received.");
//       }
//     } catch (err) {
//       console.error("Failed to fetch service centers:", err?.response?.data || err.message);
//     }
//   };
  
//   const getAllBrand = async () => {
//     try {
//       let response = await http_request.get("/getAllBrand")
//       let { data } = response;

//       setBrands(data)
//     }
//     catch (err) {
//       console.log(err);
//     }
//   }
//   const data = order?.map((item, index) => ({ ...item, i: index + 1 }));

//   const RefreshData = (data) => {
//     setRefresh(data)
//   }

//   const filterSparepart= value?.user?.role === "ADMIN" ? sparepart : value?.user?.role === "BRAND" ? sparepart?.filter((f) =>
//     f?.brandId === value?.user?._id) : sparepart
// // console.log(filterSparepart);

//   return (
//     <Sidenav>
//       <Toaster />
//       <div className='flex justify-center'>
//             <div className='md:w-full w-[260px]'>
//         <OrderList data={data} userData={value} brand={brands} serviceCenter={serviceCenter} sparepart={filterSparepart} RefreshData={RefreshData} />
//         </div>
//         </div>
//     </Sidenav>
//   )
// }

// export default Order


'use client';

import React, { useEffect, useState } from 'react';
import http_request from '../../../../http-request';
import { Toaster } from 'react-hot-toast';
import Sidenav from '@/app/components/Sidenav';
import OrderList from './orderList';
import { useUser } from '@/app/components/UserContext';
import { ReactLoader } from '@/app/components/common/Loading';
 

const Order = () => {
  const [order, setOrder] = useState([]);
  const [refresh, setRefresh] = useState('');
  const [sparepart, setSparepart] = useState([]);
  const [serviceCenter, setServiceCenter] = useState([]);
  const [brands, setBrands] = useState([]);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(true); // 🧩 loading state

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setValue(user);
    }

    const fetchData = async () => {
      try {
        setLoading(true); // 🧩 Start loading
        await Promise.all([
          getAllOrder(),
          getAllSparepart(),
          getAllServiceCenter(),
          getAllBrand()
        ]);
      } catch (err) {
        console.error('Data fetching error:', err);
      } finally {
        setLoading(false); // 🧩 Stop loading
      }
    };

    fetchData();
  }, [refresh, user]);

  const getAllOrder = async () => {
    const storedValue = localStorage.getItem('user');
    const userInfo = storedValue ? JSON.parse(storedValue) : null;

    try {
      let endPoint =
        userInfo?.user?.role === 'ADMIN' || userInfo?.user?.role === 'EMPLOYEE'
          ? '/getAllOrder'
          : userInfo?.user?.role === 'BRAND'
          ? `/getAllOrderById?brandId=${userInfo?.user?._id}`
          : `/getAllOrderById?serviceCenterId=${userInfo?.user?._id}`;

      const response = await http_request.get(endPoint);
      setOrder(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const getAllSparepart = async () => {
    try {
      const response = await http_request.get('/getAllSparePart');
      setSparepart(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllServiceCenter = async () => {
    try {
      const response = await http_request.get('/getAllService');
      if (response?.data) {
        const authorizedCenters = response.data.filter(
          (center) => center.serviceCenterType === 'Authorized'
        );
        setServiceCenter(authorizedCenters);
      }
    } catch (err) {
      console.error('Failed to fetch service centers:', err);
    }
  };

  const getAllBrand = async () => {
    try {
      const response = await http_request.get('/getAllBrand');
      setBrands(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const data = order?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data);
  };

  const filterSparepart =
    value?.user?.role === 'ADMIN'
      ? sparepart
      : value?.user?.role === 'BRAND'
      ? sparepart?.filter((f) => f?.brandId === value?.user?._id)
      : sparepart;

  return (
    <Sidenav>
      <Toaster />
      <div className="flex justify-center">
        <div className="md:w-full w-[260px]">
          {loading ? (
            <ReactLoader />
          ) : (
            <OrderList
              data={data}
              userData={value}
              brand={brands}
              serviceCenter={serviceCenter}
              sparepart={filterSparepart}
              RefreshData={RefreshData}
            />
          )}
        </div>
      </div>
    </Sidenav>
  );
};

export default Order;
