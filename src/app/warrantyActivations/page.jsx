"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from '.././../../http-request'
import WarrantyActivationList from './activationList'
import { useUser } from '../components/UserContext'
import { ReactLoader } from '../components/common/Loading'



const WarrantyActivation = (props) => {
  const [warrantyActivation, setWarrantyActivation] = useState([])
  const [product, setProduct] = useState([])

  const [refresh, setRefresh] = useState("")
  const [userData, setUserData] = React.useState(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10); // You can make this dynamic
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }

    getAllWarrantyActivation(page);
    getAllProduct();
  }, [refresh, user, page]);


  const getAllWarrantyActivation = async (pageNum) => {
    setLoading(true); // Start loading
    try {
      const response = await http_request.get(
        `/getAllActivationWarrantyWithPage?page=${pageNum}&limit=${limit}`
      );
      const { data } = response;
      setWarrantyActivation(data?.data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };


  // const getAllWarrantyActivation = async () => {
  //   try{
  //     let response = await http_request.get("/getAllActivationWarranty")
  //     let { data } = response;
  //     // console.log(data);

  //     setWarrantyActivation(data)
  //   }

  //   catch(err){
  //     console.log(err);

  //   }
  // }
  const getAllProduct = async () => {
    let response = await http_request.get("/getAllProduct")
    let { data } = response;

    setProduct(data)
  }
  const filterData = userData?.user?.role === "ADMIN" ? warrantyActivation : userData?.user?.role === "BRAND EMPLOYEE" ? warrantyActivation?.filter((f) => f?.brandId === userData?.user?.brandId) : warrantyActivation?.filter((f) => f?.brandId === userData?.user?._id)

  const data = filterData?.map((item, index) => ({ ...item, i: index + 1 }));

  const RefreshData = (data) => {
    setRefresh(data)
  }

  return (
    <>

      <Sidenav>
        {loading === true ? (
          <div className="flex items-center justify-center h-[80vh]">
            <ReactLoader />
          </div>
        ) : (
          <WarrantyActivationList
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}

            totalPage={totalPages}
            data={data}
            userData={userData?.user} brandData={props?.brandData} product={product} RefreshData={RefreshData} />
        )}
      </Sidenav>

    </>
  )
}

export default WarrantyActivation