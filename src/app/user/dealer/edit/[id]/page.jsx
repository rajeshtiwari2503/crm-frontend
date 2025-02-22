"use client";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import http_request from '../../../../../../http-request'
import Sidenav from "@/app/components/Sidenav";
import { ToastMessage } from "@/app/components/common/Toastify";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";

const EditDealer = ({params}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dealerId = params.id; // Get dealer ID from query params

    const [loading, setLoading] = useState(false);
    const [dealerData, setDealerData] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        control,
        setValue,
        watch
    } = useForm();

    const jsonData = watch("jsonData") || {};
    const selectedState = watch("state");

    // Fetch existing dealer details
    useEffect(() => {
        const fetchDealerData = async () => {
            
            setLoading(true);
            try {
                const response = await http_request.get(`/getDealerBy/${params.id}`);
                setDealerData(response?.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Error fetching dealer data:", error);
            }
        };

        fetchDealerData();
    }, [dealerId]);
 

    // Load dealer data into form fields
    useEffect(() => {
        if (dealerData) {
            // Populate all fields from dealerData
            Object.keys(dealerData).forEach((key) => {
                setValue(key, dealerData[key]);
            });
    
            // Set the state field
            setValue("state", dealerData.state || "");
    
            // Set the city field
            setValue("city", dealerData.city || "");
    
            // Set otherCities as an array of objects for react-select
            setValue(
                "otherCities",
                dealerData.otherCities?.map((city) => ({ value: city, label: city })) || []
            );
        }
         
    }, [dealerData, setValue]);
    useEffect(() => {
        if (selectedState) {
            setValue("city", ""); // Reset city
            setValue("otherCities", []); // Reset other cities
        }
    }, [selectedState ]); 
    // Load location data from file
    useEffect(() => {
        const loadFileFromPublic = async () => {
            try {
                const response = await fetch("/INpostalCode.txt");
                const text = await response.text();
                const lines = text.trim().split("\n");
                const stateData = {};

                lines.forEach((line) => {
                    const parts = line.split("\t").map((s) => s.trim());
                    if (parts.length >= 5) {
                        const pincode = parts[1];
                        const areaName = parts[2];
                        const state = parts[3];
                        const district = parts[5];

                        if (!stateData[state]) stateData[state] = {};
                        if (!stateData[state][district]) stateData[state][district] = [];
                        stateData[state][district].push({ areaName, pincode });
                    }
                });

                setValue("jsonData", stateData);
            } catch (error) {
                console.error("Error loading file:", error);
            }
        };

        loadFileFromPublic();
    }, [setValue,dealerData]);

    // Update Dealer Handler
    const updateDealer = async (formData) => {
        try {
            setLoading(true);
            const storedValue = localStorage.getItem("user");
            const brand = JSON.parse(storedValue);

            const updatedData = {
                name: formData.name,
                contact: formData.contact,
                email: formData.email,
                state: formData.state,
                city: formData.city,
                // brandId: brand?.user?._id,
                // brandName: brand?.user?.brandName,
                otherCities: formData.otherCities?.map((city) => city.value) || []
            };

            await http_request.patch(`/editDealer/${dealerId}`, updatedData);
            ToastMessage({ message: "Dealer updated successfully!", type: "success" });
            setLoading(false);
            router.push("/user/dealer");
        } catch (err) {
            setLoading(false);
            ToastMessage({ message: err.response?.data || "Update failed", type: "error" });
            console.error(err);
        }
    };

    return (
        <Sidenav>
            <div>
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Edit Dealer
                </h2>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form className="grid gap-2" onSubmit={handleSubmit(updateDealer)}>
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Name</label>
                            <input
                                {...register("name", { required: "Name is required" })}
                                className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Email</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required" })}
                                className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Contact Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Contact No.</label>
                            <input
                                type="number"
                                {...register("contact", { required: "Contact is required" })}
                                className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                            />
                            {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
                        </div>

                        {/* State Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">State</label>
                            <select {...register("state")} className="border w-full p-2 rounded mt-2 block">
                                <option value="">Select State</option>
                                {jsonData && Object.keys(jsonData).map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        {/* City Dropdown */}
                        <div>
                            {selectedState && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">District</label>
                                    <select {...register("city")} className="border w-full p-2 rounded mt-2 block">
                                        <option value="">Select District</option>
                                        {Object.keys(jsonData[selectedState] || {}).map((district) => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Multi-Select Other Cities */}
                        <div>
                            {selectedState && jsonData[selectedState] && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">Other Districts</label>
                                    <Controller
                                        name="otherCities"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={Object.keys(jsonData[selectedState]).map(district => ({
                                                    value: district,
                                                    label: district
                                                }))}
                                                isMulti
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                placeholder="Select districts..."
                                                onChange={(selected) => field.onChange(selected)}
                                            />
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-indigo-600 text-white p-2 rounded-md w-full"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Dealer"}
                        </button>
                    </form>
                )}
            </div>
        </Sidenav>
    );
};

export default EditDealer;
