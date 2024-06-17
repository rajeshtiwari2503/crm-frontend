"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../../http-request";
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';
const SparepartDetails = ({ params }) => {

  const router = useRouter()

  const [spareParts, setSpareParts] = useState({})

  useEffect(() => {
    GetSparepart()

  }, []);

  const GetSparepart = async () => {
    try {
      let response = await http_request.get(`/getSparepartById/${params?.id}`)
      let { data } = response
      setSpareParts(data);
    }
    catch (err) {
      console.log(err)


    }
  }
  const handleEdit = (id) => {
    router.push(`/product/sparepart/edit/${id}`)
  }
  return (
    <Sidenav>

      {!spareParts.length > 0 ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
        :
        <>
          <div className='flex justify-between items-center mb-3'>
            <div className='font-bold text-2xl'>Sparepart Information</div>
            <div onClick={() => handleEdit(spareParts?._id)} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
              <Edit style={{ color: "white" }} />
              <div className=' ml-2 '>Edit Sparepart</div>
            </div>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
            <div className='font-bold'>Part Name</div>
            <div>{spareParts?.partName}</div>
            <div className='font-bold'>Part No. </div>
            <div>{spareParts?.partNo}</div>
            <div className='font-bold'>category  </div>
            <div>{spareParts?.category}</div>
            <div className='font-bold'>productModel  </div>
            <div>{spareParts?.productModel}</div>
            <div className='font-bold'>skuNo  </div>
            <div>{spareParts?.skuNo}</div>
            <div className='font-bold'>description  </div>
            <div>{spareParts?.description}</div>
            <div className='font-bold'>weight  </div>
            <div>{spareParts?.weight}</div>
            <div className='font-bold'>breadth  </div>
            <div>{spareParts?.breadth}</div>
            <div className='font-bold'>length  </div>
            <div>{spareParts?.length}</div>
            <div className='font-bold'>status  </div>
            <div>{spareParts?.status}</div>
            <div className='font-bold'>createdAt  </div>
            <div>{new Date(spareParts?.createdAt).toLocaleString()}</div>
            <div className='font-bold'>updatedAt  </div>
            <div>{new Date(spareParts?.updatedAt).toLocaleString()}</div>

          </div>
        </>
      }
    </Sidenav>
  )
}

export default SparepartDetails