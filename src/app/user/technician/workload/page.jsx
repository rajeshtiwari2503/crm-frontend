"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../http-request"
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';
 

const Workload = () => {
    const [technician, setTechnician] = useState([])

    const router=useRouter()

    useEffect(() => {
        getAllTechnician()

    }, [])

    const getAllTechnician = async () => {
        const storedValue = localStorage.getItem("user");
        const userType = JSON.parse(storedValue)
        try {
            let response = await http_request.get(`/getTechnicianByCenterId/${userType?.user?._id}`)
            let { data } = response;
            //    const filterData=data?.filter((f)=>f?.===userType?._id)
            setTechnician(data)
        }
        catch (err) {
            console.log(err);
        }
    }

    const data = technician?.map((item, index) => ({ ...item, i: index + 1 }));
    // console.log(data);


    return (
        <Sidenav>
            <div className='my-8'>
                <div className='grid md:grid-cols-4 grid-cols-1 gap-4 items-center bg-sky-100 rounded-xl shadow-lg p-5'>
                    {technician?.map((item, i) => (
                        <div key={i} className='justify-center flex items-center'>
                            <div onClick={()=>router.push(`/user/technician/details/${item?._id}`)}>


                                <div className='bg-yellow-300 rounded-md mt-3 cursor-pointer p-4'>
                                    <div className='  mt-2 text-xl'>Name : {item?.name} </div>
                                    {/* <CountUp start={0} end={100} delay={1} /> */}
                                    <div className='flex justify-between items-center'>
                                        <div className='text-xl   mt-2'>Status </div>
                                        <div className='text-xl p-2 ms-3 bg-green-500 rounded-md  mt-2'> {item?.liveStatus}</div>

                                    </div>
                                </div>
                               
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Sidenav>
    )
}

export default Workload