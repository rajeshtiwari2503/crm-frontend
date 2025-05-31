import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Dialog, DialogTitle, DialogContent, IconButton, Button
} from '@mui/material';
import { Close, SystemSecurityUpdate } from '@mui/icons-material';
import http_request from '../../../http-request';
import { useUser } from '../components/UserContext';
import { ReactLoader } from '../components/common/Loading';
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';


const UpdateComplaintModal = ({ complaintId, RefreshData }) => {
    const [open, setOpen] = useState(false);

    const [matchedSpareParts, setMatchedSpareParts] = useState([]);

    const [otpVerified, setOtpVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState("");
    const [generatedOtp, setGeneratedOtp] = useState("");

    const { register, handleSubmit, control, formState: { errors }, setValue, watch, reset } = useForm();
    const { fields, append, remove } = useFieldArray({ control, name: "spareParts" });

    const useSpareParts = watch("useSpareParts");

    const compStatus = watch("status");

    const { user } = useUser();

    const userData = user?.user
    const handleOpen = async () => {
        try {

            setOpen(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = () => {
        setOpen(false);
        reset();

        setOtpVerified(false);
        setEnteredOtp("");
        setGeneratedOtp("");
    };


    const sendOTP = async () => {
        setLoading(true); // start loading
        try {
            const response = await http_request.post("/send-otp", { complaintId });
            if (response.data.success) {
                setGeneratedOtp(response.data.otp);

                ToastMessage({ status: true, msg: "OTP sent successfully!" });
            } else {
                ToastMessage({ status: false, msg: "Failed to send OTP." });
            }
        } catch (error) {
            ToastMessage({ status: false, msg: "Error sending OTP." });
        } finally {
            setLoading(false); // stop loading
        }
    };


    const handleVerifyOtp = () => {
        if (enteredOtp === generatedOtp) {
            setOtpVerified(true);
            ToastMessage({ status: true, msg: "OTP Verified!" });
        } else {
            ToastMessage({ status: false, msg: "Invalid OTP" });
        }
    };


    useEffect(() => {
        if (complaintId) {
            fetchComplaintAndParts(complaintId);
        }
    }, [complaintId]);


    const fetchComplaintAndParts = async (complaintId) => {

        try {
            setLoading(true);
            const complaintRes = await http_request.get(`/getComplaintById/${complaintId}`);
            const complaintData = complaintRes.data;
            setGeneratedOtp(complaintData?.otp);
            setValue("brandId", complaintData.brandId || "");
            setValue("brandName", complaintData.productBrand || "");
            setValue("serviceCenterId", complaintData.assignServiceCenterId || "");
            setValue("serviceCenter", complaintData.assignServiceCenter || "");
            const partsRes = await http_request.get("/getAllSparepart");
            const parts = partsRes.data || [];

            const matched = parts.filter(part =>
                part.products?.some(product => product.productId === complaintData?.productId)
            );

            const filteredSpareParts = matched?.filter(part => part.brandId === complaintData?.brandId);
            // console.log("dgghghgd");

            setMatchedSpareParts(filteredSpareParts);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSpareParts = matchedSpareParts;
    // console.log("filteredSpareParts",filteredSpareParts);

    // Watch selected spare parts to prevent duplicates
    const selectedSpareParts = watch("spareParts")?.map(part => part.sparePartId);

    // const onSubmit = async (data) => {

    //     if (userData?.role === "SERVICE" && data?.status === "FINAL VERIFICATION" && !otpVerified) {
    //         alert("Please verify OTP before submitting.");
    //         return;
    //     }
    //     try {
    //         console.log("data", data);

    //         const reqdata =   { status: data?.status, empId: userData._id, empName: userData.name || userData.name , comments: data?.comments, }

    //         const formData = new FormData();
    //         Object.entries(reqdata).forEach(([key, value]) => {
    //             if (value !== undefined && value !== null) {
    //                 formData.append(key, value);
    //             }
    //         });


    //         if (data?.partPendingImage && data.partPendingImage[0]) {
    //             formData.append("partPendingImage", data.partPendingImage[0]); // Assuming file input
    //         }

    //         let response = await http_request.patch(`/updateComplaintWithImage/${complaintId}`, formData
    //         );
    //         let { data: responseData } = response;
    //         if (data.comments) {
    //             updateComment({ comments: data?.comments })
    //         }
    //         setStatus(false)
    //         setAssignTech(false)
    //         props?.RefreshData(responseData)
    //         ToastMessage(responseData);
    //         reset()
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };
    const updateComment = async (data) => {
        try {
            // console.log(id);
            // console.log(data);
            const sndStatusReq = { sndStatus: data.comments, empId: userData._id, empName: userData.name }
            userData?.role === "SERVICE" ? { status: data?.status, sndStatus: data.comments, serviceCenterId: userData._id, serviceCenterName: userData.serviceCenterName } : { sndStatus: data.comments, empId: userData._id, empName: userData.name }
            //    console.log("sndStatusReq",sndStatusReq);

            const response = await http_request.patch(`/updateComplaintComments/${id}`,
                sndStatusReq
            );
            let { data: responseData } = response;

            RefreshData(responseData)
            ToastMessage(responseData);
            reset()
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        if (
            // userData?.role === "SERVICE" &&
            data?.status === "FINAL VERIFICATION"
            && !otpVerified
        ) {
            alert("Please verify OTP before submitting.");
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();

            // Build reqdata cleanly
            const reqdata = {
                status: data?.status,
                comments: data?.comments,
                ...(userData?.role === "SERVICE"
                    ? {
                        serviceCenterId: userData._id,
                        serviceCenterName: userData.serviceCenterName,
                        serviceCenter: userData.serviceCenterName,
                         useSpareParts: data?.useSpareParts
                    }
                    :
                    data?.status === "FINAL VERIFICATION" && data?.useSpareParts === "yes" ? {
                        empId: userData._id,
                        empName: userData.name,
                        serviceCenterId: data.serviceCenterId,
                        serviceCenterName: data.serviceCenter,
                        serviceCenter: data.serviceCenter,
                        useSpareParts: data?.useSpareParts
                    }
                        : {
                            empId: userData._id,
                            empName: userData.name,
                            useSpareParts: data?.useSpareParts,
                            ...(data.status === "CUSTOMER SIDE PENDING" && { cspStatus: "YES" })
                        }

                )
            };
            // console.log("reqdata",reqdata);
            // Add conditional spare part data
            if (data?.useSpareParts === "yes" && data?.status === "FINAL VERIFICATION") {
                reqdata.spareParts = JSON.stringify(data.spareParts || []);
                reqdata.brandId = data.brandId;
                reqdata.brandName = data.brandName;
                 reqdata.data?.useSpareParts;
            }

            // ✅ Append only once per key
            Object.entries(reqdata).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    // If it's spareParts, allow it to be appended even as a stringified array
                    if (key === "spareParts") {
                        formData.append("spareParts", value); // It's already a string
                    } else {
                        formData.set(key, value); // Ensures only one value per key
                    }
                }
            });

            // ✅ Append file separately
            if (data?.partPendingImage?.[0]) {
                formData.append("partPendingImage", data.partPendingImage[0]);
            }


            for (let pair of formData.entries()) {
                console.log(`${pair[0]}:`, pair[1]);
            }

            // API request



            let response = await http_request.patch(`/updateComplaintWithImage/${complaintId}`, formData);
            let { data: responseData } = response;

            if (data.comments) {
                updateComment({ comments: data?.comments });
            }


            RefreshData(responseData);
            ToastMessage(responseData);
            reset();
        } catch (err) {
            console.error(err);

        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Toaster />
            <div
                onClick={handleOpen}
                className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
            >
                <SystemSecurityUpdate />
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Complaint Status</DialogTitle>
                <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <Close />
                </IconButton>
                <DialogContent>
                    {loading === true ? <div className="flex items-center justify-center h-[80vh]">
                        <ReactLoader />
                    </div>
                        : <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='w-[350px] mb-5'>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    {...register('status')}
                                    className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >

                                    <option value="IN PROGRESS">In Progress</option>
                                    <option value="PART PENDING">Awaiting Parts</option>
                                    {userData?.role === "ADMIN" || userData?.role === "EMPLOYEE" ? <option value="CUSTOMER SIDE PENDING">Customer Side Pending</option>
                                        : ""}
                                    <option value="FINAL VERIFICATION">Completed</option>
                                    <option value="CANCELED">Canceled</option>
                                </select>
                            </div>
                            <div className='mb-6'>
                                <label className="block text-gray-700">Comments/Notes</label>
                                <textarea
                                    {...register('comments', {
                                        required: 'Comments are required',
                                        minLength: { value: 10, message: 'Comments must be at least 10 characters' },
                                        maxLength: { value: 500, message: 'Comments cannot exceed 500 characters' }
                                    })}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                ></textarea>
                                {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
                            </div>
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register('partPendingImage'

                                    )}
                                    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 file:bg-indigo-500 file:text-white file:px-4 file:py-2 file:rounded-md"
                                />

                            </div>

                            {compStatus === "FINAL VERIFICATION" && (
                                <div className="mb-4">


                                    <div className="mb-4">
                                        <p className="font-medium mb-2">Do you want to add spare parts?</p>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    value="yes"
                                                    // {...register("useSpareParts")}
                                                    {...register("useSpareParts", { required: "Please select an option" })}
                                                />
                                                Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    value="no"
                                                    // {...register("useSpareParts")}
                                                    {...register("useSpareParts", { required: "Please select an option" })}
                                                />
                                                No
                                            </label>
                                            {errors.useSpareParts && (
                                                <p className="text-red-500 text-sm mt-1">{errors.useSpareParts.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {useSpareParts === "yes" && (
                                        <>
                                            {fields.map((item, index) => (
                                                <div key={item.id} className="mb-4 rounded-md">
                                                    <div className="flex gap-3">
                                                        {/* Spare Part Selection */}
                                                        <select
                                                            {...register(`spareParts.${index}.sparePartId`, { required: "Select a spare part" })}
                                                            onChange={(e) => {
                                                                const selectedPart = filteredSpareParts.find(part => part._id === e.target.value);
                                                                setValue(`spareParts.${index}.sparePartId`, selectedPart?._id || "");
                                                                setValue(`spareParts.${index}.sparePartName`, selectedPart?.partName || "");
                                                            }}
                                                            className="w-full p-2 border rounded"
                                                        >
                                                            <option value="">Select Spare Part</option>
                                                            {filteredSpareParts
                                                                .filter(part => !selectedSpareParts.includes(part._id) || part._id === watch(`spareParts.${index}.sparePartId`))
                                                                .map((part) => (
                                                                    <option key={part._id} value={part._id}>{part.partName}</option>
                                                                ))}
                                                        </select>
                                                        {errors.spareParts?.[index]?.sparePartId && (
                                                            <p className="text-red-500">{errors.spareParts[index].sparePartId.message}</p>
                                                        )}

                                                        {/* Hidden Spare Part Name Field (Auto-filled) */}
                                                        <input type="hidden" {...register(`spareParts.${index}.sparePartName`)} />

                                                        {/* Quantity */}
                                                        <input
                                                            {...register(`spareParts.${index}.quantity`, { required: "Enter quantity" })}
                                                            placeholder="Quantity"
                                                            type="number"
                                                            className="w-1/3 p-2 border rounded"
                                                        />
                                                        {errors.spareParts?.[index]?.quantity && (
                                                            <p className="text-red-500">{errors.spareParts[index].quantity.message}</p>
                                                        )}



                                                        {/* Remove Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            ❌
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Spare Part Button */}
                                            <button
                                                type="button"
                                                onClick={() => append({ sparePartId: "", sparePartName: "", quantity: "" })}
                                                className="bg-[#09090b] text-white p-2 rounded mb-4 cursor-pointer"
                                                disabled={selectedSpareParts?.length >= filteredSpareParts?.length}
                                            >
                                                ➕
                                            </button>
                                        </>
                                    )}


                                    {!otpVerified ? (
                                        <>
                                            <div className="mt-4">
                                                <input
                                                    type="text"
                                                    placeholder="Enter OTP"
                                                    value={enteredOtp}
                                                    onChange={(e) => setEnteredOtp(e.target.value)}
                                                    className="p-2 border border-gray-300 rounded-md w-full"
                                                />
                                            </div>
                                            <div className="mt-5 flex justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => sendOTP(complaintId)}
                                                    className="bg-yellow-500 text-white px-4 py-1 rounded-md"
                                                >
                                                    Resend OTP
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    className="bg-green-500 text-white px-4 py-1 rounded-md"
                                                >
                                                    Verify OTP
                                                </button>

                                            </div>

                                        </>
                                    ) : (
                                        <p className="text-green-600 mt-2">OTP Verified ✅</p>
                                    )}
                                </div>

                            )}
                            <div>
                                <button type="submit"
                                    disabled={(compStatus === "FINAL VERIFICATION" && !otpVerified) || loading}
                                    className="rounded-lg p-2 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Submit
                                </button>
                            </div>
                        </form>
                    }
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UpdateComplaintModal;
