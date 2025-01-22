"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../http-request";
import { useRouter } from 'next/navigation';
import { ReactLoader } from '@/app/components/common/Loading';
import UserDashboard from '@/app/dashboard/userDashboard';
import EditWarrantyDetails from './EditActivationWarranty';

const WarrantyActivationDetails = ({ params }) => {

    const router = useRouter()

    const [data, setWarranty] = useState({})
    const [loading, setLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    const [dashData, setData] = React.useState("");
    const [value, setBrandValue] = React.useState(null);



    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const warrantyResponse = await http_request.get(`/getActivationWarrantyById/${params?.id}`);
                setWarranty(warrantyResponse.data);

                // Fetch user data and dashboard details after fetching the warranty
                // console.log(warrantyResponse.data);
                
                if (warrantyResponse.data) {
                    getUserById(warrantyResponse.data.userId);
                    setBrandValue({ _id: warrantyResponse.data.userId, role: "USER" })
                    getAllDashboard(warrantyResponse.data.userId);
                    setLoading(false)

                }
                setLoading(false)

            } catch (err) {
                console.log('Error fetching details', err);
                setLoading(false)

            }
        };

        if (params?.id) {
            fetchData(); // Trigger fetch when params.id changes
        }
    }, [params?.id]); // Re-run the effect when params.id changes

    // Fetch user data by userId
    const getUserById = async (userId) => {
        try {
            const response = await http_request.get(`/getUserBy/${userId}`);
            const userData = response.data;
            // setUser(userData);
            // setId(userData?._id);
        } catch (err) {
            console.log('Error fetching user details', err);
        }
    };

    // Fetch dashboard details by userId
    const getAllDashboard = async (userId) => {
        try {
            const endPoint = `/dashboardDetailsByUserId/${userId}`;
            const response = await http_request.get(endPoint);
            const dashboardData = response.data;
            setData(dashboardData);
        } catch (err) {
            console.log('Error fetching dashboard details', err);
        }
    };

const handleEdit=(data)=>{
    setIsEdit(data)
}

    // console.log(data);


    return (
        <Sidenav>

            {loading === true ?
                <div className='h-[400px] flex justify-center items-center'>
                    <ReactLoader />
                </div>
                :
                <>
                    {isEdit && <EditWarrantyDetails data={data}handleEdit={handleEdit} />}

                    <div className="container mx-auto p-4">
                        <div className="flex justify-between mb-5">
                            <h1 className="text-3xl font-bold">Product Warranty Details</h1>
                            <button onClick={()=>handleEdit(true)} className="text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-md">
                                Edit Details
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><strong>QR Codes:</strong></div>
                            <div>

                                {data?.qrCodes?.map((qr, index) => (
                                    <div key={index}>
                                        {/* <span>{qr.qrCodeUrl}</span> */}
                                        <div>
                                            {/* Display image if qrCodeUrl exists */}
                                            {qr.qrCodeUrl && <img src={qr.qrCodeUrl} alt={`QR Code ${index}`} width={100} height={100} />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <strong>Brand Name:</strong> {data.brandName}
                            </div>
                            <div>
                                <strong>Brand ID:</strong> {data.brandId}
                            </div>
                            <div>
                                <strong>Product Name:</strong> {data.productName}
                            </div>
                            <div>
                                <strong>Product ID:</strong> {data.productId}
                            </div>
                            {/* <div>
                                <strong>Category Name:</strong> {data.categoryName}
                            </div> */}
                            <div>
                                <strong>Category ID:</strong> {data.categoryId}
                            </div>
                            <div>
                                <strong>Unique ID:</strong> {data.uniqueId}
                            </div>
                            <div>
                                <strong>Year:</strong> {new Date(data.year).toLocaleString()}
                            </div>
                            <div>
                                <strong>Batch No:</strong> {data.batchNo}
                            </div>
                            <div>
                                <strong>Warranty Days:</strong> {data.warrantyInDays}
                            </div>
                            <div>
                                <strong>Remaining Warranty Days:</strong> {
                                    (() => {
                                        const activationDate = new Date(data.activationDate);
                                        const expirationDate = new Date(activationDate);
                                        expirationDate.setDate(activationDate.getDate() + data.warrantyInDays);

                                        const currentDate = new Date();
                                        const remainingTime = expirationDate - currentDate;
                                        const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

                                        return remainingDays > 0 ? remainingDays : 0; // If remaining days is negative, set it to 0
                                    })()}
                            </div>


                            <div>
                                <strong>User Name:</strong> {data.userName}
                            </div>
                            <div>
                                <strong>Email:</strong> {data.email}
                            </div>
                            <div>
                                <strong>Contact:</strong> {data.contact}
                            </div>
                            <div>
                                <strong>Address:</strong> {data.address}
                            </div>
                            <div>
                                <strong>Location:</strong> {data.lat}, {data.long}
                            </div>
                            <div>
                                <strong>Pincode:</strong> {data.pincode}
                            </div>
                            <div>
                                <strong>District:</strong> {data.district}
                            </div>
                            <div>
                                <strong>State:</strong> {data.state}
                            </div>
                            {/* <div>
                                <strong>Complaint ID:</strong> {data.complaintId}
                            </div> */}
                            <div>
                                <strong>CreatedAt:</strong> {new Date(data.activationDate).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="  text-xl font-bold leading-9 tracking-tight text-gray-900">
                            Customer Information
                        </h2>
                        <UserDashboard dashData={dashData} userData={value} />
                    </div>
                </>
            }
        </Sidenav>
    )
}

export default WarrantyActivationDetails
