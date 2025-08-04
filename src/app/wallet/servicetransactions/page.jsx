// "use client"
// import Sidenav from '@/app/components/Sidenav'
// import React, { useEffect, useState } from 'react'
// import http_request from '../../../../http-request'
// import { useUser } from '@/app/components/UserContext'
// import ServiceTransactionList from './serviceTransactionList'
// import { ReactLoader } from '@/app/components/common/Loading'
// import WalletPaymentReport from '../servicePaymentsAnalytic'

// const ServiceTransactions = ({ }) => {

//   const [transactions, setTransactions] = useState([]);

//   const [value, setValue] = React.useState(null);

//   const [refresh, setRefresh] = React.useState("");
//   const [loading, setLoading] = useState(false);

//   const { user } = useUser();
// // console.log(user);


//   useEffect(() => {
//     if (user?.user?._id) {
//       setValue(user);


//     }
//     if (value) {
//       getTransactions();
//     }


//   }, [refresh, value, user]);



//   const getTransactions = async () => {
//     try {
//       const endPoint = user?.user?.role === "SERVICE" ? `/getAllServicePaymentByCenterId/${user?.user?._id}` : `/getAllServicePayment`


//       // console.log("endPoint", endPoint);
//       setLoading(true);

//       // Use endPoint variable correctly here
//       const response = await http_request.get(endPoint);
//       let { data } = response;


//       // console.log("data",data);

//       setTransactions(data);
//     } catch (err) {
//       console.error("Error fetching transactions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const RefreshData = (data) => {
//     setRefresh(data)
//   }

//   const tranData = user?.user?.role === "ADMIN" || user?.user?.role === "EMPLOYEE" ? transactions : transactions?.filter((f) => f?.serviceCenterId === user?.user?._id)

//   const transData = tranData?.map((item, index) => ({ ...item, i: index + 1 }))

//   // console.log("transData",transData);

//   return (
//     <Sidenav>
//       {loading ? (
//         <div className="flex justify-center items-center  h-[80vh]">
//           <ReactLoader />
//         </div>
//       ) : (
//         <>
//         <ServiceTransactionList RefreshData={RefreshData} data={transData} loading={loading} value={value?.user} />
//        {user?.user?.role==="ADMIN" || user?.user?.role==="EMPLOYEE"|| user?.user?.role==="SERVICE"? <WalletPaymentReport  user={user}/>
//        :""}
//         </>
//       )}
//     </Sidenav>
//   )
// }

// export default ServiceTransactions


"use client";

import Sidenav from '@/app/components/Sidenav';
import React, { useEffect, useState } from 'react';
import http_request from '../../../../http-request';
import { useUser } from '@/app/components/UserContext';
import { ReactLoader } from '@/app/components/common/Loading';
import WalletPaymentReport from '../servicePaymentsAnalytic';
import ServiceTransactionListWithPage from './serviceTransactionListWithPage';
import ServiceTransactionList from './serviceTransactionList';

const ServiceTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [value, setValue] = useState(null);
  const [refresh, setRefresh] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useUser();

  useEffect(() => {
    if (user?.user?._id) {
      setValue(user);
    }
  }, [user]);

  useEffect(() => {
    if (value) {
      getTransactions();
    }
  }, []);
// refresh, value, user
  const getTransactions = async () => {
    try {
      const role = user?.user?.role;
      let endPoint = "";

      if (role === "SERVICE") {
        endPoint = `/getAllServicePaymentByCenterId/${user?.user?._id}`;
      } else {
        endPoint = `/getAllServicePaymentsWithPage1?page=${page}&limit=${limit}`;
      }

      setLoading(true);
      const response = await http_request.get(endPoint);
      const { data, total } = response.data;

      setTransactions(data);
      setTotalPages(total);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const RefreshData = (data) => {
    setRefresh(data);
  };

  const tranData =
    user?.user?.role === "ADMIN" || user?.user?.role === "EMPLOYEE"
      ? transactions
      : transactions?.filter((f) => f?.serviceCenterId === user?.user?._id);

  const transData = tranData?.map((item, index) => ({ ...item, i: index + 1 }));

  return (
    <Sidenav>
      {loading ? (
        <div className="flex justify-center items-center h-[80vh]">
          <ReactLoader />
        </div>
      ) : (
        <>
         { user?.user?.role === "ADMIN" || user?.user?.role === "EMPLOYEE" ?
          <ServiceTransactionListWithPage
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPage={totalPages}
            RefreshData={RefreshData}
            data={transData}
            loading={loading}
            value={value?.user}
          />
          : <ServiceTransactionList RefreshData={RefreshData} data={transData} loading={loading} value={value?.user} />
         }

          {(user?.user?.role === "ADMIN" ||
            user?.user?.role === "EMPLOYEE" ||
            user?.user?.role === "SERVICE") &&
            
            <WalletPaymentReport user={user} /> 
           
            }
        </>
      )}
    </Sidenav>
  );
};

export default ServiceTransactions;
