"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import http_request from '../../../http-request';
import { useForm } from 'react-hook-form';
import { ToastMessage } from '../components/common/Toastify';
import { Toaster } from 'react-hot-toast';

import axios from 'axios';
import { LocationCity, MyLocation } from '@mui/icons-material';
import { ReactLoader } from '../components/common/Loading';

const ActivateWarrantyButton = () => {
  const [activationStatus, setActivationStatus] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [warrantyDetails, setWarrantyDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [query, setQuery] = useState('');
  const [contactNo, setContactNo] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState([])
  const [users, setUsers] = useState(null);
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


  const getUserById = async (id) => {
    try {

      const response = await http_request.get(`/getBrandBy/${id}`);
      const { data } = response;
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const getwarrantyDetails = async (qrCode) => {
    try {
      setLoading(true);
      // console.log("qrCode", qrCode);

      const response = await http_request.get(`/getProductWarrantyByUniqueId/${qrCode}`);
      const { data } = response;
      setWarrantyDetails(data);
      getUserById(data?.brandId)
      setLoading(false);
    } catch (err) {
      console.error("Error fetching warranty details:", err);
      setLoading(false);
    }
  };
  const filterWarranty = warrantyDetails?.records?.find((f) => f?.uniqueId === qrCodeUrl)

  // console.log("filterWarranty",filterWarranty);
  // console.log("warrantyDetails",warrantyDetails);


  const calculateWarrantyExpiration = () => {
    if (warrantyDetails) {
      const purchaseDate = new Date(filterWarranty?.activationDate);
      const expirationDate = new Date(purchaseDate);
      expirationDate.setDate(purchaseDate.getDate() + filterWarranty?.warrantyInDays);
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
    console.log(data);
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

    }
  };


  // const getLocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         setValue("lat", latitude);
  //         setValue("long", longitude);
  //         if(latitude && longitude){
  //         handleSearchByLatLng(latitude,longitude)

  //         // Fetch address and pincode using a reverse geocoding API
  //         fetch(
  //           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k`
  //         )
  //           .then((response) => response.json())
  //           .then((data) => {
  //             if (data.results && data.results.length > 0) {
  //               const bestMatch = data.results[0]; // The first result is usually the best match

  //               // Extract postal code (pincode)
  //               const postalCode = bestMatch.address_components.find((component) =>
  //                 component.types.includes("postal_code")
  //               );
  //               setValue("address", bestMatch.formatted_address);
  //               console.log("postalCode",postalCode?.long_name);
  //               setValue("pincode", postalCode ? postalCode?.long_name : "Pincode not found");

  //               // Extract district (administrative_area_level_2), fallback to locality or sublocality
  //               const districtComponent = bestMatch.address_components.find((component) =>
  //                 component.types.includes("administrative_area_level_2")
  //               );
  //               setValue("district", districtComponent ? districtComponent.long_name : "District not found");

  //               // Extract state (administrative_area_level_1)
  //               const stateComponent = bestMatch.address_components.find((component) =>
  //                 component.types.includes("administrative_area_level_1")
  //               );
  //               setValue("state", stateComponent ? stateComponent.long_name : "State not found");
  //             } else {
  //               console.warn("No results found for the given coordinates.");
  //             }

  //           })

  //           .catch((error) => {
  //             console.error("Error fetching address: ", error);
  //           });
  //         }
  //       },

  //       (error) => {
  //         console.error("Error getting location: ", error);
  //       },
  //       { enableHighAccuracy: true }

  //     );

  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // };




  // const handleSearch = async () => {
  //   const apiKey = 'AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k';
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

  //   try {
  //     const response = await axios.get(url);
  //     const result = response.data.results[0];

  //     if (result) {
  //       // Extract latitude and longitude
  //       const { lat, lng } = result.geometry.location;
  //       setValue("lat", lat);
  //       setValue("long", lng);

  //       // Extract formatted address
  //       setValue("address", result.formatted_address);

  //       // Extract postal code (pincode)
  //       const postalCode = result.address_components.find(component =>
  //         component.types.includes('postal_code')
  //       );
  //       console.log("postalCode",postalCode,result);

  //       setValue("pincode", postalCode ? postalCode.long_name : "Pincode not found");

  //       // Extract district (administrative_area_level_2)
  //       const districtComponent = result.address_components.find(component =>
  //         component.types.includes('administrative_area_level_2') ||
  //         component.types.includes('locality') ||
  //         component.types.includes('sublocality')
  //       );
  //       setValue("district", districtComponent ? districtComponent.long_name : " ");
  //       // console.log(districtComponent ? districtComponent.long_name : " ");

  //       // Extract state (administrative_area_level_1)
  //       const stateComponent = result.address_components.find(component =>
  //         component.types.includes('administrative_area_level_1')
  //       );
  //       setValue("state", stateComponent ? stateComponent.long_name : " ");
  //       // console.log(stateComponent ? stateComponent.long_name : " ");


  //     } else {
  //       alert('Location not found');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching location: ', error);
  //   }
  // };




  // console.log(filterWarranty);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          if (latitude && longitude) {
            console.log("Latitude:", latitude, "Longitude:", longitude);
            handleSearchByLatLng(latitude, longitude)
            // Set latitude and longitude values
            setValue("lat", latitude);
            setValue("long", longitude);

            try {
              // Fetch address and pincode using Google Geocoding API
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k`
              );
              const data = await response.json();

              if (data.results && data.results.length > 0) {
                const bestMatch = data.results[0]; // The first result is the most accurate

                // Set formatted address
                setValue("address", bestMatch.formatted_address);

                // Extract postal code (pincode)
                const postalCodeComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("postal_code")
                );

                if (postalCodeComponent) {
                  const postalCode = postalCodeComponent.long_name;
                  // setValue("pincode", postalCode);
                  // console.log("Pincode:", postalCode);
                } else {
                  console.warn("Pincode not found in address components.", bestMatch.address_components);
                  // setValue("pincode", "");
                }

                // Extract district
                const districtComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_2")
                );
                setValue("district", districtComponent ? districtComponent.long_name : "District not found");

                // Extract state
                const stateComponent = bestMatch.address_components.find((component) =>
                  component.types.includes("administrative_area_level_1")
                );
                setValue("state", stateComponent ? stateComponent.long_name : "State not found");
              } else {
                console.warn("No results found for the given coordinates.");
                setValue("address", "Address not found");
                setValue("pincode", "");
                setValue("district", "District not found");
                setValue("state", "State not found");
              }
            } catch (error) {
              console.error("Error fetching address: ", error);
              alert("Failed to fetch location details. Please try again.");
            }
          } else {
            console.warn("Latitude and longitude are not available.");
            alert("Unable to retrieve location details. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Location access denied by the user.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            default:
              alert("An unknown error occurred while fetching location.");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Optional configurations
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };



  const handleSearch = async () => {
    const apiKey = 'AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];

      if (result) {
        // Log the full response for debugging
        console.log("Geocode Result:", result);

        // Extract latitude and longitude
        const { lat, lng } = result.geometry.location;
        setValue("lat", lat);
        setValue("long", lng);
        handleSearchByLatLng(lat, lng)
        // Extract formatted address
        console.log(result.formatted_address);

        setValue("address", result.formatted_address);

        // Extract postal code (pincode)
        // const postalCodeComponent = result.address_components.find(component =>
        //   component.types.includes('postal_code')
        // );
        // if (postalCodeComponent) {
        //   setValue("pincode", postalCodeComponent.long_name);
        //   console.log("Pincode:", postalCodeComponent.long_name);
        // } else {
        //   setValue("pincode", "Pincode not found");
        //   console.warn("Pincode not found in the address components.");
        // }

        // Extract district
        const districtComponent = result.address_components.find(component =>
          component.types.includes('administrative_area_level_2') ||
          component.types.includes('locality') ||
          component.types.includes('sublocality')
        );
        console.log(districtComponent.long_name);

        setValue("district", districtComponent ? districtComponent.long_name : "District not found");

        // Extract state
        const stateComponent = result.address_components.find(component =>
          component.types.includes('administrative_area_level_1')
        );
        console.log(stateComponent.long_name);

        setValue("state", stateComponent ? stateComponent.long_name : "State not found");
      } else {
        alert('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  const handleSearchByLatLng = async (lat, lng) => {
    const apiKey = 'AIzaSyC_L9VzjnWL4ent9VzCRAabM52RCcJJd2k';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0];

      if (result) {
        console.log("Geocode Response:", response.data);

        // Extract postal code (pincode)
        const postalCodeComponent = result.address_components.find(component =>
          component.types.includes('postal_code')
        );

        if (postalCodeComponent) {
          setValue("pincode", postalCodeComponent.long_name);
          console.log("Pincode:", postalCodeComponent.long_name);
        } else {
          console.warn("Pincode not found in the address components.");
          setValue("pincode", "");
        }

        // Set other address details if needed
        // setValue("address", result.formatted_address);
      } else {
        alert('Location details not found');
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };



  const getAllProduct = async () => {
    try{
    let response = await http_request.get("/getAllProduct")
    let { data } = response;

    setProduct(data)
    }
    catch(err){
      console.log(err);
      
    }
  }
  // console.log(filterWarranty);

  const filterProduct = product?.find((f) => f?._id === filterWarranty?.productId)
  // console.log(filterProduct);
  const filterProductByBrand = product?.filter((f) => f?.brandId === filterWarranty?.brandId)
  // console.log(filterProductByBrand);

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = product?.find(prod => prod._id === selectedProductId);
    // console.log(selectedProduct);

    if (selectedProduct) {
      setValue('productId', selectedProduct._id);
      setValue('productName', selectedProduct.productName);
      // setValue('brandName', selectedProduct.productBrand);
      // setValue('brandId', selectedProduct.brandId);
      setValue('categoryId', selectedProduct.categoryId);
      setValue('subCategoryId', selectedProduct.subCategoryId);
      setValue('categoryName', selectedProduct.categoryName);
      setValue('year', new Date());
    }
  };

  const handleComplaint = async () => {

    try {
      const reqdata = {
        brandId: filterWarranty?.brandId, productBrand: filterWarranty?.brandName, productId: filterProduct?._id, productName: filterProduct?.productName
        , categoryId: filterProduct?.categoryId,subCategoryId: filterProduct?.subCategoryId, categoryName: filterProduct?.categoryName, modelNo: filterProduct?.modelNo
        , serialNo: filterProduct?.serialNo, warrantyStatus: filterProduct?.warrantyStatus, uniqueId: qrCodeUrl
        , lat: filterWarranty?.lat, long: filterWarranty?.long, userId: filterWarranty?.userId
        , userName: filterWarranty?.userName, serviceLocation: filterWarranty?.address, fullName: filterWarranty?.userName,
        phoneNumber: filterWarranty?.contact, emailAddress: `${filterWarranty?.contact}@gmail.com`, pincode: filterWarranty?.pincode
        , state: filterWarranty?.state, district: filterWarranty?.district, serviceAddress: filterWarranty?.address

      }
      // console.log(reqdata);

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
        // console.log(data);
        const userData = { user: data?.user }
        localStorage.setItem('user', JSON.stringify(userData));
        ToastMessage(data)
        setLoading(false)

        // router.push("/dashboard")
        // window.location.reload()
        window.location.href = "/dashboard"
      }
      else {
        alert("Fill proper contact number  and try  this QR code")
      }
    }

    catch (error) {
      console.log(error);
      ToastMessage(error?.response?.data)
      setLoading(false)
      //   setActivationStatus('Error activating warranty');
    }
  }

  const handleDashboard = async (id) => {
    try {
      // console.log(id);
      const response = await http_request.post("/dashboardLogin", { userId: id });
      let { data } = response;

      ToastMessage(data)
      localStorage.setItem('user', JSON.stringify(data));
      window.location.href = "/dashboard"
    } catch (error) {
      ToastMessage(error?.response?.data)
      console.log(error);

    }
  }

  // console.log(filterWarranty)

  return (
    <>
      <Toaster />
      {loading === true || !filterWarranty ? <div>
        <ReactLoader />
      </div>
        : <div className="flex justify-center items-center min-h-screen bg-white p-6">
          <Toaster />
          <div className="bg-[#e5f2f8] p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="flex justify-center mb-5 ">
                  <img
                    src="/Logo.png" // Replace with actual logo path
                    alt="Servsy Logo"
                    className="h-16 w-auto rounded-md" // Adjust size as needed
                  />
                </div>
            <h2 className="text-2xl font-semibold text-center text-gray-800  ">Activate Your Product Warranty</h2>
            <div className="grid grid-cols-2 bg-white rounded-2xl py-4 ga p-4 mt-5">

              <div className='mt-2'>
                <label className="font-bold text-sm text-gray-700">Brand Name </label>
                <p className="text-gray-600" text-sm>{warrantyDetails.brandName}</p>
              </div>

              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Product Name </label>
                <p className="text-gray-600 text-sm">{filterWarranty?.productName}</p>
              </div>

              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Unique Code </label>
                <p className="text-gray-600 text-sm">{qrCodeUrl}</p>
              </div>
              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Year </label>
                {filterWarranty && <p className="text-gray-600 text-sm">{new Date(filterWarranty?.activationDate).toLocaleDateString()}</p>}
              </div>
              {/* <div>
          <label className="font-bold text-gray-700">Warranty Expiration Date:</label>
          <p className="text-gray-600">{calculateWarrantyExpiration()}</p>
        </div> */}

              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Warranty Exp  </label>
                <p className="text-gray-600 text-sm">{filterWarranty?.isActivated === true ? calculateWarrantyExpiration() : " Not activated"}</p>
              </div>
              <div className='mt-2'>
                <label className="font-bold text-gray-700 text-sm">Activated </label>
                <p className="text-gray-600 text-sm">{filterWarranty?.isActivated === true ? "Yes" : "No"}  </p>
              </div>
            </div>
            {filterWarranty?.isActivated === true ?

              <div>
                <div className='mb-5 mt-5 '>
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
                <div className='flex justify-between '>

                  <div>
                    <button
                      onClick={() => handleDashboard(filterWarranty?.userId)}
                      className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                      Go Dashboard
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={handleComplaint}
                      className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Create Complaint
                    </button>
                  </div>
                </div>
              </div>
              :
              <div>
                {/* <h2 className="text-xl font-semibold mb-4 mt-5  text-gray-800">Activate Warranty</h2> */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                  {filterWarranty?.isActivated === false && !filterWarranty?.productId ?
                    <div className='mt-5'>
                      <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                        Product Name
                      </label>
                      <select
                        id="productName"
                        name="productName"
                        // {...register("productName", { required: "Please select a product" })}
                        onChange={handleProductChange}
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.productName ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select a product</option>
                        {filterProductByBrand?.map((prod) => (
                          <option key={prod._id} value={prod._id}>
                            {prod.productName}
                          </option>
                        ))}
                      </select>
                      {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                    </div>
                    : ""
                  }
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
                        onClick={() => getLocation()}
                        className="  bg-blue-500 text-white text-sm flex px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      >
                        <MyLocation /> Location
                      </button>

                    </div>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-gray-700">Pincode:</label>
                    <input
                      id="pincode"
                      type="text"
                      {...register('pincode', { required: 'Pincode is required' })}
                      className="w-full  p-0.5 border border-gray-300 rounded-md"
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>}
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
                    onClick={() => handleSearch()}
                    className="bg-blue-500 text-sm text-white px-6 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Search
                  </button>
                </div>
                <div className="mt-5">
                  <input
                    id="terms"
                    type="checkbox"
                    {...register('termsCondtions', { required: 'You must accept the terms and conditions' })}
                    className="mr-2"
                  />
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to warranty{' '}
                    <button
                      type="button"
                      onClick={() => setRead(true)} // Handle showing terms
                      className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                  {errors.termsCondtions && <p className="text-red-500 text-sm mt-1">{errors.termsCondtions.message}</p>}
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
      }
      {read === true ? <div className="m-10">
        <h2 className="text-xl font-semibold mb-2">Warranty Terms & Conditions</h2>
        <div
          className="p-4 border rounded bg-gray-50"
          dangerouslySetInnerHTML={{ __html: users?.warrantyCondition }}
        />
         <div className="flex justify-center mt-5">
          <button
            onClick={() => setRead(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
        : ""
      }
      {/* <Hero /> */}
    </>
  );
};

export default ActivateWarrantyButton;
