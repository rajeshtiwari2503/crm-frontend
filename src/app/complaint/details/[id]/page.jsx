
"use client"
import React, { useEffect, useState } from 'react';
import http_request from '../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';

const ComplaintDetails = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [complaint, setComplaint] = useState("")
    const [loading, setLoading] = useState(false)



    useEffect(() => {
        getComplaintById()

    }, [id])

    const getComplaintById = async () => {
        try {
            let response = await http_request.get(`/getComplaintById/${params.id}`)
            let { data } = response;
            setComplaint(data)
            setId(data?._id)
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleEdit = () => {
        router.push(`/complaint/edit/${complaint?._id}`);
    };

    return (
        <>

            <Sidenav >
              {!complaint ?<div className='h-[500px] flex justify-center items-center'> <ReactLoader /></div>
              :  <div className=" ">
                    <div className='flex justify-between items-center' >
                        <div className='' >
                            <h2 className="mb-5  text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Complaint Details
                            </h2>
                        </div>
                        <div onClick={handleEdit} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
                            <Edit /> <div className='ms-3'>Edit</div>
                        </div>
                    </div>
                    <hr />
                    <div  >
                        <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4" >
                            <div className='text-1xl font-bold'>Created :  </div>
                            <div className='text-1xl font-bold'> {new Date(complaint?.createdAt).toLocaleString() } </div>
                            <div className='text-1xl font-bold'>Updated :  </div>
                            <div className='text-1xl font-bold'> {new Date(complaint?.updatedAt).toLocaleString()} </div>
                            <div className='text-1xl font-semibold'>Brand : </div>
                            <div className='text-lg font-medium'>{complaint?.brandName}</div>
                            <div className='text-1xl font-semibold'>Customer Name : </div>
                            <div className='text-lg font-medium'>{complaint?.customerName}</div>
                            <div className='text-1xl font-semibold'>Customer Email : </div>
                            <div className='text-lg font-medium'>{complaint?.customerEmail}</div>
                            <div className='text-1xl font-semibold'>Customer Contact : </div>
                            <div className='text-lg font-medium'>{complaint?.customerMobile}</div>

                        </div>
                    </div>
                </div>
}

            </Sidenav>
        </>

    )
}

export default ComplaintDetails





