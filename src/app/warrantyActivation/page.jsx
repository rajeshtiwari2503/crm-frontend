"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import http_request from '../../../http-request';
import { useForm } from 'react-hook-form';
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';
import Hero from '../components/website/Hero';
import CurrentLocation from './CurrentLocation';
import SearchLocation from './SearchLocation';

const ActivateWarrantyButton = () => {
  const [activationStatus, setActivationStatus] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [warrantyDetails, setWarrantyDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Set up react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onBlur', // or 'onChange' for real-time validation
  });
  useEffect(() => {
    const qrCode = searchParams.get('uniqueId');
    if (qrCode) {
      setQrCodeUrl(qrCode);
      getwarrantyDetails(qrCode); // Call only once after setting the QR code
    }
  }, [searchParams]);


  const getwarrantyDetails = async (qrCode) => {
    try {
      setLoading(true);
      // console.log("qrCode", qrCode);

      const response = await http_request.get(`/getProductWarrantyByUniqueId/${qrCode}`);
      const { data } = response;
      setWarrantyDetails(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching warranty details:", err);
      setLoading(false);
    }
  };

  const calculateWarrantyExpiration = () => {
    if (warrantyDetails) {
      const purchaseDate = new Date(warrantyDetails.year);
      const expirationDate = new Date(purchaseDate);
      expirationDate.setDate(purchaseDate.getDate() + warrantyDetails.warrantyInDays);
      return expirationDate.toLocaleDateString();
    }
    return null;
  };

  const calculateWarrantyDaysRemaining = () => {
    if (warrantyDetails) {
      const purchaseDate = new Date(warrantyDetails.year);
      const expirationDate = new Date(purchaseDate);
      expirationDate.setDate(purchaseDate.getDate() + warrantyDetails.warrantyInDays);

      const today = new Date();
      const timeDiff = expirationDate - today;
      const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

      return daysRemaining >= 0 ? daysRemaining : 0;
    }
    return null;
  };

  const onSubmit = async (data) => {
    try {
      const response = await http_request.post('/activateWarranty', {
        uniqueId: qrCodeUrl,
        ...data, // Spread form data
      });

      const result = response.data;

      if (result.status) {
        ToastMessage(result)
        // setActivationStatus('Warranty activated successfully!');
      } else {
        // setActivationStatus(result.msg);
        ToastMessage(result)
      }
    } catch (error) {
      console.log(error);

      ToastMessage(error?.response?.data)
      //   setActivationStatus('Error activating warranty');
    }
  };

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800  ">Product Warranty Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 py-4 gap-2">

          <div>
            <label className="font-bold text-gray-700">Brand Name:</label>
            <p className="text-gray-600">{warrantyDetails.brandName}</p>
          </div>

          <div>
            <label className="font-bold text-gray-700">Product Name:</label>
            <p className="text-gray-600">{warrantyDetails.productName}</p>
          </div>

          <div>
            <label className="font-bold text-gray-700">Unique Code:</label>
            <p className="text-gray-600">{qrCodeUrl}</p>
          </div>
          <div>
            <label className="font-bold text-gray-700">Year:</label>
            <p className="text-gray-600">{new Date(warrantyDetails.year).toLocaleString()}</p>
          </div>
          {/* <div>
          <label className="font-bold text-gray-700">Warranty Expiration Date:</label>
          <p className="text-gray-600">{calculateWarrantyExpiration()}</p>
        </div> */}
          <div>
            <label className="font-bold text-gray-700">Days Remaining:</label>
            <p className="text-gray-600">{calculateWarrantyDaysRemaining()} days</p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Activate Warranty</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700">Name:</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="contact" className="block text-gray-700">Contact:</label>
            <input
              id="contact"
              type="text"
              {...register('contact', { required: 'Contact is required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-700">Address:</label>
            <input
              id="address"
              type="text"
              {...register('address', { required: 'Address is required' })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
          </div>
          <div>
            <CurrentLocation />
            <SearchLocation />
            </div>
          <button
            type="submit"
            disabled={!qrCodeUrl}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Activate Warranty
          </button>
        </form>
        {activationStatus && <p className="mt-4 text-center text-green-500">{activationStatus}</p>}
      </div>
    
    </div>
      {/* <Hero /> */}
      </>
  );
};

export default ActivateWarrantyButton;
