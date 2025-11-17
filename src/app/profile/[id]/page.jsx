"use client"
import React, { useEffect, useState } from 'react';
import Sidenav from '../../components/Sidenav';
import { Close, Edit } from '@mui/icons-material';
import EditProfile from './EditProfile';
import http_request from '../../../../http-request';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ReactLoader } from '@/app/components/common/Loading';
import { useRouter } from 'next/navigation';
import EditServiceCenter from './EditServiceProfile';
import ServiceProfile from '@/app/components/ServiceProfile';
import EditBrandProfile from './EditBrandProfile';
import BrandProfile from '@/app/components/BrandProfile';
import EditTechProfile from './EditTechProfile';
import { Toaster } from 'react-hot-toast';
import EditDealerProfile from './EditeDealerProfile';
import DealerProfile from '@/app/components/DealerProfile';
import { ToastMessage } from '@/app/components/common/Toastify';
import { useForm } from 'react-hook-form';
import Recharge from '@/app/recharge/page';
import EmployeeProfile from '@/app/components/EmployeeProfile';

const Profile = ({ params }) => {

    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState("");
    const [status, setStatus] = useState("");
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [editService, setEditService] = useState(false);
    const [editBrand, setEditBrand] = useState(false);
    const [editTech, setEditTech] = useState(false);
    const [editDealer, setEditDealer] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    useEffect(() => {

        getUserById();

    }, [refresh, status]);
    useEffect(() => {

        getUserById();

    }, [refresh]);



    const getUserById = async () => {
        try {
            setLoading(true);
            const response = await http_request.get(`/getProfileById/${params?.id}`);
            const { data } = response;
            setUsers(data);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
            setLoading(false);
        }
        finally{
           setLoading(false);  
        }
    };
    const userData = users?.user?.role ? (users?.user) : users?.service?.role ? (users?.service) : users?.technician?.role ? (users?.technician) : users?.dealer?.role ? (users?.dealer) : users?.emp?.role ? (users?.emp) : users?.brand
    const handleEdit = () => {
        if (userData?.role === "SERVICE") {
            setEditService(!editService)
        }
        if (userData?.role === "BRAND") {
            setEditBrand(!editBrand)
        }
        if (userData?.role === "TECHNICIAN") {
            setEditTech(!editTech)
        }
        if (userData?.role === "DEALER") {
            setEditDealer(!editDealer)
        }
        setEditModalOpen(!editModelOpen);
    };

    // console.log('User ID:', userId);
    const editTechStatus = async (data1) => {
        try {
            let response = await http_request.patch(`/editTechnician/${params.id}`, { liveStatus: data1?.liveStatus })
            let { data } = response;
            ToastMessage(data)
            setStatus(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const onSubmit = (data) => {
        editTechStatus(data)
    }
    const liveStatusOptions = ['Select Status', 'LEAVE', 'AVAILABLE', 'BUSY',];
    const RefreshData = (ref) => {
        setRefresh(ref)
    }

    return (
        <Sidenav>
            <Toaster />
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <ReactLoader />
                </div>
            ) : (
                <>
                    {editService === true ?
                        <div>
                            <div onClick={handleEdit} className='flex   items-center' >
                                <div className='text-xl font-bold cursor-pointer'>Back</div>
                                <div className="ms-8 text-xl font-bold leading-9 tracking-tight text-gray-900">
                                    {userData?.role} Details
                                </div>
                            </div>
                            <EditServiceCenter userData={userData} />
                        </div>
                        : editBrand === true ?
                            <div>
                                <div onClick={handleEdit} className='flex   items-center' >
                                    <div className='text-xl font-bold cursor-pointer'>Back</div>
                                    <div className="ms-8 text-xl font-bold leading-9 tracking-tight text-gray-900">
                                        {userData?.role} Details
                                    </div>
                                </div>
                                <EditBrandProfile userData={userData} RefreshData={RefreshData} />
                            </div>

                            : <>
                                <div>
                                    <div className='flex justify-between items-center pb-5'>
                                        <div>
                                            <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                                {userData?.role} Details
                                            </h2>
                                        </div>
                                        <div onClick={handleEdit} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center'>
                                            <Edit /> <div className='ms-3'>Edit</div>
                                        </div>
                                    </div>
                                    <hr />
                                    {!userData ? (
                                        <div className='h-[400px] flex justify-center items-center'>
                                            <ReactLoader />
                                        </div>
                                    ) : (
                                        <>
                                            {userData?.role === "USER" || userData?.role === "TECHNICIAN" ?
                                                <div>
                                                    {userData?.role === "TECHNICIAN" ? <div className=' mt-5'>
                                                        <form onSubmit={handleSubmit(onSubmit)} className='grid md:grid-cols-4 sm:grid-cols-2    '>
                                                            <div className=" ">
                                                                <label className="block text-xl text-gray-700   font-bold mb-2" htmlFor="liveStatus">
                                                                    Live Status
                                                                </label>
                                                                <select
                                                                    id="liveStatus"
                                                                    // value={userData?.liveStatus}
                                                                    {...register("liveStatus", { required: true })}
                                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                                >
                                                                    {liveStatusOptions.map(status => (
                                                                        <option key={status} value={status}>
                                                                            {status}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {errors.liveStatus && <p className="text-red-500 text-xs italic">Please select a status.</p>}
                                                            </div>
                                                            <div className="flex items-center mt-8 md:ms-8 justify-between">
                                                                <button
                                                                    type="submit"
                                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                                >
                                                                    Update Status
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                        : ""
                                                    }
                                                    <div className="m-5 grid md:grid-cols-4 grid-cols-2  mt-5 gap-4">

                                                        <div className='text-1xl font-bold'>Availability</div>
                                                        <div className='text-1xl font-bold'> {userData?.liveStatus}</div>

                                                        <div className='text-1xl font-bold'>Created :</div>
                                                        <div className='text-1xl font-bold'>{new Date(userData?.createdAt).toLocaleString()}</div>
                                                        <div className='text-1xl font-bold'>Updated :</div>
                                                        <div className='text-1xl font-bold'>{new Date(userData?.updatedAt).toLocaleString()}</div>
                                                        <div className='text-1xl font-semibold'>User Name :</div>
                                                        <div className='text-lg font-medium'>{userData?.name}</div>
                                                        <div className='text-1xl font-semibold col-span-2'>Email :</div>
                                                        <div className='text-lg font-medium col-span-2'>{userData?.email}</div>
                                                        <div className='text-1xl font-semibold'>Contact :</div>
                                                        <div className='text-lg font-medium'>{userData?.contact}</div>
                                                        <div className='text-1xl font-semibold'>Password :</div>
                                                        <div className='text-lg font-medium'>{userData?.password}</div>
                                                        <div className='text-1xl font-semibold'>Status :</div>
                                                        <div className='text-lg font-medium'>{userData?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
                                                        <div className='text-1xl font-semibold'>Accept Terms & Conditions :</div>
                                                        <div className='text-lg font-medium'>{userData?.acceptTerms ? "TRUE" : "FALSE"}</div>
                                                        <div className='text-1xl font-semibold'>Address :</div>
                                                        <div className='text-lg font-medium'>{userData?.address}</div>
                                                    </div>
                                                </div>
                                                : userData?.role === "SERVICE" ? <ServiceProfile userData={userData} RefreshData={RefreshData} />
                                                    : userData?.role === "BRAND" ?
                                                        <div>
                                                            <BrandProfile userData={userData} RefreshData={RefreshData} />
                                                            <Recharge sidebar={false} brandData={userData} />
                                                        </div>
                                                        : userData?.role === "DEALER" ? <DealerProfile userData={userData} />
                                                            : userData?.role === "EMPLOYEE" ? <EmployeeProfile userData={userData} />
                                                                : ""
                                            }
                                        </>
                                    )}
                                </div>
                                <Dialog open={editModelOpen} onClose={handleEdit}>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleEdit}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            color: (theme) => theme.palette.grey[500],
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                    <DialogContent>
                                        {editTech === true ?
                                            <EditTechProfile editData={userData} RefreshData={setRefresh} onClose={handleEdit} />
                                            : editDealer === true ?
                                                <EditDealerProfile editData={userData} RefreshData={setRefresh} onClose={handleEdit} />
                                                : <EditProfile editData={userData} RefreshData={setRefresh} onClose={handleEdit} />
                                        }
                                    </DialogContent>
                                </Dialog>
                            </>}
                </>
            )}

        </Sidenav>
    );
};

export default Profile;
