"use client"
import React, { useEffect, useState } from 'react'
import Sidenav from '../../components/Sidenav'
import { Close, Edit } from '@mui/icons-material';
import EditProfile from './EditProfile';
import http_request from '../../../../http-request';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ReactLoader } from '@/app/components/common/Loading';
import { useRouter } from 'next/navigation';

const Profile = () => {
    const router = useRouter();
    const { query } = router;
    const [userData, setUserData] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [editModelOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
      if(userData ){
        getUserById();
      }
       

    }, [   refresh]);

    console.log(userData);
    const getUserById = async () => {
        try {
            // console.log(data,"sdbs");
            const response = await http_request.get(`/getUserBy/${query.id}`);
            const { data } = response;
            console.log(data,"sdhghhghghtyft");
            setUserData(data);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };

    const handleEdit = () => {
        setEditModalOpen(!editModelOpen);
    };

    return (
        <Sidenav>
            <div>
                <div className='flex justify-between items-center pb-5'>
                    <div>
                        <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            User Details
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
                    <div>
                        <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4">
                            <div className='text-1xl font-bold'>Created :</div>
                            <div className='text-1xl font-bold'>{new Date(userData?.user?.createdAt).toLocaleString()}</div>
                            <div className='text-1xl font-bold'>Updated :</div>
                            <div className='text-1xl font-bold'>{new Date(userData?.user?.updatedAt).toLocaleString()}</div>
                            <div className='text-1xl font-semibold'>User Name :</div>
                            <div className='text-lg font-medium'>{userData?.user?.name}</div>
                            <div className='text-1xl font-semibold'>Email :</div>
                            <div className='text-lg font-medium'>{userData?.user?.email}</div>
                            <div className='text-1xl font-semibold'>Contact :</div>
                            <div className='text-lg font-medium'>{userData?.user?.contact}</div>
                            <div className='text-1xl font-semibold'>Password :</div>
                            <div className='text-lg font-medium'>{userData?.user?.password}</div>
                            <div className='text-1xl font-semibold'>Status :</div>
                            <div className='text-lg font-medium'>{userData?.user?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
                            <div className='text-1xl font-semibold'>Accept Terms & Conditions :</div>
                            <div className='text-lg font-medium'>{userData?.user?.acceptTerms ? "TRUE" : "FALSE"}</div>
                            <div className='text-1xl font-semibold'>Address :</div>
                            <div className='text-lg font-medium'>{userData?.user?.address}</div>
                        </div>
                    </div>
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
                    <EditProfile editData={userData?.user} RefreshData={setRefresh} onClose={handleEdit} />
                </DialogContent>
            </Dialog>
        </Sidenav>
    );
}

export default Profile;
