
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import EditServiceCenter from '@/app/profile/[id]/EditServiceProfile';
import { ReactLoader } from '@/app/components/common/Loading';

const Editservice = ({ params } ) => {
    const router = useRouter();
    const [id,setId]=useState("")
    const [service, setService] = useState("")
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, getValues,setValue } = useForm();

    useEffect(() => {
        getServiceById()
       
    }, [ id])

  

    const getServiceById = async ( ) => {
        try {
            let response = await http_request.get(`/getServiceBy/${params.id}`)
            let { data } = response;
            setService(data)
            setId(data?._id)
        }
        catch (err) {
            console.log(err);
        }
    }
   
 
    return (
        <>

            <Sidenav >
                <div className=" ">
                    <div  >
                        <h2 className=" text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Edit Service
                        </h2>

                       {service ?
                        <EditServiceCenter userData={service} />
                        :  <ReactLoader /> }
                    </div>
                </div>


            </Sidenav>
        </>

    )
}

export default Editservice





