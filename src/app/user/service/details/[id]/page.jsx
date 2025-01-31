
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import ServiceProfile from '@/app/components/ServiceProfile';
import ServiceDashboard from '@/app/dashboard/serviceDashboard';

const serviceDetails = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [service, setService] = useState("")
    const [loading, setLoading] = useState(false)
    const [dashData, setData] = React.useState("");
    const [value, setBrandValue] = React.useState(null);
   

    const [admin, setAdmin] = React.useState(null);
   
     useEffect(() => {
       const storedValue = localStorage.getItem("user");
       if (storedValue) {
        setAdmin(JSON.parse(storedValue));
       }
        getServiceById()
        getAllDashboard()
        setBrandValue({_id:params.id,role:"SERVICE"})
    }, [id,loading])



    const getServiceById = async () => {
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

    const handleEdit = ( ) => {
        router.push(`/user/service/edit/${service?._id}`);
      };

const RefreshData=()=>{
    setLoading(true)
}
const getAllDashboard = async () => {
      
    try {
    
      const endPoint=  
      `/dashboardDetailsBySeviceCenterId/${params.id}`
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
                            Service Details
                            </h2>
                        </div>
                        <div onClick={handleEdit} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
                          <Edit /> <div className='ms-3'>Edit</div>
                        </div>
                    </div>
                    <hr />
                    <div  >
                       <ServiceProfile admin={admin} RefreshData={RefreshData} userData={service} />
                    </div>
                    <div>
                    <h2 className="  text-xl font-bold leading-9 tracking-tight text-gray-900">
                                Service Information
                            </h2>
                    <ServiceDashboard dashData={dashData} userData={value} />
                    </div>
                </div>


            </Sidenav>
        </>

    )
}

export default serviceDetails





