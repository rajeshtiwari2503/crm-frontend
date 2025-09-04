
"use client"
import React, { useEffect, useState } from 'react';
import http_request from '../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';
import UserAllServicesList from './UserAllServices';
import { Toaster } from 'react-hot-toast';
import { ToastMessage } from '@/app/components/common/Toastify';

const ComplaintDetails = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [complaint, setComplaint] = useState("")
    const [userComplaint, setUserComplaint] = useState([])
    const [loading, setLoading] = useState(false)
    const [value, setLocalValue] = useState('');

    const [audioFile, setAudioFile] = useState(null);
    const [serviceCenter, setServiceCenter] = useState(null);

    const [slot, setSlot] = useState("");

    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setLocalValue(JSON.parse(storedValue));
        }
        getComplaintById()

        getAllSpareParts()
    }, [id])

    useEffect(() => {

        if (complaint.assignServiceCenterId) {
            getServiceBy(complaint.assignServiceCenterId)
        }

    }, [complaint.assignServiceCenterId])
    const getServiceBy = async (cenId) => {
        try {

            let response = await http_request.get(`/getServiceBy/${cenId}`)
            let { data } = response;
            setServiceCenter(data)
        }
        catch (err) {
            console.log(err);

        }
    }
    const getComplaintById = async () => {
        try {
            setLoading(true)
            let response = await http_request.get(`/getComplaintById/${params.id}`)
            let { data } = response;
            setComplaint(data)
            getComplaintByUserId(data?.phoneNumber);
            // if (data?.assignServiceCenterId) {
            //     getServiceBy(data?.assignServiceCenterId)
            // }
            setId(data?.userId)

        }
        catch (err) {
            console.log(err);
            setLoading(false)
        }
    }


    // const getComplaintByUserId = async () => {
    //     try {
    //         setLoading(true)
    //         let response = await http_request.get(`/getAllBrandComplaint`)
    //         let { data } = response;
    //         // console.log("data",data);

    //         setUserComplaint(data)
    //         setLoading(false)
    //     }
    //     catch (err) {
    //         console.log(err);
    //         setLoading(false)
    //     }
    // }




    const getComplaintByUserId = async (phoneNumber) => {
        if (!phoneNumber) {
            console.warn("Missing phone number, not sending request.");
            return;
        }

        try {
            setLoading(true);
            const response = await http_request.get(`/getCompleteComplaintByUserContact?phoneNumber=${phoneNumber}`);

            setUserComplaint(response.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };



    const handleEdit = () => {
        router.push(`/complaint/edit/${complaint?._id}`);
    };


    const userComp = userComplaint?.filter((f) => f?.phoneNumber === complaint?.phoneNumber)
    // console.log(value);

    const makeLinksClickable = (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.split(urlRegex).map((part, index) =>
            urlRegex.test(part) ? (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    {part}
                </a>
            ) : (
                part
            )
        );
    };
    const getGoogleDriveFileId = (url) => {
        const match = url.match(/(?:id=|\/d\/)([\w-]+)/);
        return match ? match[1] : null;
    };
    const [spareParts, setSpareParts] = useState([]); // state to store all spare parts
    const [matchedSpareParts, setMatchedSpareParts] = useState([]); // filtered parts

    const getAllSpareParts = async () => {
        try {
            const res = await http_request.get("/getAllSparepart"); // adjust route accordingly
            const parts = res?.data || [];

            setSpareParts(parts);
            // console.log("parts", parts);

            // filter by matching productId
            const matched = parts.filter(part =>
                part.products.some(product => product.productId === complaint?.productId)
            );

            // console.log("matched", matched);
            setMatchedSpareParts(matched);
        } catch (err) {
            console.log("Error fetching spare parts", err);
        }
    };

    // console.log("matchedSpareParts", matchedSpareParts);
    const handleAudioUpload = async () => {
        if (!audioFile) return;

        const formData = new FormData();
        formData.append("audio", audioFile);
        formData.append("complaintId", params.id);

        try {
            const res = await http_request.post("/upload-audio", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { data } = res;
            ToastMessage(data);
            getComplaintById();
        } catch (err) {
            console.error("Audio upload failed:", err);
        }

    };
    const handleShowContact = async (e) => {

        try {
            setLoading(true);
            const updatePayload = {
                showCustomerNumberTimestamp: new Date().toISOString(),
            };

            const response = await http_request.patch(`/updateComplaint/${params.id}`, updatePayload);
            const { data } = response;
            ToastMessage(data);

            // 👇 Refresh complaint data
            getComplaintById();

        } catch (err) {
            console.error("Failed to update slot:", err);
            alert("Error updating time slot.");
        } finally {
            setLoading(false);
        }
    };
    const handleSlot = async (e) => {
        const selectedSlot = e.target.value;
        setSlot(selectedSlot);
        setLoading(true);

        try {
            const updatePayload = {
                assignedTimeSlot: selectedSlot,
            };
            const response = await http_request.patch(`/updateComplaint/${params.id}`, updatePayload);
            const { data } = response;
            ToastMessage(data);

            // 👇 Refresh complaint data
            getComplaintById();

        } catch (err) {
            console.error("Failed to update slot:", err);
            alert("Error updating time slot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <Sidenav >
                <div>
                    {loading === true ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
                        : <>
                            {!complaint ? <div className='  flex justify-center items-center'> Data not available !</div>
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

                                            {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" ?
                                                <div className='md:text-xl text-sm font-semibold'>UniqueId : </div>
                                                : ""}
                                            {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" ?
                                                <div className='md:text-xl text-sm '>{complaint?.uniqueId}</div>
                                                : ""}

                                            <div className='md:text-xl text-sm font-semibold'>ComplaintId : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.complaintId}</div>
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
                                            {value?.user?.role === "SERVICE" ?
                                                complaint?.showCustomerNumberTimestamp && <>
                                                    <div className="md:text-xl text-sm font-semibold">Customer Contact:</div>
                                                    <div className="md:text-xl text-sm">{complaint?.phoneNumber}</div>

                                                    <div className="md:text-xl text-sm font-semibold">Alternate Contact:</div>
                                                    <div className="md:text-xl text-sm">{complaint?.alternateContactInfo}</div>



                                                </>
                                                : <>
                                                    <div className="md:text-xl text-sm font-semibold">Customer Contact:</div>
                                                    <div className="md:text-xl text-sm">{complaint?.phoneNumber}</div>

                                                    <div className="md:text-xl text-sm font-semibold">Alternate Contact:</div>
                                                    <div className="md:text-xl text-sm">{complaint?.alternateContactInfo}</div>
                                                </>
                                            }

                                            <div className='md:text-xl text-sm font-semibold'>Service Address : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.serviceAddress}</div>
                                            <div className='md:text-xl text-sm font-semibold'>Pincode : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.pincode}</div>
                                            <div className='md:text-xl text-sm font-semibold'>District : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.district}</div>
                                            <div className='md:text-xl text-sm font-semibold'>State : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.state}</div>
                                            <div className='md:text-xl text-sm font-semibold'>Customer Side Pending : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.cspStatus || "No"}</div>
                                            <div className='md:text-xl text-sm font-semibold'>Stock Complaint : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.stockComplaint === true ? "Yes" : "No"}</div>
                                            <div className='md:text-xl text-sm font-semibold'>Warranty Status : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.warrantyStatus === true ? "In Warranty" : "No"}</div>
                                            {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" ?
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'>Purchase Date  : </div>
                                                    <div className='md:text-xl text-sm  '>{new Date(complaint?.purchaseDate).toLocaleString()}   </div>
                                                </> : ""

                                            }
                                            {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" || value?.user?.role === "USER" ?
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'> OTP  : </div>
                                                    <div className='md:text-xl flex justify-center items-center p-2 bg-green-400 text-center rounded-md font-bold text-sm '><div>{complaint?.otp}</div></div>
                                                </> : ""

                                            }
                                            {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" ?
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'>Created By  : </div>
                                                    <div className='md:text-xl flex justify-center items-center p-2 bg-[#f7bab7] text-center rounded-md font-bold text-sm'> {complaint?.createEmpName || complaint?.empName} </div>
                                                </> : ""

                                            }
                                            {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" ?
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'>Cancel Comp  : </div>
                                                    <div className='md:text-xl text-sm  '>{complaint?.cancelComp}   </div>
                                                </> : ""

                                            }

                                            {/* {value?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" ?
                                    <>
                                        <div className='md:text-xl text-sm font-semibold'> Emp Id  : </div>
                                        <div className='md:text-xl text-sm'> {complaint?.empId} </div>
                                    </> : ""

                                } */}
                                            <div className='md:text-xl text-sm font-semibold'>AssignServiceCenter : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.assignServiceCenter}</div>
                                            {value?.user?._id === "67cabc9ce8b5a90df33f977a" && (<div className="md:text-xl text-sm font-semibold">
                                                Assign Service Center Address:
                                            </div>
                                            )}
                                            {value?.user?._id === "67cabc9ce8b5a90df33f977a" && (
                                                <div className="p-4 border rounded-lg shadow-md bg-white space-y-1">

                                                    <div className="md:text-xl text-sm">Street: {serviceCenter?.streetAddress}</div>
                                                    <div className="md:text-xl text-sm">City: {serviceCenter?.city}</div>
                                                    <div className="md:text-xl text-sm">State: {serviceCenter?.state}</div>
                                                    <div className="md:text-xl text-sm">Postal Code: {serviceCenter?.postalCode}</div>
                                                    <div className="md:text-xl text-sm">Country: India</div>
                                                </div>
                                            )}

                                            {value?.user?.role === "BRAND" ? ""
                                                : <>
                                                    <div className='md:text-xl text-sm font-semibold'>AssignServiceCenter contact : </div>
                                                    <div className='md:text-xl text-sm '>{complaint?.serviceCenterContact}</div>
                                                </>

                                            }

                                            {value?.user?.role === "ADMIN" ?
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'> ServiceCenter Payment : </div>
                                                    <div className='md:text-xl text-sm '>{complaint?.paymentServiceCenter}</div>
                                                </> : ""

                                            }

                                            <div className='md:text-xl text-sm font-semibold'> Sparepart   : </div>
                                            <div>
                                                {matchedSpareParts.length > 0 ? (
                                                    <div className="mt-8">
                                                        {/* <h3 className="text-xl font-bold mb-4">Matched Spare Parts</h3> */}
                                                        <ul className=" ">
                                                            {matchedSpareParts.map((part, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="bg-gray-100 p-4 rounded-lg shadow hover:bg-blue-50 cursor-pointer"
                                                                    onClick={() => router.push(`/product/sparepart/details/${part._id}`)}
                                                                >
                                                                    <div className="font-bold text-lg">Sparepart Name : {part.partName}</div>
                                                                    <div className="text-sm text-gray-700">Part No: {part.partNo}</div>
                                                                    {/* <div className="text-sm text-gray-700">SKU No: {part.skuNo}</div>
                                                    <div className="text-sm text-gray-700">MRP: ₹{part.MRP}</div>
                                                    <div className="text-sm text-gray-700">Best Price: ₹{part.bestPrice}</div>
                                                    <div className="text-sm text-gray-700">Brand: {part.brandName}</div>
                                                    <div className="text-sm text-gray-700">Category: {part.category}</div>
                                                    <div className="text-sm text-gray-700">Seller: {part.seller}</div>
                                                    <div className="text-sm text-gray-700">Dimensions: {part.length} x {part.breadth} x {part.height}</div>
                                                    <div className="text-sm text-gray-700">Weight: {part.weight} kg</div>
                                                    <div className="text-sm text-gray-700">Status: {part.status}</div>

                                                    {part.products?.length > 0 && (
                                                        <div className="text-sm text-gray-700 mt-1">
                                                            Products:
                                                            <ul className="ml-4 list-disc">
                                                                {part.products.map((product, i) => (
                                                                    <li key={i}>{product.productName}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )} */}

                                                                    {part.images?.length > 0 && (
                                                                        <div className="mt-2 flex  gap-2">
                                                                            <div>Sparepart Image : </div>
                                                                            {part.images.map((image, i) => (
                                                                                <img
                                                                                    key={i}
                                                                                    src={image}
                                                                                    alt={`Part image ${i + 1}`}
                                                                                    className="w-20 h-20 object-cover rounded border"
                                                                                />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )
                                                    : "Sparepart not match this product id"}
                                            </div>
                                            <div className='md:text-xl text-sm font-semibold'> Service center fill   : </div>
                                            <div className=" space-y-6 mt-8 bg-gray-100 p-4 rounded-lg shadow hover:bg-blue-50 cursor-pointer">


                                                <div className="bg-gray-100 p-4 rounded-md shadow-sm mb-4">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-semibold text-gray-700">Assigned Slot:</span>
                                                        <span className="text-sm text-gray-900">
                                                            {complaint?.assignedTimeSlot || (
                                                                <span className="italic text-gray-500">Not Assigned</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>



                                                <div>
                                                    {value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE" ?
                                                        <button
                                                            onClick={handleShowContact}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                                        >
                                                            {complaint?.showCustomerNumberTimestamp ? complaint?.phoneNumber : "Show Customer Number"}
                                                        </button>
                                                        : ""}

                                                    {/* Show timestamp if exists */}
                                                    {complaint?.showCustomerNumberTimestamp && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            Viewed on: {new Date(complaint.showCustomerNumberTimestamp).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>



                                                {value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE" ?
                                                    <div>
                                                        <label className="block font-medium mb-1">Upload Audio</label>
                                                        <input
                                                            type="file"
                                                            accept="audio/*"
                                                            onChange={(e) => setAudioFile(e.target.files[0])}
                                                            className="mb-2 w-full"
                                                        />
                                                        <button
                                                            onClick={handleAudioUpload}
                                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                                        >
                                                            Upload Audio
                                                        </button>
                                                    </div>
                                                    : ""
                                                }

                                                {complaint?.audioRecording && (
                                                    <div>
                                                        <label className="block font-medium mb-1">Audio Recording</label>
                                                        <audio controls src={complaint?.audioRecording} className="w-full mt-2 rounded border" />
                                                    </div>
                                                )}


                                                {value?.user?.role === "EMPLOYEE" || value?.user?.role === "SERVICE" ?
                                                    <div>
                                                        <label className="block font-semibold mb-1">Update Assigned Time Slot</label>

                                                        <select
                                                            className="w-full border border-gray-300 rounded p-2"
                                                            value={slot}
                                                            onChange={handleSlot}
                                                            disabled={loading}
                                                        >
                                                            <option value="">Select Slot</option>
                                                            <option value="10 AM - 12 PM">10 AM - 12 PM</option>
                                                            <option value="12 PM - 3 PM">12 PM - 3 PM</option>
                                                            <option value="3 PM - 6 PM">3 PM - 6 PM</option>
                                                        </select>

                                                    </div>
                                                    : ""}

                                            </div>

                                            <div className='md:text-xl text-sm font-semibold'>Service Center visit : </div>
                                            <div className='md:text-xl text-sm '>{complaint?.visitTechnician}</div>
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
                                            {complaint?.issueImages && (
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'>Image : </div>
                                                    <div>
                                                        <img

                                                            src={complaint?.issueImages}
                                                            height="200px"
                                                            width="200px"
                                                            className='m-2'
                                                            alt='image'
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {complaint?.partImage && (
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'>Replace Part Image : </div>
                                                    <div>
                                                        <img

                                                            src={complaint?.partImage}
                                                            height="200px"
                                                            width="200px"
                                                            className='m-2'
                                                            alt='image'
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {complaint?.partPendingImage && (
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'> Part Pending Image : </div>
                                                    <div>
                                                        <img

                                                            src={complaint?.partPendingImage}
                                                            height="200px"
                                                            width="200px"
                                                            className='m-2'
                                                            alt='image'
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {complaint?.defectivePartImage && (
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'> Goods Image : </div>
                                                    <div>
                                                        <img

                                                            src={complaint?.goodsImage}
                                                            height="200px"
                                                            width="200px"
                                                            className='m-2'
                                                            alt='image'
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {complaint?.defectivePartImage && (
                                                <>
                                                    <div className='md:text-xl text-sm font-semibold'> Defective Part Image : </div>
                                                    <div>
                                                        <img

                                                            src={complaint?.defectivePartImage}
                                                            height="200px"
                                                            width="200px"
                                                            className='m-2'
                                                            alt='image'
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                    </div>
                                    <div className='md:p-4 p-2'>
                                        <div className='md:text-xl text-sm font-semibold'> Part Pending Video : </div>
                                        {complaint.partPendingVideo ? (
                                            <div className="mt-4">

                                                <iframe
                                                    src={`https://drive.google.com/file/d/${getGoogleDriveFileId(complaint.partPendingVideo)}/preview`}
                                                    width="50%"
                                                    height="300px"
                                                    allow="autoplay"
                                                    allowFullScreen
                                                    className="rounded shadow"
                                                />
                                            </div>)
                                            : "Part Pending Video not uploaded."
                                        }
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
                                                                    <strong>{key.replace(/\b\w/, (char) => char.toUpperCase())}:</strong>{" "}
                                                                    {typeof value === "string" ? makeLinksClickable(value) : value}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Update History Section */}
                                            <div className="border p-4 rounded-lg">
                                                <h2 className="text-xl font-bold mb-2">Update History</h2>

                                                {/* <div className="  w-full space-y-3">
                                                    {complaint?.updateHistory?.map((history) => (
                                                        <div key={history._id} className="border-b pb-2">
                                                            <p className="text-sm text-gray-500">
                                                                <strong>Updated At:</strong> {new Date(history.updatedAt).toLocaleString()}
                                                            </p>
                                                            {Object.entries(history.changes).map(([key, value]) =>
                                                                key !== "serviceCenterContact" ? ( // Exclude serviceCenterContact
                                                                    <p key={key} className="text-sm">
                                                                        <strong>{key.replace(/\b\w/, (char) => char.toUpperCase())}:</strong>{" "}
                                                                        {typeof value === "string" ? makeLinksClickable(value) : value}
                                                                    </p>
                                                                ) : null
                                                            )}
                                                        </div>
                                                    ))}
                                                </div> */}
                                                <div className="w-full space-y-3">
                                                    {complaint?.updateHistory?.map((history) => (
                                                        <div key={history._id} className="border-b pb-2">
                                                            <p className="text-sm text-gray-500">
                                                                <strong>Updated At:</strong> {new Date(history.updatedAt).toLocaleString()}
                                                            </p>
                                                            {Object.entries(history.changes).map(([key, value]) =>
                                                                !["serviceCenterContact", "assignServiceCenterId", "empId"].includes(key) ? (
                                                                    <p key={key} className="text-sm">
                                                                        <strong>{key.replace(/\b\w/, (char) => char.toUpperCase())}:</strong>{" "}
                                                                        {typeof value === "string" ? makeLinksClickable(value) : value}
                                                                    </p>
                                                                ) : null
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className='  '>
                                        {loading === true ? (
                                            <div className="h-[400px] flex justify-center items-center">
                                                <ReactLoader />
                                            </div>
                                        ) : (
                                            <UserAllServicesList data={userComp} />
                                        )}
                                    </div>
                                </div>
                            }
                        </>
                    }
                </div>

            </Sidenav >
        </>

    )
}

export default ComplaintDetails





