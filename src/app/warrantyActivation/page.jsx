"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import http_request from '../../../http-request';
import { useForm } from 'react-hook-form';
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';

import axios from 'axios';
import { LocationCity, MyLocation } from '@mui/icons-material';

const ActivateWarrantyButton = () => {
  const [activationStatus, setActivationStatus] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [warrantyDetails, setWarrantyDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [query, setQuery] = useState('');
  const [contactNo, setContactNo] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState([])
  // Set up react-hook-form
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    mode: 'onBlur', // or 'onChange' for real-time validation
  });
  useEffect(() => {
    const qrCode = searchParams.get('uniqueId');
    if (qrCode) {
      setQrCodeUrl(qrCode);
      getwarrantyDetails(qrCode);
      getAllProduct()// Call only once after setting the QR code
    }
  }, [searchParams, refresh]);


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
  const filterWarranty = warrantyDetails?.records?.find((f) => f?.uniqueId === qrCodeUrl)

// console.log(filterWarranty);


  const calculateWarrantyExpiration = () => {
    if (warrantyDetails) {
      const purchaseDate = new Date(filterWarranty?.activationDate);
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
    // console.log(data);
    try {
     

      const response = await http_request.post('/activateWarranty', {
        uniqueId: qrCodeUrl,
        ...data, // Spread form data
      });

      const result = response.data;

      if (result.status) {
        ToastMessage(result)
        setRefresh(result)
        // setActivationStatus('Warranty activated successfully!');
      } else {
        // setActivationStatus(result.msg);
        setRefresh(result)
        ToastMessage(result)
      }
    } catch (error) {
      console.log(error);

      ToastMessage(error?.response?.data)
      //   setActivationStatus('Error activating warranty');
    }
  };


  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setValue("lat", latitude);
          setValue("long", longitude);

          // Fetch address and pincode using a reverse geocoding API
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data.results && data.results.length > 0) {
                const bestMatch = data.results[0]; // The first result is usually the best match

                // Extract postal code (pincode)
                const postalCode = bestMatch.address_components.find((component) =>
                  component.types.includes("postal_code")
                );
                setValue("address", bestMatch.formatted_address);
                setValue("pincode", postalCode ? postalCode.long_name : "Pincode not found");

                // Extract district (administrative_area_level_2), fallback to locality or sublocality
                const districtComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_2")
                );
                setValue("district", districtComponent ? districtComponent.long_name : "District not found");

                // Extract state (administrative_area_level_1)
                const stateComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_1")
                );
                setValue("state", stateComponent ? stateComponent.long_name : "State not found");
              } else {
                console.warn("No results found for the given coordinates.");
              }
            })
            .catch((error) => {
              console.error("Error fetching address: ", error);
            });
        },
        (error) => {
          console.error("Error getting location: ", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };


  // const handleSearch = async () => {
  //   const apiKey = 'AIzaSyBvWULhEJHD7GpeeY3UC2C5N9dJZOIuyEg';
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

  //   try {
  //     const response = await axios.get(url);
  //     const result = response.data.results[0];
  //     if (result) {
  //       // Extract latitude and longitude
  //       const { lat, lng } = result.geometry.location;
  //       setValue("lat", lat)
  //       setValue("long", lng)

  //       // Extract formatted address
  //       setValue("address", result.formatted_address);

  //       // Extract postal code (pincode)
  //       const postalCode = result.address_components.find(component =>
  //         component.types.includes('postal_code')
  //       );
  //       setValue("pincode", postalCode.long_name);
  //       const districtComponent = result.address_components.find(component =>
  //         component.types.includes('administrative_area_level_2')
  //       );
  //       setValue( "district", districtComponent.long_name  );

  //       // Extract state (Administrative Area Level 1)
  //       const stateComponent = result.address_components.find(component =>
  //         component.types.includes('administrative_area_level_1')
  //       );
  //       setValue("state" ,stateComponent?.long_name );
  //       console.log(stateComponent?.long_name);

  //     } else {
  //       alert('Location not found');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location: ', error);
  //   }
  // };

  const handleSearch = async () => {
    const apiKey = 'AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];

      if (result) {
        // Extract latitude and longitude
        const { lat, lng } = result.geometry.location;
        setValue("lat", lat);
        setValue("long", lng);

        // Extract formatted address
        setValue("address", result.formatted_address);

        // Extract postal code (pincode)
        const postalCode = result.address_components.find(component =>
          component.types.includes('postal_code')
        );
        setValue("pincode", postalCode ? postalCode.long_name : "Pincode not found");

        // Extract district (administrative_area_level_2)
        const districtComponent = result.address_components.find(component =>
          component.types.includes('administrative_area_level_2') ||
          component.types.includes('locality') ||
          component.types.includes('sublocality')
        );
        setValue("district", districtComponent ? districtComponent.long_name : " ");
        // console.log(districtComponent ? districtComponent.long_name : " ");

        // Extract state (administrative_area_level_1)
        const stateComponent = result.address_components.find(component =>
          component.types.includes('administrative_area_level_1')
        );
        setValue("state", stateComponent ? stateComponent.long_name : " ");
        // console.log(stateComponent ? stateComponent.long_name : " ");


      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location: ', error);
    }
  };


 

  // console.log(filterWarranty);
  const getAllProduct = async () => {
    let response = await http_request.get("/getAllProduct")
    let { data } = response;

    setProduct(data)
  }

  const filterProduct = product?.find((f) => f?._id === filterWarranty?.productId)
  // console.log(filterProduct);
  const handleComplaint = async () => {

    try {
      const reqdata = {
        brandId: filterProduct?.brandId, productBrand: filterProduct?.productBrand, productId: filterProduct?._id, productName: filterProduct?.productName
        , categoryId: filterProduct?.categoryId, categoryName: filterProduct?.categoryName, modelNo: filterProduct?.modelNo
        , serialNo: filterProduct?.serialNo, warrantyStatus: filterProduct?.warrantyStatus, uniqueId: filterWarranty?.uniqueId
        , lat: filterWarranty?.lat, long: filterWarranty?.long, userId: filterWarranty?.userId
        , userName: filterWarranty?.userName, serviceLocation: filterWarranty?.address, fullName: filterWarranty?.userName,
        phoneNumber: filterWarranty?.contact, emailAddress: filterWarranty?.email, pincode: filterWarranty?.pincode
        , state: filterWarranty?.state, district: filterWarranty?.district, serviceAddress: filterWarranty?.address

      }
      console.log(reqdata);

      if (contactNo === filterWarranty?.contact) {
        setLoading(true)
        const formData = new FormData();

        for (const key in reqdata) {
          if (reqdata.hasOwnProperty(key)) {
            formData.append(key, reqdata[key]);
          }
        }
        const issueImages = "image";
        // console.log("dhhh",issueImages);
        if (issueImages) {
          formData.append('issueImages', issueImages);
        }
        let response = await http_request.post('/createComplaint', reqdata)
        const { data } = response
        ToastMessage(data)
        setLoading(false)
        // router.push("/complaint/allComplaint")
      }
      else {
        alert("You are activated this QR code")
      }
    }

    catch (error) {
      console.log(error);

      setLoading(false)
      //   setActivationStatus('Error activating warranty');
    }
  }

 
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-white p-6">
        <Toaster />
        <div className="bg-[#e5f2f8] p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800  ">Activate Your Product Warranty</h2>
          <div className="grid grid-cols-2 bg-white rounded-2xl py-4 ga p-4 mt-5">

            <div className='mt-2'>
              <label className="font-bold text-sm text-gray-700">Brand Name </label>
              <p className="text-gray-600" text-sm>{warrantyDetails.brandName}</p>
            </div>

            <div className='mt-2'>
              <label className="font-bold text-gray-700 text-sm">Product Name </label>
              <p className="text-gray-600 text-sm">{warrantyDetails.productName}</p>
            </div>

            <div className='mt-2'>
              <label className="font-bold text-gray-700 text-sm">Unique Code </label>
              <p className="text-gray-600 text-sm">{qrCodeUrl}</p>
            </div>
            <div className='mt-2'>
              <label className="font-bold text-gray-700 text-sm">Year </label>
              <p className="text-gray-600 text-sm">{new Date(warrantyDetails.year).toLocaleDateString()}</p>
            </div>
            {/* <div>
          <label className="font-bold text-gray-700">Warranty Expiration Date:</label>
          <p className="text-gray-600">{calculateWarrantyExpiration()}</p>
        </div> */}

            <div className='mt-2'>
              <label className="font-bold text-gray-700 text-sm">Warranty Exp  </label>
              <p className="text-gray-600 text-sm">{filterWarranty?.isActivated === true ?calculateWarrantyExpiration():" Not activated"}</p>
            </div>
            <div className='mt-2'>
              <label className="font-bold text-gray-700 text-sm">Activated </label>
              <p className="text-gray-600 text-sm">{filterWarranty?.isActivated === true ? "Yes" : "No"}  </p>
            </div>
          </div>
          {filterWarranty?.isActivated === true ?
            <div>
              <div className='mb-5 mt-5'>
                <label htmlFor="contact" className="block text-gray-700 ">Contact:</label>
                <input
                  id="contact"
                  type="text"
                  value={contactNo}
                  onChange={(e) => setContactNo(e.target.value)}
                  placeholder='Please enter your register number'
                  className="w-full  p-0.5 border border-gray-300 rounded-md"
                />
                {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
              </div>
              <button
                onClick={handleComplaint}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Create Complaint
              </button>
            </div>
            :
            <div>
              {/* <h2 className="text-xl font-semibold mb-4 mt-5  text-gray-800">Activate Warranty</h2> */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className='mt-5'>
                  <label htmlFor="name" className="block text-gray-700">Full Name:</label>
                  <input
                    id="name"
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full p-0.5 border border-gray-300 rounded-md"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label htmlFor="contact" className="block text-gray-700">Contact:</label>
                  <input
                    id="contact"
                    type="text"
                    {...register('contact', { required: 'Contact is required' })}
                    className="w-full  p-0.5 border border-gray-300 rounded-md"
                  />
                  {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
                </div>
                {/* <div>
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
                    className="w-full  p-0.5 border border-gray-300 rounded-md"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div> */}
                {/* <div>
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
                    className="w-full  p-0.5 border border-gray-300 rounded-md"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div> */}

                <div className=''>
                  <label htmlFor="address" className="block text-gray-700">Full Address:</label>
                  <div className="flex w-full justify-between max-w-md space-x-3 ">

                    <input
                      id="address"
                      type="text"
                      {...register('address', { required: 'Address is required' })}
                      className=" w-full  p-0.5 border border-gray-300 rounded-md"
                    />
                   

                    <button
                      onClick={  getLocation}
                      className="  bg-blue-500 text-white text-sm flex px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                       <MyLocation /> Location
                    </button>

                  </div>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>
              </form>

              <div className="flex w-full max-w-md mt-6 space-x-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter location"
                  className="w-full px-4 py-1 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-sm text-white px-6 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Search
                </button>
              </div>

              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!qrCodeUrl}
                className="w-full mt-5 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Activate Warranty
              </button>

              {activationStatus && <p className="mt-4 text-center text-green-500">{activationStatus}</p>}
            </div>
          }
        </div>


      </div>
      {/* <Hero /> */}
    </>
  );
};

export default ActivateWarrantyButton;
