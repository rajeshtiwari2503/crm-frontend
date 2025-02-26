"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import http_request from "../../../../../../http-request";
import Sidenav from "@/app/components/Sidenav";
import { ToastMessage } from "@/app/components/common/Toastify";
import { useRouter } from "next/navigation";
import Select from "react-select";

const Editemployee = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("");
    const [employee, setEmployee] = useState("");
    const [loading, setLoading] = useState(false);

    const [states, setStates] = useState([]);
    const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm();

    useEffect(() => {
        getEmployeeById();

    }, [id]);

    useEffect(() => {
        if (employee) {
            setValue("name", employee.name);
            setValue("email", employee.email);
            setValue("contact", employee.contact);
            setValue("password", employee.password);

            // Fix: Store only the array of selected values, not objects
            const formattedStateZone = employee.stateZone || [];
            setValue("stateZone", formattedStateZone);
        }
    }, [employee, setValue]);



    const getEmployeeById = async () => {
        try {
            let response = await http_request.get(`/getEmployeeBy/${params.id}`);
            let { data } = response;
            setEmployee(data);
            setId(data?._id);
        } catch (err) {
            console.log(err);
        }
    };



    const UpdateEmployee = async (reqdata) => {
        try {
            setLoading(true);
            let response = await http_request.patch(`/editEmployee/${id}`, reqdata);
            ToastMessage(response.data);
            setLoading(false);
            router.push("/user/employee");
        } catch (err) {
            setLoading(false);
            ToastMessage(err.response.data);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        UpdateEmployee(data);
    };


    useEffect(() => {
        const loadFileFromPublic = async () => {
            try {
                const response = await fetch("/INpostalCode.txt");
                if (!response.ok) throw new Error("Failed to fetch file");

                const text = await response.text();
                const lines = text.trim().split("\n");
                const uniqueStates = new Set();

                lines.forEach((line) => {
                    const parts = line.split("\t").map((s) => s.trim());
                    if (parts.length >= 4) { // Assuming state is in the 4th column
                        uniqueStates.add(parts[3]);
                    }
                });

                const stateOptions = [...uniqueStates].map((state) => ({
                    label: state,
                    value: state
                }));
                setStates(stateOptions);
            } catch (error) {
                console.error("Error loading file:", error);
            }
        };

        loadFileFromPublic();
    }, []);


    return (
        <Sidenav>
            <div className="h-screen flex justify-center items-center bg-gray-100 p-6">
                <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
                        Edit Employee
                    </h2>

                    <form className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Name is required", minLength: 3 })}
                                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Email</label>
                            <input
                                type="email"
                                {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Contact No.</label>
                            <input
                                type="number"
                                {...register("contact", { required: "Contact number is required", pattern: /^\d{10}$/ })}
                                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
                            />
                            {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900">Password</label>
                            <input
                                type="text"
                                {...register("password", { required: "Password is required", minLength: 8 })}
                                className="w-full p-3 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        {/* State Zones (Multi-Select) */}

                        <div className="mb-4 w-full">
                            <label className="block text-gray-700 font-medium mb-2">States:</label>
                            <Controller
                                name="stateZone"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={states}
                                        isMulti
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        getOptionLabel={(e) => e.label}
                                        getOptionValue={(e) => e.value}
                                        value={states.filter((s) => field.value?.includes(s.value))}
                                        onChange={(selected) => {
                                            const selectedValues = selected.map((s) => s.value);
                                            field.onChange(selectedValues);
                                            setValue("stateZone", selectedValues); // Sync with React Hook Form
                                        }}
                                    />
                                )}
                            />

                        </div>



                        {/* Submit Button */}
                        <div className="col-span-2 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full max-w-xs px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            >
                                {loading ? "Updating..." : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidenav>
    );
};

export default Editemployee;
