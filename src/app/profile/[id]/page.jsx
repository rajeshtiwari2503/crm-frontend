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

const Profile = ({ params }) => {

    const [users, setUsers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [editModelOpen, setEditModalOpen] = useState(false);
    const [editService, setEditService] = useState(false);
    const [editBrand, setEditBrand] = useState(false);
    const router = useRouter();



    useEffect(() => {

        getUserById();

    }, [refresh]);

    const getUserById = async () => {
        try {

            const response = await http_request.get(`/getProfileById/${params?.id}`);
            const { data } = response;
            setUsers(data);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };
    const userData = users?.user?.role ? (users?.user) : users?.service?.role ? (users?.service) : users?.brand
    const handleEdit = () => {
        if (userData?.role === "SERVICE") {
            setEditService(!editService)
        } 
        if (userData?.role === "BRAND") {
        setEditBrand(!editBrand)
        } 
        setEditModalOpen(!editModelOpen);
    };

    // console.log('User ID:', userId);


    return (
        <Sidenav>
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
                :editBrand === true ?
                <div>
                    <div onClick={handleEdit} className='flex   items-center' >
                        <div className='text-xl font-bold cursor-pointer'>Back</div>
                        <div className="ms-8 text-xl font-bold leading-9 tracking-tight text-gray-900">
                            {userData?.role} Details
                        </div>
                    </div>
                    <EditBrandProfile userData={userData} />
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
                            {userData?.role==="USER"?
                             <div>
                                <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4">
                                    <div className='text-1xl font-bold'>Created :</div>
                                    <div className='text-1xl font-bold'>{new Date(userData?.createdAt).toLocaleString()}</div>
                                    <div className='text-1xl font-bold'>Updated :</div>
                                    <div className='text-1xl font-bold'>{new Date(userData?.updatedAt).toLocaleString()}</div>
                                    <div className='text-1xl font-semibold'>User Name :</div>
                                    <div className='text-lg font-medium'>{userData?.name}</div>
                                    <div className='text-1xl font-semibold'>Email :</div>
                                    <div className='text-lg font-medium'>{userData?.email}</div>
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
                            : userData?.role==="SERVICE"?<ServiceProfile userData={userData} />
                            :userData?.role==="BRAND"?<BrandProfile userData={userData} />
                            :""
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
                            <EditProfile editData={userData} RefreshData={setRefresh} onClose={handleEdit} />
                        </DialogContent>
                    </Dialog>
                </>}



        </Sidenav>
    );
};

export default Profile;
