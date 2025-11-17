"use client"
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import http_request from '../../../../../http-request';
import Sidenav from '@/app/components/Sidenav';
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import Select from "react-select";
import { Add, Delete } from '@mui/icons-material';

const AddDealer = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);



    const { register, handleSubmit, formState: { errors }, getValues, control, setValue, watch } = useForm({
        defaultValues: { locations: [{ state: "", city: "", otherCities: [] }] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "locations" });

    // const RegisterDealer = async (reqdata) => {
    //     try {
    //         setLoading(true);
    //         const storedValue = localStorage.getItem("user");
    //         const brand = JSON.parse(storedValue);

    //         const regist = {
    //             ...reqdata,
    //             brandId: brand?.user?._id,
    //             brandName: brand?.user?.brandName,
    //             otherCities: reqdata.otherCities?.map(city => city.value) || [] // Extract city values
    //         };

    //         let response = await http_request.post('/dealerRegistration', regist);
    //         const { data } = response;
    //         ToastMessage(data);
    //         setLoading(false);
    //         router.push("/user/dealer");
    //     } catch (err) {
    //         setLoading(false);
    //         ToastMessage(err.response.data);
    //         console.log(err);
    //     }
    // };


    const jsonData = watch("jsonData") || {};
    const selectedState = watch("state");
    const selectedDistrict = watch("district");
    const selectedArea = watch("area");

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

                        if (!stateData[state]) {
                            stateData[state] = {};
                        }
                        if (!stateData[state][district]) {
                            stateData[state][district] = [];
                        }
                        stateData[state][district].push({ areaName, pincode });
                    }
                });

                setValue("jsonData", stateData);
            } catch (error) {
                console.error("Error loading file:", error);
            }
        };

        loadFileFromPublic();
    }, [setValue]);

    const RegisterDealer = async (reqdata) => {
        try {
            setLoading(true);
            const storedValue = localStorage.getItem("user");
            const brand = JSON.parse(storedValue);
            const formattedLocations = reqdata.locations.map((location) => ({
                state: location.state,
                city: location.city,
                otherCities: location.otherCities?.map(city => city.value) || []
            }));
            const regist = {

                name: reqdata?.name,
                contact: reqdata?.contact,
                email: reqdata?.email,
                password: reqdata?.password,

                brandId: brand?.user?._id,
                brandName: brand?.user?.brandName,
                // city: reqdata?.city,
                // state: reqdata?.state,
                // otherCities: reqdata.otherCities?.map(city => city.value) || []
                locations: formattedLocations,
            };


            let response = await http_request.post("/dealerRegistration", regist);
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

    // console.log("jsonData", jsonData);


    return (
        <Sidenav>
            <div>
                <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Create a new Dealer
                </h2>

                <form className="grid md:grid-cols-1 sm:grid-cols-1 xs:grid-cols-1 gap-2" onSubmit={handleSubmit(RegisterDealer)}>

                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Name</label>
                        <input
                            {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Must be at least 3 characters' } })}
                            className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Email address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/, message: 'Invalid email' } })}
                            className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Contact Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900">Contact No.</label>
                        <input
                            type="number"
                            {...register('contact', { required: 'Contact is required', pattern: { value: /^\d{10}$/, message: 'Must be 10 digits' } })}
                            className="block p-3 w-full rounded-md border ring-1 ring-gray-300 focus:ring-2 focus:ring-indigo-600"
                        />
                        {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
                    </div>
                    {/* State Dropdown */}
                    {/* 
                    <div  >
                        <label className="block text-sm font-medium text-gray-900">State</label>
                        <select {...register("state")} className="border  w-full  p-2 rounded mt-2 block">
                            <option value="">Select State</option>
                            {jsonData && Object.keys(jsonData).map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                  
                    <div className="w-full" >
                        {selectedState && (
                            <div className="w-full" >
                                <label className="block w-full text-sm font-medium text-gray-900">District</label>
                                <select {...register("city")} className="border  w-full  p-2 rounded mt-2 block">
                                    <option value="">Select District</option>
                                    {Object.keys(jsonData[selectedState] || {}).map((district) => (
                                        <option key={district} value={district}>
                                            {district}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div> */}


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
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long' } })}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            Confirm Password
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                {...register('confirmPassword', { required: 'Confirm Password is required', validate: value => value === getValues('password') || 'The passwords do not match' })}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                    <div className="mt-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </Sidenav>
    );
};

export default AddDealer;
