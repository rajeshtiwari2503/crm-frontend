
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';

const employeeDetails = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [employee, setEmployee] = useState("")
    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();

    useEffect(() => {
        getEmployeeById()

    }, [id])



    const getEmployeeById = async () => {
        try {
            let response = await http_request.get(`/getEmployeeBy/${params.id}`)
            let { data } = response;
            setEmployee(data)
            setId(data?._id)
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleEdit = () => {
        router.push(`/user/employee/edit/${employee?._id}`);
    };



    return (
        <>

            <Sidenav >
                <div className=" ">
                    <div className='flex justify-between items-center' >
                        <div className='' >
                            <h2 className="mb-5  text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Employee Details
                            </h2>
                        </div>
                        <div onClick={handleEdit} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
                            <Edit /> <div className='ms-3'>Edit</div>
                        </div>
                    </div>
                    <hr />
                    <div  >
                        <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4" >
                            <div className='text-1xl font-semibold'>Employee Name : </div>
                            <div className='text-lg font-medium'>{employee?.name}</div>
                            <div className='text-1xl font-semibold'>Email : </div>
                            <div className='text-lg font-medium'>{employee?.email}</div>
                            <div className='text-1xl font-semibold'>Contact : </div>
                            <div className='text-lg font-medium'>{employee?.contact}</div>
                            <div className='text-1xl font-semibold'>Password : </div>
                            <div className='text-lg font-medium'>{employee?.password}</div>
                            <div className='text-1xl font-semibold'>Salary : </div>
                            <div className='text-lg font-medium'>{employee?.salary}</div>
                        </div>
                    </div>
                    <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4" >
                        <div className='text-1xl font-semibold'>State Zones:</div>
                        <div className='text-lg font-medium'>
                            {employee?.stateZone?.length > 0 ? (
                                employee.stateZone.map((state, index) => (
                                    <div key={index} className="text-gray-700">
                                        {state}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500">No state zones assigned</div>
                            )}
                        </div>
                        <div className='text-1xl font-semibold'>Brands:</div>
                        <div className='text-lg font-medium'>
                            {employee?.brand?.length > 0 ? (
                                employee.brand.map((b, index) => (
                                    <div key={index} className="text-gray-700">
                                        {b.label} {/* ✅ Now shows brand name */}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500"> Brand not assigned</div>
                            )}
                        </div>
                        
                            <div className="text-1xl font-semibold">Team Name:</div>
                            <div className="text-lg font-medium">{employee?.teamName || "N/A"}</div>

                            <div className="text-1xl font-semibold">Product Categories:</div>
                            <div className="text-lg font-medium">
                                {employee?.productCategory?.length > 0 ? (
                                    employee.productCategory.map((cat, index) => (
                                        <div key={index} className="text-gray-700">
                                            {cat.label}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500">No product category assigned</div>
                                )}
                            </div>

                            <div className="text-1xl font-semibold">Product Models:</div>
                            <div className="text-lg font-medium">
                                {employee?.productModel?.length > 0 ? (
                                    employee.productModel.map((model, index) => (
                                        <div key={index} className="text-gray-700">
                                            {model.label}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500">No product model assigned</div>
                                )}
                            </div>
                        </div>

                  
                </div>


            </Sidenav>
        </>

    )
}

export default employeeDetails





