
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import BrandProfile from '@/app/components/BrandProfile';
import Recharge from '@/app/recharge/page';
import BrandDashboard from '@/app/dashboard/brandDashboard';

const BrandDetails = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [brand, setBrand] = useState("")
    const [loading, setLoading] = useState(false)
    const [dashData, setData] = React.useState("");
    const [value, setBrandValue] = React.useState(null);

    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();

    useEffect(() => {
        getBrandById()
        getAllDashboard()
        setBrandValue({_id:params.id,role:"BRAND"})
    }, [id,loading])
    const RefreshData=()=>{
        setLoading(true)
    }


    const getBrandById = async () => {
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

    const handleEdit = ( ) => {
        router.push(`/user/brand/edit/${brand?._id}`);
      }
    
      const getAllDashboard = async () => {
      
        try {
        
          const endPoint=  
          `/dashboardDetailsByBrandId/${params.id}`
          let response = await http_request.get(endPoint)
          let { data } = response;
    
          setData(data)
        }
        catch (err) {
          console.log(err);
        }
      }
 

    return (
        <>

            <Sidenav >
                <div className=" ">
                    <div className='flex justify-between items-center' >
                        <div className='' >
                            <h2 className="mb-5  text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Brand Details
                            </h2>
                        </div>
                        <div onClick={handleEdit} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
                          <Edit /> <div className='ms-3'>Edit</div>
                        </div>
                    </div>
                    <hr />
                    <div  >
                      <BrandProfile RefreshData={RefreshData}userData={brand} />
                      <Recharge sidebar={false} brandData={brand}/>
                     
                    </div>
                    <div>
                    <h2 className="  text-xl font-bold leading-9 tracking-tight text-gray-900">
                                BrandI Information
                            </h2>
                    <BrandDashboard dashData={dashData} userData={value} />
                    </div>
                </div>


            </Sidenav>
        </>

    )
}

export default BrandDetails





