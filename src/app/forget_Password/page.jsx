"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import InputIcon from '@mui/icons-material/Input';
import { useForm } from 'react-hook-form';
import http_request from '../../../http-request'
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ForgetPassword = () => {

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [value, setValue] = React.useState("user@gmail.com");

    React.useEffect(() => {
        const storedValue = localStorage.getItem("userEmail");
        if (storedValue) {
            setValue(JSON.parse(storedValue));
        }
    }, []);

    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const forgetPass = async (reqdata) => {
        try {
            setLoading(true)

            let response = await http_request.patch('/forgetPassword', { password: reqdata?.password, email: value })
            const { data } = response
            ToastMessage(data)
            setLoading(false)
            router.push("/sign_in")
        }
        catch (err) {
            setLoading(false)
            ToastMessage(err.response.data)

            console.log(err);
        }

    }

    const onSubmit = (data) => {
        forgetPass(data)
    };



    return (
        <>
            {/* <Toaster /> */}
            <div className="flex justify-center mt-4">
                <div style={{ minWidth: "30%" }}>
                    <div className="shadow-lg flex min-h-full flex-1 flex-col justify-center px-6 py-4 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className="flex justify-center">
                                <InputIcon fontSize="large" />
                            </div>
                            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Create a new Password
                            </h2>
                        </div>

                        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

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
                                <div>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleSubmit(onSubmit)}
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </form>

                            <p className="mt-10 text-center text-sm text-gray-500">
                                Already registered?{' '}
                                <Link href="/sign_in" className="cursor-pointer font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ForgetPassword