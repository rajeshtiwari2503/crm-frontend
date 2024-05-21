"use client"
import Link from "next/link";
import InputIcon from '@mui/icons-material/Input';
import { useForm } from 'react-hook-form';
import http_request from '../../../http-request'
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();  

  const Login = async (reqdata) => {
    try {
      setLoading(true);
      let response = await http_request.post('/login', reqdata);
      const { data } = response;
      localStorage.setItem('user', JSON.stringify(data));
      ToastMessage(data);
      setLoading(false);
      router.push("/dashboard");
    } catch (err) {
      setLoading(false);
      ToastMessage(err?.response?.data);
      console.log(err);
    }
  };

  const onSubmit = (data) => {
    
    Login(data);
  };

  const SendOtp = async (email) => {
    try {
      setLoading(true);
      let response = await http_request.post('/sendOtp', { email: email });
      const { data } = response;
      ToastMessage(data);
      localStorage.setItem('userEmail', JSON.stringify(email));
      setLoading(false);
      router.push("/otp_Verification");
    } catch (err) {
      setLoading(false);
      ToastMessage(err?.response?.data);
      console.log(err);
    }
  };

  const handleForgetPassword = () => {
    const data ={ status: false, msg: "Please Enter Email!" }
    const email = getValues('email');
    if (!email) {
      ToastMessage(data)
      return;
    }
    SendOtp(email);
  };

  return (
    <>
      <Toaster />
      <div className="h-screen flex justify-center ">
        <div style={{ minWidth: "30%" }} className="my-12">
          <div className="shadow-lg flex bg-[#ade1e4] rounded-xl min-h-full flex-1 flex-col justify-center px-6  lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
              <div className="flex justify-center ">
                <InputIcon fontSize="large" />
              </div>
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="text-sm">
                      <div onClick={handleForgetPassword} className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-500">
                        Forgot password?
                      </div>
                    </div>
                  </div>
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
                  <button
                    disabled={loading}
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              <p className="mt-10 text-center text-sm text-gray-500">
                Not a member?{' '}
                <Link href="/sign_up" className="cursor-pointer font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
