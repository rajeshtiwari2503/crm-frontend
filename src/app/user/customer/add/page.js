
"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';


const AddBrand = () => {

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const RegiterUser = async (reqdata) => {
        try {
            setLoading(true)

            let response = await http_request.post('/userRegistration', reqdata)
            const { data } = response
            ToastMessage(data)
            setLoading(false)
            router.push("/user/customer")
        }
        catch (err) {
            setLoading(false)
            ToastMessage(err.response.data)

            console.log(err);
        }

    }

    const onSubmit = (data) => {
        RegiterUser(data)
    };



    return (
        <>
         
            <Sidenav >
                <div className=" ">
                    <div  >
                        <h2 className=" text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Create a new Customer
                        </h2>

                        <form className=" grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="email"
                                        required
                                        {...register('name', { required: 'Name is required', minLength: { value: 3, message: 'Name must be at least 3 characters long' } })}
                                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.email ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
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
                                        className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.contact ? 'border-red-500' : ''
                                            }`}

                                    />
                                </div>
                                {(errors.contact) && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.contact ? errors.contact.message : 'Contact number is required'}
                                    </p>
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

                        </form>
                        <div className='mt-5  '>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleSubmit(onSubmit)}
                                className="flex   justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>


            </Sidenav>
        </>

    )
}

export default AddBrand





