"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../http-request";
import { useRouter } from 'next/navigation';
import { ReactLoader } from '@/app/components/common/Loading';
import UserDashboard from '@/app/dashboard/userDashboard';

const WarrantyActivationDetails = ({ params }) => {

    const router = useRouter()

    const [data, setWarranty] = useState({})

    const [dashData, setData] = React.useState("");
    const [value, setBrandValue] = React.useState(null);

    

  useEffect(() => {
    
        const fetchData = async () => {
            try {
                const response = await http_request.get(`/getActivationWarrantyById/${params?.id}`)
                setWarranty(response.data);
            } catch (err) {
                console.log('Error fetching details');
            } finally {
                console.log('Error fetching details');

            }
        };
        if(data){
            getAllDashboard()
            getUserById()
        }
       
        fetchData();
    }, [params?.id]);



    const getUserById = async () => {
        try {
            
            let response = await http_request.get(`/getUserBy/${data?.userId}`)
            let { data } = response;
            setUser(data)
            setId(data?._id)
        }
        catch (err) {
            console.log(err);
        }
    }

    
      const getAllDashboard = async () => {
      
        try {
        
          const endPoint=  
          `/dashboardDetailsByUserId/${data?.userId}`
          let response = await http_request.get(endPoint)
          let { data } = response;
    
          setData(data)
        }
        catch (err) {
          console.log(err);
        }
      }

   
    console.log(data);


    return (
        <Sidenav>

            {!data ?
                <div className='h-[400px] flex justify-center items-center'>
                    <ReactLoader />
                </div>
                :
                <>
                    <div className="container mx-auto p-4">
                        <h1 className="text-3xl font-bold mb-4">Product Warranty Details</h1>

                        <div className="grid grid-cols-2 gap-4">
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
                            <div>
                                <strong>Category ID:</strong> {data.categoryId}
                            </div>
                            <div>
                                <strong>Unique ID:</strong> {data.uniqueId}
                            </div>
                            <div>
                                <strong>Year:</strong> {new Date(data.year).toLocaleDateString()}
                            </div>
                            <div>
                                <strong>Batch No:</strong> {data.batchNo}
                            </div>
                            <div>
                                <strong>Warranty Days:</strong> {data.warrantyInDays}
                            </div>
                            <div>
                                <strong>QR Codes:</strong>
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
                            <div>
                                <strong>Complaint ID:</strong> {data.complaintId}
                            </div>
                            <div>
                                <strong>CreatedAt:</strong> {new Date(data.activationDate).toLocaleDateString()}
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
