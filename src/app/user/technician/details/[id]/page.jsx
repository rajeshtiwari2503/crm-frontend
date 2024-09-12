
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import AllServicetList from './AllServiceList';
import TechnicianDashboard from '@/app/dashboard/technicianDashboard';

const CutomerDetails = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [user, setUser] = useState("")
    const [loading, setLoading] = useState(false)
    const [userComplaint, setUserComplaint] = useState([])
    const [dashData, setData] = React.useState("");
    const [value, setBrandValue] = React.useState(null);

    useEffect(() => {
        getUserById()
        getComplaintByTechId()
        getAllDashboard()
        setBrandValue({_id:params.id,role:"TECHNICIAN"})
    }, [id])

    const getComplaintByTechId = async () => {
        try {
            let response = await http_request.get(`/getComplaintByTechId/${params.id}`)
            let { data } = response;
            setUserComplaint(data)

        }
        catch (err) {
            console.log(err);
        }
    }

    const getUserById = async () => {
        try {
            let response = await http_request.get(`/getTechnicianById/${params.id}`)
            let { data } = response;
            setUser(data)
            setId(data?._id)
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleEdit = () => {
        router.push(`/user/technician/edit/${user?._id}`);
    };

    const getAllDashboard = async () => {
      
        try {
        
          const endPoint=  
          `/dashboardDetailsByTechnicianId/${params.id}`
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
                                Technician Details
                            </h2>
                        </div>
                        <div onClick={handleEdit} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
                            <Edit /> <div className='ms-3'>Edit</div>
                        </div>
                    </div>
                    <hr />
                    <div  >
                        <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4" >
                            <div className='text-1xl font-semibold'>User Name : </div>
                            <div className='text-lg font-medium'>{user?.name}</div>
                            <div className='text-1xl font-semibold'>Email : </div>
                            <div className='text-lg font-medium'>{user?.email}</div>
                            <div className='text-1xl font-semibold'>Contact : </div>
                            <div className='text-lg font-medium'>{user?.contact}</div>
                            <div className='text-1xl font-semibold'>Password : </div>
                            <div className='text-lg font-medium'>{user?.password}</div>
                        </div>
                    </div>
                    <div>
                    <h2 className="  text-xl font-bold leading-9 tracking-tight text-gray-900">
                                Technician Information
                            </h2>
                    <TechnicianDashboard dashData={dashData} userData={value} />
                    </div>
                </div>
              {/* <div className='mt-8'>
                    <AllServicetList data={userComplaint} />
                </div> */}
            </Sidenav>
        </>

    )
}

export default CutomerDetails





