"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../http-request'
import { ToastMessage } from './common/Toastify';
import { ReactLoader } from './common/Loading';

const DealerRegistrationForm = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const Regiter = async (reqdata) => {
    try {

      setLoading(true)
      let response = await http_request.post(`/dealerRegistration`, reqdata)
      const { data } = response
      localStorage.setItem('userInfo', JSON.stringify(reqdata));
      ToastMessage(data)
      setLoading(false)
      router.push("/sign_in")
    }
    catch (err) {
      setLoading(false)
      ToastMessage(err?.response?.data)

      console.log(err);
    }

  }
  const onSubmit = (data) => {
    Regiter(data)
  };

  return (
    <>
      {loading === true ? <ReactLoader />
        : <form className="grid md:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="md:col-span-2">
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
          <div className=" ">
            <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                {...register("confirmPassword", {
                  required: 'Please confirm your password',
                  validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.confirmPassword ? 'ring-red-500' : ''}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <div className="md:col-span-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                {...register("acceptedTerms", { required: 'You must accept the terms and conditions' })}
                className="form-checkbox"
              />
              <span className="ml-2 text-gray-700">I accept the terms and conditions</span>
            </label>
            {errors.acceptedTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptedTerms.message}</p>}
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-blue-600">
              Submit
            </button>
          </div>
        </form>
      }
    </>
  );
};

export default DealerRegistrationForm;
