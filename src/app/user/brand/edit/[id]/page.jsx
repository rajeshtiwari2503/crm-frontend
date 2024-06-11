
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import EditBrandProfile from '@/app/profile/[id]/EditBrandProfile';
import { ReactLoader } from '@/app/components/common/Loading';

const EditBrand = ({ params } ) => {
    const router = useRouter();
    const [id,setId]=useState("")
    const [brand, setBrand] = useState("")
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, getValues,setValue } = useForm();

    useEffect(() => {
        getBrandById()
       
    }, [ id])

  

    const getBrandById = async ( ) => {
        try {
            let response = await http_request.get(`/getBrandBy/${params.id}`)
            let { data } = response;
            setBrand(data)
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
                        <h2 className="mb-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Edit brand
                        </h2>
                        {brand ?
                         <EditBrandProfile userData={brand} />
                        :  <ReactLoader /> }
                       
                    </div>
                </div>


            </Sidenav>
        </>

    )
}

export default EditBrand





