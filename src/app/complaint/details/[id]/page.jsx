
"use client"
import React, { useEffect, useState } from 'react';
import http_request from '../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';
import UserAllServicesList from './UserAllServices';

const ComplaintDetails = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [complaint, setComplaint] = useState("")
    const [userComplaint, setUserComplaint] = useState([])
    const [loading, setLoading] = useState(false)
    const [value, setLocalValue] = useState('');


    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
          setLocalValue(JSON.parse(storedValue));
        }
        getComplaintById()
        getComplaintByUserId()
    }, [id])

    const getComplaintById = async () => {
        try {
            let response = await http_request.get(`/getComplaintById/${params.id}`)
            let { data } = response;
            setComplaint(data)
            setId(data?.userId)
          
        }
        catch (err) {
            console.log(err);
        }
    }
    const getComplaintByUserId = async () => {
        try {
            let response = await http_request.get(`/getAllComplaint`)
            let { data } = response;
            setUserComplaint(data)
           
        }
        catch (err) {
            console.log(err);
        }
    }
    const handleEdit = () => {
        router.push(`/complaint/edit/${complaint?._id}`);
    };
     
    
    const userComp=userComplaint?.filter((f)=>f?.userId===complaint?.userId)
   
    
    return (
        <>

            <Sidenav >
                {!complaint ? <div className='h-[500px] flex justify-center items-center'> <ReactLoader /></div>
                    : <div className=" ">
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
                                <div className='text-md font-bold'>Created :  </div>
                                <div className='text-md  '> {new Date(complaint?.createdAt).toLocaleString()} </div>
                                <div className='text-md font-bold'>Last Updated :  </div>
                                <div className='text-md  '> {new Date(complaint?.updatedAt).toLocaleString()} </div>
                               
                                <div className='text-md font-semibold'>Brand : </div>
                                <div className='text-md font-medium'>{complaint?.productBrand}</div>
                                <div className='text-md font-semibold'>Category Name : </div>
                                <div className='text-lg font-medium'>{complaint?.categoryName}</div>
                                <div className='text-md font-semibold'>Status: </div>
                                <div className='text-lg font-medium'>{complaint?.status}</div>
                                <div className='text-md font-semibold'>Issue Type : </div>
                                <div className='text-lg font-medium'>{complaint?.issueType}</div>
                                <div className='text-md font-semibold'>Detailed Description : </div>
                                <div className='text-lg font-medium'>{complaint?.detailedDescription}</div>
                                <div className='text-md font-semibold'>Error Messages : </div>
                                <div className='text-lg font-medium'>{complaint?.errorMessages}</div>
                                <div className='text-md font-semibold'>Preferred ServiceDate : </div>
                                <div className='text-lg font-medium'>{new Date(complaint?.preferredServiceDate).toLocaleString()}</div>
                                <div className='text-md font-semibold'>Preferred ServiceTime   : </div>
                                <div className='text-lg font-medium'>{complaint?.preferredServiceTime}</div>
                                <div className='text-md font-semibold'>Service Location  : </div>
                                <div className='text-lg font-medium'>{complaint?.serviceLocation}</div>
                                <div className='text-md font-semibold'>Customer Name : </div>
                                <div className='text-lg font-medium'>{complaint?.fullName}</div>
                                <div className='text-md font-semibold'>Customer Email : </div>
                                <div className='text-lg font-medium'>{complaint?.emailAddress}</div>
                                <div className='text-md font-semibold'>Customer Contact : </div>
                                <div className='text-lg font-medium'>{complaint?.phoneNumber}</div>
                                <div className='text-md font-semibold'>Service Address : </div>
                                <div className='text-lg font-medium'>{complaint?.serviceAddress}</div>
                                <div className='text-md font-semibold'>Pincode : </div>
                                <div className='text-lg font-medium'>{complaint?.pincode}</div>
                                <div className='text-md font-semibold'>AssignServiceCenter : </div>
                                <div className='text-lg font-medium'>{complaint?.assignServiceCenter}</div>
                                <div className='text-md font-semibold'>AssignTechnician : </div>
                                <div className='text-lg font-medium'>{complaint?.assignTechnician}</div>
                                <div className='text-md font-semibold'>Image : </div>
                                <div>
                                    <img

                                        src={complaint?.issueImages}
                                        height="100px"
                                        width="100px"
                                        className='m-2'
                                        alt='image'
                                    />
                                </div>
                                <div className='text-md font-bold mb-5'>Task Updated :  </div>
                               {complaint?.updateHistory?.map((item,i)=>(
                                 <div key={i}className='text-md font-bold'>  
                                 <div>{new Date(item?.updatedAt).toLocaleString()}{"."} </div>
                                 <div> {item?.changes?.status}"{"." }"</div>
                                 </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
                <UserAllServicesList  data={userComp}  />

            </Sidenav>
        </>

    )
}

export default ComplaintDetails





