import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const EditTechProfile = ({ editData, RefreshData, onClose,userData }) => {


    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState("");
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    
    const EditTechProfileData = async (data) => {
        try {

            setLoading(true);
            const endpoint =   `/editTechnician/${editData._id}`  ;
            const response =   await http_request.patch(endpoint, data)  ;
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
        EditTechProfileData(data);
    };

    
    React.useEffect(() => {
        if (editData) {
            setValue('name', editData.name);
            setValue('email', editData.email);
            setValue('password', editData.password);
            setValue('contact', editData.contact);
            setValue('address', editData.address);
        }
    }, [editData,refresh, setValue]);

    return (
        <div>
            <form className="grid grid-cols-1 gap-3" onSubmit={handleSubmit(onSubmit)}>
                <div className=' mt-2'>
                    <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                        Name
                    </label>
                    <div className=" ">
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('name', { required: '  Name is required', minLength: { value: 3, message: '  Name must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.name ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div className=' '>
                    <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                        Email
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="off"
                            required
                            {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.email ? 'border-red-500' : ''}`}
                          />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div>
                    <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
                      Contact No.
                    </label>
                    <div className="mt-2">
                      <input
                        id="contact"
                        name="contact"
                        type="number"
                        autoComplete="tel"
                        required
                        {...register('contact', { required: 'Contact number is required', pattern: { value: /^\d{10}$/, message: 'Contact No. must be at least 10 characters long' } })}
                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.contact ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="text"
                        autoComplete="new-password"
                        required
                        {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters long' } })}
                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                 
               
                  <div className='md:col-span-2'>
                    <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                     Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="address"
                        name="address"
                        type="text"
                        autoComplete="name"
                        required
                        {...register('address', { required: 'address is required', minLength: { value: 10, message: 'address must be at least 10 characters long' } })}
                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.address ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
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

export default EditTechProfile;
