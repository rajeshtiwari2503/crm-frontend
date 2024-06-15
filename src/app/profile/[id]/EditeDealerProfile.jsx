import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const EditDealerProfile = ({ editData, RefreshData, onClose, userData }) => {


    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState("");
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const EditDealerProfileData = async (data) => {
        try {

            setLoading(true);
            const endpoint = `/editDealer/${editData._id}`;
            const response = await http_request.patch(endpoint, data);
            const { data: responseData } = response;

            ToastMessage(responseData);
            setLoading(false);
            setRefresh(responseData);
            RefreshData(responseData);
            onClose(true);
        } catch (err) {
            setLoading(false);
            ToastMessage(err?._message);
            onClose(true);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        EditDealerProfileData(data);
    };


    React.useEffect(() => {
        if (editData) {
            setValue('name', editData.name);
            setValue('email', editData.email);
            setValue('password', editData.password);
            setValue('contact', editData.contact);
            setValue('businessAddress', editData.businessAddress);
            setValue('contactPerson', editData.contactPerson);
            setValue('businessRegistrationNumber', editData.businessRegistrationNumber);
            setValue('gstVatNumber', editData.gstVatNumber);
        }
    }, [editData, refresh, setValue]);

    return (
        <div>
            <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
                <div className='  '>

                    <label htmlFor="businessName" className="block text-sm font-medium leading-6 text-gray-900">
                        Business Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="organization"
                            {...register("name", { required: 'Business name is required', minLength: { value: 3, message: 'Business name must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.name ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div className=" ">
                    <label htmlFor="businessAddress" className="block text-sm font-medium leading-6 text-gray-900">
                        Business Address
                    </label>
                    <div className="mt-2">
                        <input
                            id="businessAddress"
                            name="businessAddress"
                            type="text"
                            autoComplete="street-address"
                            {...register("businessAddress", { required: 'Business address is required' })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.businessAddress ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.businessAddress && <p className="text-red-500 text-sm mt-1">{errors.businessAddress.message}</p>}
                </div>
                <div>
                    <label htmlFor="contactPerson" className="block text-sm font-medium leading-6 text-gray-900">
                        Contact Person
                    </label>
                    <div className="mt-2">
                        <input
                            id="contactPerson"
                            name="contactPerson"
                            type="text"
                            autoComplete="name"
                            {...register("contactPerson", { required: 'Contact person is required' })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.contactPerson ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.contactPerson && <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>}
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium leading-6 text-gray-900">
                        Contact Email
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            {...register("email", { required: 'Contact email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.email ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="contactPhoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                        Contact Phone Number
                    </label>
                    <div className="mt-2">
                        <input
                            id="contact"
                            name="contact"
                            type="text"
                            autoComplete="tel"
                            {...register("contact", { required: 'Contact phone number is required', pattern: { value: /^\d{10}$/, message: 'Invalid phone number' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.contact ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                </div>
                <div>
                    <label htmlFor="businessRegistrationNumber" className="block text-sm font-medium leading-6 text-gray-900">
                        Business Registration Number
                    </label>
                    <div className="mt-2">
                        <input
                            id="businessRegistrationNumber"
                            name="businessRegistrationNumber"
                            type="text"
                            {...register("businessRegistrationNumber", { required: 'Business registration number is required' })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.businessRegistrationNumber ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.businessRegistrationNumber && <p className="text-red-500 text-sm mt-1">{errors.businessRegistrationNumber.message}</p>}
                </div>
                <div>
                    <label htmlFor="gstVatNumber" className="block text-sm font-medium leading-6 text-gray-900">
                        GST/VAT Number
                    </label>
                    <div className="mt-2">
                        <input
                            id="gstVatNumber"
                            name="gstVatNumber"
                            type="text"
                            {...register("gstVatNumber", { required: 'GST/VAT number is required' })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.gstVatNumber ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.gstVatNumber && <p className="text-red-500 text-sm mt-1">{errors.gstVatNumber.message}</p>}
                </div>
                <div className=" ">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            {...register("password", { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'ring-red-500' : ''}`}
                        />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>
                <div className='flex justify-between mt-8'>
                    <Button variant="outlined" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                        Cancel
                    </Button>
                    {editData?._id ? (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Update
                        </Button>
                    ) : (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Add
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditDealerProfile;
