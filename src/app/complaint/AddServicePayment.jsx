import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import { Close, Payment } from "@mui/icons-material";
import { ReactLoader } from "../components/common/Loading";
import { ToastMessage } from "../components/common/Toastify";
import { Toaster } from "react-hot-toast";
import http_request from "../../../http-request";

const AddServicePaymentModal = ({ complaint, RefreshData }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue, getValues,
        reset,
    } = useForm();

    const handleOpen = () => {
        setOpen(true);

        // Pre-fill from complaint
        if (complaint) {
            setValue("serviceCenterName", complaint.assignServiceCenter || "");
            setValue("serviceCenterId", complaint.assignServiceCenterId || "");
            setValue("complaintId", complaint._id || "");
            setValue("contactNo", complaint.serviceCenterContact || "");
            setValue("city", complaint.district || "");
            setValue("address", complaint.serviceAddress || complaint.serviceLocation || "");
        }
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const handlePayment = async ( ) => {


        const data = getValues(); // Get all form values
        if (!data.serviceCenterName) {
            alert("Service Center Name is required");
            return;
        }

        if (!data.payment || isNaN(data.payment) || Number(data.payment) <= 0) {
            alert("Please enter a valid payment amount");
            return;
        }

        if (!data.description) {
            alert("Description is required");
            return;
        }

        if (!data.contactNo || !/^\d{10}$/.test(data.contactNo)) {
            alert("Please enter a valid 10-digit contact number");
            return;
        }

        if (!data.complaintId) {
            alert("Complaint ID is required");
            return;
        }

        if (!data.city) {
            alert("City is required");
            return;
        }
        if (!data.qrCode) {
            alert("QR code is required");
            return;
        }

        if (data.qrCode && data.qrCode.length > 0) {
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (!allowedTypes.includes(data.qrCode[0].type)) {
                alert("Invalid QR Code format. Please upload a JPEG or PNG image.");
                return;
            }
        }
        // Create FormData
        const formData = new FormData();
        formData.append("serviceCenterName", data.serviceCenterName);
        formData.append("serviceCenterId", data.serviceCenterId);
        formData.append("payment", data.payment);
        formData.append("description", data.description);
        formData.append("contactNo", data.contactNo);
        formData.append("complaintId", data.complaintId);
        formData.append("city", data.city);
        formData.append("address", data.address);

        // Append QR code if exists
        if (data.qrCode && data.qrCode.length > 0) {
            formData.append("qrCode", data.qrCode[0]);
        }

        setLoading(true);
        try {
            const response = await http_request.post("/addServicePayment", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            })


            ToastMessage(response?.data);
            RefreshData(response?.data);

            handleClose();
        } catch (error) {
            console.error("Error processing payment", error);
            ToastMessage(error?.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster />
            {/* Trigger Button */}
            <div
                onClick={handleOpen}
                className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
            >
                <Payment color="success" />
            </div>

            {/* Modal */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Service Center Payment</DialogTitle>
                <IconButton
                    onClick={handleClose}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                >
                    <Close />
                </IconButton>
                <DialogContent>
                    {loading ? (
                        <div className="w-[400px] h-[400px] flex justify-center items-center">
                            <ReactLoader />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(handlePayment)}>
                            {/* Service Center Name */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Service Center Name</label>
                                <input
                                    type="text"
                                    {...register("serviceCenterName", { required: "Service Center Name is required" })}
                                    readOnly
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                {errors.serviceCenterName && <p className="text-red-500 text-sm mt-1">{errors.serviceCenterName.message}</p>}
                            </div>

                            {/* Payment */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Payment</label>
                                <input
                                    type="text"
                                    {...register("payment", {
                                        required: "Payment is required",
                                        pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid payment amount" },
                                    })}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                {errors.payment && <p className="text-red-500 text-sm mt-1">{errors.payment.message}</p>}
                            </div>

                            {/* Description */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    {...register("description", {
                                        required: "Description is required",
                                        minLength: { value: 10, message: "Description must be at least 10 characters long" },
                                    })}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            {/* Contact Number */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                                <input
                                    type="text"
                                    {...register("contactNo", {
                                        required: "Contact number is required",
                                        pattern: { value: /^[0-9]{10}$/, message: "Invalid phone number" },
                                    })}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                {errors.contactNo && <p className="text-red-500 text-sm mt-1">{errors.contactNo.message}</p>}
                            </div>

                            {/* Complaint ID */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Complaint ID</label>
                                <input
                                    type="text"
                                    {...register("complaintId", { required: "Complaint ID is required" })}
                                    readOnly
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                {errors.complaintId && <p className="text-red-500 text-sm mt-1">{errors.complaintId.message}</p>}
                            </div>

                            {/* City */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    {...register("city", { required: "City is required" })}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                            </div>

                            {/* Address */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <input
                                    {...register("address", { required: "Address is required" })}
                                    className="mt-1 p-3 block w-full rounded-md border border-gray-300 shadow-sm"
                                />
                                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                            </div>

                            {/* QR Code Upload */}
                            <div className="w-[350px] mb-5">
                                <label className="block text-sm font-medium text-gray-700">Upload QR Code</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register('qrCode', {
                                        required: 'QR Code is required',
                                    })}
                                    className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500 file:bg-indigo-500 file:text-white file:px-4 file:py-2 file:rounded-md"
                                />
                                {errors.qrCode && (
                                    <p className="text-red-500 text-sm mt-1">{errors.qrCode.message}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="rounded-lg w-full p-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Submitting..." : "Payment Request"}
                                </button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddServicePaymentModal;
