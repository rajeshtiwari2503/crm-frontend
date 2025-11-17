 "use client";

import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import http_request from '../../../../../../http-request';
import Sidenav from '@/app/components/Sidenav';
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import Select from "react-select";
import { Add, Delete } from '@mui/icons-material';

const EditDealer = ({params}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dealerId = params.id;
    const [loading, setLoading] = useState(false);
    const [dealerData, setDealerData] = useState(null);

    const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm({
        defaultValues: { locations: [{ state: "", city: "", otherCities: [] }] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "locations" });
    const jsonData = watch("jsonData") || {};
    const selectedState = watch("state");

    useEffect(() => {
        const fetchDealerData = async () => {
            try {
                const response = await http_request.get(`/getDealerBy/${params.id}`);
                setDealerData(response.data);
                setValue("name", response.data.name);
                setValue("email", response.data.email);
                setValue("contact", response.data.contact);
                setValue("locations", response.data.locations.map(location => ({
                    state: location.state,
                    city: location.city,
                    otherCities: location.otherCities.map(city => ({ value: city, label: city })) // Format for react-select
                })));
            } catch (error) {
                console.error("Error fetching dealer data:", error);
            }
        };
         fetchDealerData();
    }, [ ]);

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
                        const state = parts[3];
                        const district = parts[5];

                        if (!stateData[state]) {
                            stateData[state] = {};
                        }
                        if (!stateData[state][district]) {
                            stateData[state][district] = [];
                        }
                    }
                });

                setValue("jsonData", stateData);
            } catch (error) {
                console.error("Error loading file:", error);
            }
        };

        loadFileFromPublic();
    }, [setValue]);

    const UpdateDealer = async (reqdata) => {
        try {
            setLoading(true);
            const formattedLocations = reqdata.locations.map((location) => ({
                state: location.state,
                city: location.city,
                otherCities: location.otherCities?.map(city => city.value) || []
            }));

            const updateData = {
                name: reqdata.name,
                contact: reqdata.contact,
                email: reqdata.email,
                locations: formattedLocations,
            };

            let response = await http_request.patch(`/editDealer/${dealerId}`, updateData);
            const { data } = response;
            ToastMessage(data);
            setLoading(false);
            router.push("/user/dealer");
        } catch (err) {
            setLoading(false);
            ToastMessage(err.response?.data);
            console.log(err);
        }
    };

    return (
        <Sidenav>
            <div>
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">Edit Dealer</h2>
                <form className="grid md:grid-cols-1 gap-2" onSubmit={handleSubmit(UpdateDealer)}>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Name</label>
                        <input {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Must be at least 3 characters' } })} className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600" />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Email</label>
                        <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })} className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600" />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Contact No.</label>
                        <input type="number" {...register('contact', { required: 'Contact is required', pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' } })} className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600" />
                        {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
                    </div>
                    {fields.map((field, index) => {
                        const selectedState = watch(`locations.${index}.state`);

                        return (
                            <div key={field.id} className="border p-4 rounded-lg space-y-3">
                                {/* State Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-900">State</label>
                                    <select {...register(`locations.${index}.state`)} className="border w-full p-2 rounded mt-2 block">
                                        <option value="">Select State</option>
                                        {Object.keys(jsonData).map((state) => (
                                            <option key={state} value={state}>
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* District Dropdown */}
                                {selectedState && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">District</label>
                                        <select {...register(`locations.${index}.city`)} className="border w-full p-2 rounded mt-2 block">
                                            <option value="">Select District</option>
                                            {Object.keys(jsonData[selectedState] || {}).map((district) => (
                                                <option key={district} value={district}>
                                                    {district}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Multi-Select Districts */}
                                {selectedState && jsonData[selectedState] && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900">Select District(s)</label>
                                        <Controller
                                            name={`locations.${index}.otherCities`}
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

                                {/* Remove Button */}
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
                                    >
                                        <Delete fontSize="small" />
                                    </button>
                                )}


                            </div>
                        );
                    })}

                    {/* Add Button */}
                    <div>
                        <button
                            type="button"
                            onClick={() => append({ state: "", city: "", otherCities: [] })}
                            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
                        >
                            <Add fontSize="small" />
                        </button>
                    </div>

                    <div className='w-full'>
                        {selectedState && jsonData[selectedState] && (
                            <div  >
                                <label className="block  w-full text-sm font-medium text-gray-900">Select District(s)</label>
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
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update Dealer</button>
                </form>
            </div>
        </Sidenav>
    );
};

export default EditDealer;
