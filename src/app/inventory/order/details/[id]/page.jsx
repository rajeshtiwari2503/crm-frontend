"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../../http-request";
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';
const OrderDetails = ({ params }) => {

  const router = useRouter()

  const [orders, setOrders] = useState({})

  useEffect(() => {
    GetOrder()

  }, []);

  const GetOrder = async () => {
    try {
      let response = await http_request.get(`/getOrderById/${params?.id}`)
      let { data } = response
      setOrders(data);
    }
    catch (err) {
      console.log(err)


    }
  }
  const handleEdit = (id) => {
    router.push(`/product/Order/edit/${id}`)
  }
  return (
    <Sidenav>

      {!orders  ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
        :
        <>
          <div className='flex justify-between items-center mb-3'>
            <div className='font-bold text-2xl'>Order Information</div>
           
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
            <div className='font-bold'>Part Name</div>
            <div>{orders?.partName}</div>
            <div className='font-bold'>Part No. </div>
            <div>{orders?.partNumber}</div>
            <div className='font-bold'>quantity  </div>
            <div>{orders?.quantity}</div>
            <div className='font-bold'>priorityLevel  </div>
            <div>{orders?.priorityLevel}</div>
            <div className='font-bold'>comments  </div>
            <div>{orders?.comments}</div>
            <div className='font-bold'>status  </div>
            <div>{orders?.status}</div>
            <div className='font-bold'>supplier name  </div>
            <div>{orders?.supplierInformation?.name}</div>
            <div className='font-bold'>contact  </div>
            <div>{orders?.supplierInformation?.contact}</div>
            <div className='font-bold'>address  </div>
            <div>{orders?.supplierInformation?.address}</div>
            <div className='font-bold'>status  </div>
            <div>{orders?.status}</div>
            <div className='font-bold'>createdAt  </div>
            <div>{new Date(orders?.createdAt).toLocaleString()}</div>
            <div className='font-bold'>updatedAt  </div>
            <div>{new Date(orders?.updatedAt).toLocaleString()}</div>

          </div>
        </>
      }
    </Sidenav>
  )
}

export default OrderDetails