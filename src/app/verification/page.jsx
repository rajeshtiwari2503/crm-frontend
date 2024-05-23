"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import InputIcon from '@mui/icons-material/Input';
import { ToastMessage } from '../components/common/Toastify';
import http_request from '../../../http-request'

const OtpVerification = () => {
    const [value, setValue] = React.useState("");
    const [emailVerify, setEmailVerify] = React.useState(false);

    React.useEffect(() => {
        const storedValue = localStorage.getItem("userInfo");
        if (storedValue) {
            setValue(JSON.parse(storedValue));
           
        }
      
    }, [ ]);

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, getValues,reset } = useForm();

    
    const verifyOtp = async (reqdata) => {
        try {
            setLoading(true)
            const reqdata1=emailVerify?{ ...reqdata,email: value?.email }:{...reqdata, contact: value?.contact }
            let response = await http_request.post('/mobileEmailOtpVerification', reqdata1)
            const { data } = response
            // console.log(data);
            if(data?.status &&emailVerify===true ){
                ToastMessage(data)
            setLoading(false)
            setEmailVerify(true) 
            router.push("/sign_in")
            }
            ToastMessage(data)
            setLoading(false)
            reset()
            ResendOtp()
            setEmailVerify(true)
        }
        catch (err) {
            setLoading(false)
            ToastMessage(err?.response?.data)
            console.log(err);
        }

    }

    const onSubmit = (data) => {
        verifyOtp(data)
    };

    const ResendOtp = async () => {
        try {
            setLoading(true);
            const reqdata=emailVerify?{ email: value?.email }:{ contact: value?.contact }
            let response = await http_request.post('/mobileEmailSendOtp', reqdata);
            const { data } = response;
            ToastMessage(data);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            ToastMessage(err?.response?.data);
            console.log(err);
        }
    };


    return (
        <div>
            <Toaster />
            <div className="h-screen flex justify-center items-center ">
                <div style={{ minWidth: "30%" }}>
                    <div className="shadow-lg bg-[#ade1e4] rounded-xl flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <div className="flex justify-center">
                                <InputIcon fontSize="large" />
                            </div>
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                {emailVerify ? "Email" : "Mobile"}  Verification
                            </h2>
                        </div>
                        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                        Otp
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="number"
                                            autoComplete="otp"
                                            required
                                            {...register('otp', { required: 'Otp is required', minLength: { value: 6, message: 'Otp must be at least 6 characters long' } })}
                                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.otp ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
                                </div>
                                <div className='flex justify-center  mt-10'>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={ResendOtp}
                                        className="flex w-[70%] justify-center rounded-md bg-indigo-600 px-3  py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Resend OTP
                                    </button>
                                    <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleSubmit(onSubmit)}
                                        className="ms-5  flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Verify OTP
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtpVerification