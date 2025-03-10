
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
            setUserComplaint(data?.data)

        }
        catch (err) {
            console.log(err);
        }
    }
    const handleEdit = () => {
        router.push(`/complaint/edit/${complaint?._id}`);
    };


    const userComp = userComplaint?.filter((f) => f?.phoneNumber === complaint?.phoneNumber)
    // console.log(complaint);


    return (
        <>

            <Sidenav >
                {!complaint ? <div className='h-[500px] flex justify-center items-center'> <ReactLoader /></div>
                    : <div className="  ">
                        <div className='flex justify-between items-center mb-5' >
                            <div className='' >
                                <h2 className="   text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    Complaint Details
                                </h2>
                            </div>
                            <div onClick={handleEdit} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
                                <Edit /> <div className='ms-3'>Edit</div>
                            </div>
                        </div>
                        <hr />
                        <div  >
                            <div className="md:m-5 grid md:grid-cols-4   grid-cols-2 mt-5 md:gap-4 gap-2" >
                                <div className='md:text-xl text-sm font-bold'>Created :  </div>
                                <div className='md:text-xl text-sm  '> {new Date(complaint?.createdAt).toLocaleString()} </div>
                                {/* <div className='md:text-xl text-sm  '> {new Date(complaint?.assignServiceCenterTime).toLocaleString()} </div>
                                <div className='md:text-xl text-sm  '> {new Date(complaint?.empResponseTime).toLocaleString()} </div> */}
                                <div className='md:text-xl text-sm font-bold'>Last Updated :  </div>
                                <div className='md:text-xl text-sm  '> {new Date(complaint?.updatedAt).toLocaleString()} </div>

                                <div className='md:text-xl text-sm font-semibold'>Brand : </div>
                                <div className='md:text-xl text-sm '>{complaint?.productBrand}</div>
                                <div className='md:text-xl text-sm font-semibold'>Product Name : </div>
                                <div className='md:text-xl text-sm  '>{complaint?.productName}</div>
                                <div className='md:text-xl text-sm font-semibold'>Category Name : </div>
                                <div className='md:text-xl text-sm  '>{complaint?.categoryName}</div>
                                <div className='md:text-xl text-sm font-semibold'>Status: </div>
                                <div className='md:text-xl text-sm '>{complaint?.status}</div>
                                <div className='md:text-xl text-sm font-semibold'>Issue Type : </div>
                                <div className='md:text-xl text-sm '>{complaint?.issueType}</div>
                                <div className='md:text-xl text-sm font-semibold'>Detailed Description : </div>
                                <div className='md:text-xl text-sm '>{complaint?.detailedDescription}</div>
                                <div className='md:text-xl text-sm font-semibold'>Error Messages : </div>
                                <div className='md:text-xl text-sm '>{complaint?.errorMessages}</div>
                                <div className='md:text-xl text-sm font-semibold'>Preferred ServiceDate : </div>
                                <div className='md:text-xl text-sm '>{new Date(complaint?.preferredServiceDate).toLocaleString()}</div>
                                <div className='md:text-xl text-sm font-semibold'>Preferred ServiceTime   : </div>
                                <div className='md:text-xl text-sm '>{complaint?.preferredServiceTime}</div>
                                <div className='md:text-xl text-sm font-semibold'>Service Location  : </div>
                                <div className='md:text-xl text-sm '>{complaint?.serviceLocation}</div>
                                <div className='md:text-xl text-sm font-semibold'>Customer Name : </div>
                                <div className='md:text-xl text-sm '>{complaint?.fullName}</div>
                                <div className='md:text-xl text-sm font-semibold'>Customer Email : </div>
                                <div className='md:text-xl text-sm '>{complaint?.emailAddress}</div>
                                <div className='md:text-xl text-sm font-semibold'>Customer Contact : </div>
                                <div className='md:text-xl text-sm '>{complaint?.phoneNumber}</div>
                                <div className='md:text-xl text-sm font-semibold'>Service Address : </div>
                                <div className='md:text-xl text-sm '>{complaint?.serviceAddress}</div>
                                <div className='md:text-xl text-sm font-semibold'>Pincode : </div>
                                <div className='md:text-xl text-sm '>{complaint?.pincode}</div>
                                <div className='md:text-xl text-sm font-semibold'>District : </div>
                                <div className='md:text-xl text-sm '>{complaint?.district}</div>
                                <div className='md:text-xl text-sm font-semibold'>State : </div>
                                <div className='md:text-xl text-sm '>{complaint?.state}</div>

                                <div className='md:text-xl text-sm font-semibold'>AssignServiceCenter : </div>
                                <div className='md:text-xl text-sm '>{complaint?.assignServiceCenter}</div>
                                {value?.user?.role === "BRAND" ? ""
                                    : <>
                                        <div className='md:text-xl text-sm font-semibold'>AssignServiceCenter contact : </div>
                                        <div className='md:text-xl text-sm '>{complaint?.serviceCenterContact}</div>
                                    </>

                                }
                                <div className='md:text-xl text-sm font-semibold'>AssignTechnician : </div>
                                <div className='md:text-xl text-sm '>{complaint?.assignTechnician}</div>

                                <div className='md:text-xl text-sm font-semibold'>Brand Payments : </div>
                                <div className='md:text-xl text-sm '>{complaint?.paymentBrand}</div>
                                <div className='md:text-xl text-sm font-semibold'>Final Comments : </div>
                                <div className='md:text-xl text-sm '>{complaint?.finalComments}</div>
                                <div className='md:text-xl text-sm font-semibold'>Kilometer : </div>
                                <div className='md:text-xl text-sm '>{complaint?.kilometer}</div>


                                {/* <div className='md:text-xl text-sm font-bold mb-5'>Task Updated :  </div>
                                {complaint?.updateHistory?.map((item, i) => (
                                    <div key={i} className='md:text-xl text-sm font-bold'>
                                        <div> {item?.changes?.status} </div>
                                        <div>{new Date(item?.updatedAt).toLocaleString()} </div>

                                    </div>
                                ))}
                                </div>
                                  <div> */}
                                {/* <div className='md:text-xl text-sm font-bold mb-5'>Updated  Comments :  </div>
                                {complaint?.updateComments?.map((item, i) => (
                                    <div key={i} className='md:text-xl text-sm font-bold'>
                                        
                                        <div> {item?.changes?.sndStatus} </div>
                                        <div>{new Date(item?.updatedAt).toLocaleString()}  </div>
                                    </div>
                                ))}
                                </div> */}

                                <div className='md:text-xl text-sm font-semibold'>Image : </div>
                                <div>
                                    <img

                                        src={complaint?.issueImages}
                                        height="100px"
                                        width="100px"
                                        className='m-2'
                                        alt='image'
                                    />
                                </div>

                                <div className='md:text-xl text-sm font-semibold'>Replace Part Image : </div>
                                <div>
                                    <img

                                        src={complaint?.partImage}
                                        height="100px"
                                        width="100px"
                                        className='m-2'
                                        alt='image'
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="md:p-4 p-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2">
                                {/* Update Comments Section */}
                                <div className="border p-4 rounded-lg">
                                    <h2 className="text-xl font-bold mb-2">Update Comments</h2>
                                    <div className="space-y-3">
                                        {complaint?.updateComments?.map((comment) => (
                                            <div key={comment._id} className="border-b pb-2">
                                                <p className="text-sm text-gray-500">
                                                    <strong>Updated At:</strong> {new Date(comment.updatedAt).toLocaleString()}
                                                </p>
                                                {Object.entries(comment.changes).map(([key, value]) => (
                                                    <p key={key} className="text-sm">
                                                        <strong>{key.replace(/\b\w/, (char) => char.toUpperCase())}:</strong> {value}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Update History Section */}
                                <div className="border p-4 rounded-lg">
                                    <h2 className="text-xl font-bold mb-2">Update History</h2>
                                    {/* <div className="space-y-3">
                                        {complaint?.updateHistory?.map((history) => (
                                            <div key={history._id} className="border-b pb-2">
                                                <p className="text-sm text-gray-500">
                                                    <strong>Updated At:</strong> {new Date(history.updatedAt).toLocaleString()}
                                                </p>
                                                {Object.entries(history.changes).map(([key, value]) => (
                                                    <p key={key} className="text-sm">
                                                        <strong>{key.replace(/\b\w/, (char) => char.toUpperCase())}:</strong> {value}
                                                    </p>
                                                ))}
                                            </div>
                                        ))}
                                    </div> */}
                                    <div className="space-y-3 ">
                                        {complaint?.updateHistory?.map((history) => (
                                            <div key={history._id} className="border-b pb-2">
                                                <p className="text-sm text-gray-500">
                                                    <strong>Updated At:</strong> {new Date(history.updatedAt).toLocaleString()}
                                                </p>
                                                {Object.entries(history.changes).map(([key, value]) => (
                                                    key !== "serviceCenterContact" && ( // Exclude serviceCenterContact
                                                        <p key={key} className="text-sm">
                                                            <strong>{key.replace(/\b\w/, (char) => char.toUpperCase())}:</strong> {value}
                                                        </p>
                                                    )
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='  '>
                    <UserAllServicesList data={userComp} />
                </div>
                    </div>
                }
               
            </Sidenav>
        </>

    )
}

export default ComplaintDetails





