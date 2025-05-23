"use client"
import Link from "next/link";
import InputIcon from '@mui/icons-material/Input';
import { useForm } from 'react-hook-form';
import http_request from '../../../http-request';
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReactLoader } from "../components/common/Loading";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function SignIn() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState("");

  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const Login = async (reqdata) => {
    try {
      setLoading(true);
      let response = await http_request.post('/login', reqdata);
      let { data } = response;

      // Store user data in local storage
      localStorage.setItem('user', JSON.stringify(data));
      setUserData(data?.user);

      if (data?.user?.verification === "VERIFIED") {
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          localStorage.setItem('user', JSON.stringify(data));
        }

        
        ToastMessage(data);

        // Navigate and reload
        window.location.href = "/dashboard"; // Ensures navigation and reload
        // router.push('/dashboard');
        // setLoading(false);
      } else {
        // Handle unverified users
        window.location.href = "/dashboard"; // Ensures navigation and reload
         setLoading(false);
      }
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
    const data = { status: false, msg: "Please Enter Email!" };
    const email = getValues('email');
    if (!email) {
      ToastMessage(data);
      return;
    }
    SendOtp(email);
  };
  const apkDownloadUrl = "/servsyAPP.apk";
  return (
    <>
      <Toaster />
      <div className="h-screen flex justify-center items-center">
        <div style={{ minWidth: "30%" }}>
          {loading === true ? <ReactLoader />
            : <div className="shadow-lg flex bg-[#ade1e4] rounded-xl min-h-full flex-1 flex-col justify-center px-6 py-5 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="flex justify-center  ">
                  <img
                    src="/Logo.png" // Replace with actual logo path
                    alt="Servsy Logo"
                    className="h-16 w-auto rounded-md" // Adjust size as needed
                  />
                </div>
                <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Sign in to your account
                </h2>
              </div>
              <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
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
                    <div className="mt-2 relative w-full">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        {...register("password", {
                          required: "Password is required",
                          minLength: { value: 8, message: "Password must be at least 8 characters long" },
                        })}
                        className={`block w-full p-3 pr-10 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.password ? "border-red-500" : ""}`}
                      />
                      {/* Eye Icon (Properly Positioned) */}
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-2 flex items-center"
                        
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </div>
                    </div>
 
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
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
                {/* <div className="signin-page flex flex-col items-center justify-center p-2 rounded-md bg-gray-100">
                  <div className="text-md text-gray-700 mb-2">Please download our app directly ---</div>

                
                  <a href={apkDownloadUrl} download>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-2 rounded">
                      Download APK
                    </button>
                  </a>
                </div> */}

              </div>
            </div>
          }
        </div>
      </div>
    </>
  );
}
