
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import EditByAdmin from './editByAdmin';
import { useUser } from '@/app/components/UserContext';

const Editservice = ({ params }) => {
    const router = useRouter();
    const [id, setId] = useState("")
    const [service, setService] = useState("")
    const [productName, setProductName] = useState("")
    const [uploadedImage, setUploadedImage] = useState("")
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
 const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState(null);
   const [error, setError] = useState('');
    
     const [jsonData, setJsonData] = useState([]);
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
  const {user} = useUser()
    useEffect(() => {
        getAllProducts()
        getServiceById()
        if (service) {
            // setValue('fullName', service.fullName);
            // setValue('phoneNumber', service.phoneNumber);
            // setValue('emailAddress', service.emailAddress);
            // setValue('serviceAddress', service.serviceAddress);
            // setValue('errorMessages', service.errorMessages);
            // setValue('issueType', service.issueType);
            // setValue('modelNo', service.modelNo);



            //   setValue('preferredServiceDate', service.preferredServiceDate);
            //   setValue('preferredServiceTime', service.preferredServiceTime);
            //   setValue('purchaseDate',  service.purchaseDate );


            // setValue('productName', service.productName);
            // setValue('productBrand', service.productBrand);
            // setValue('categoryName', service.categoryName);




            //   setValue('purchaseDate', new Date(service.purchaseDate).toLocaleDateString());

            // setValue('serialNo', service.serialNo);
            // setValue('serviceLocation', service.serviceLocation);
            // setValue('detailedDescription', service.detailedDescription);
            // setValue('alternateContactInfo', service.alternateContactInfo);
            if (service.preferredServiceDate) {
                setValue('preferredServiceDate', new Date(service.preferredServiceDate).toISOString().split('T')[0]);
            }
              setPincode(  service?.pincode || '');
              
            // if (service.preferredServiceTime) {
            //     setValue('preferredServiceTime', service.preferredServiceTime);
            // }
            // if (service.purchaseDate) {
            //     setValue('purchaseDate', new Date(service.purchaseDate).toISOString().split('T')[0]);
            // }
        }
    }, [id])



    const getServiceById = async () => {
        try {
            let response = await http_request.get(`/getComplaintById/${params.id}`)
            let { data } = response;
            setService(data)
            setId(data?._id)
        }
        catch (err) {
            console.log(err);
        }
    }


    const Updateservice = async (reqD) => {
        try {
            const reqdata={...reqD,cspStatus:"YES"}
            // console.log("reqdata",reqdata);
            
            setLoading(true)
            let response = await http_request.patch(`/editComplaint/${id}`, reqdata)
            const { data } = response
            ToastMessage(data)
            setLoading(false)
            router.push("/complaint/allComplaint")
        }
        catch (err) {
            setLoading(false)
            ToastMessage(err.response.data)

            console.log(err);
        }

    }

    const onSubmit = (data) => {
        Updateservice(data)
    };
    const getAllProducts = async () => {
        let response = await http_request.get("/getAllProduct")
        let { data } = response;

        setProducts(data)
    }



    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        setProductName(selectedProductId)
        const selectedProduct = products.find(product => product.productName === selectedProductId);
        if (selectedProduct) {
            setValue('productName', selectedProduct.productName);
            setValue('categoryName', selectedProduct.categoryName);
            setValue('productBrand', selectedProduct.productBrand);
            setValue('modelNo', selectedProduct.modelNo);
            setValue('serialNo', selectedProduct.serialNo);
            setValue('purchaseDate', selectedProduct.purchaseDate);

        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedImage(file)
        }
    };
    const changeImage = async () => {
        try {
            const formData = new FormData();
            formData.append("issueImages", uploadedImage);
            let response = await http_request.patch(`/editImage/${id}`, formData);
            let { data } = response;
            ToastMessage(data);
            //   router.push("/product/sparepart");
        } catch (err) {
            console.log(err);
        }
    }

 useEffect(() => {
    if (pincode?.length === 6) { // Ensure the pincode is valid (assuming 6 digits)
      fetchLocation(pincode);
      setValue('pincode', pincode)
    }
  }, [pincode,jsonData]);
  useEffect(() => {
    // Fetch the file from the public folder
    const loadFileFromPublic = async () => {
      try {
        const response = await fetch("/INpostalCode.txt");
        // console.log("response",response);
        // Adjust filename if needed
        const text = await response.text();  // Read file content as text

        const lines = text.trim().split("\n");
        const stateData = {};

        lines.forEach((line) => {
          const parts = line.split("\t").map((s) => s.trim());

          if (parts.length >= 5) {
            const pincode = parts[1]; // Pincode
            const areaName = parts[2]; // Area
            const state = parts[3]; // State
            const district = parts[5]; // District

            if (!stateData[state]) {
              stateData[state] = {};
            }
            if (!stateData[state][district]) {
              stateData[state][district] = [];
            }

            stateData[state][district].push({ areaName, pincode });
          }
        });
        // console.log("stateData",stateData);

        setJsonData(stateData);
      } catch (error) {
        console.error("Error loading file:", error);
      }
    };

    loadFileFromPublic();
  }, []);
  const fetchLocation = async (pincode) => {
    try {
      console.log("pincode", pincode);

      if (!pincode || pincode.toString().trim().length !== 6) {
        setError('Please enter a valid 6-digit pincode.');
        return null;
      }

      const pinStr = pincode.toString().trim();

      // Step 1: Check local file data
      if (jsonData && Object.keys(jsonData).length > 0) {
        for (const state in jsonData) {
          for (const district in jsonData[state]) {
            const match = jsonData[state][district].find(
              (entry) => entry.pincode.toString() === pinStr
            );

            if (match) {
              console.log("✅ Local match found:", match, district, state);
              setLocation({ District: district, State: state });
              setValue('pincode', pinStr);
              setValue('state', state);
              setValue('district', district);
              setError('');
              return { District: district, State: state, Area: match.areaName };
            }
          }
        }
      }
      setError('No location found for the provided pincode.');
      setError('No location found for the provided pincode.');
      setLocation(null);
      setValue('pincode', '');
      setValue('state', '');
      setValue('district', '');

      // Step 2: Fallback to external API
      // const response = await axios.get(`https://api.postalpincode.in/pincode/${pinStr}`);
      // if (response.data && response.data[0].Status === 'Success') {
      //   const { PostOffice } = response.data[0];
      //   const { District, State } = PostOffice[0];

      //   console.log("✅ API match found:", District, State);
      //   setLocation({ District, State });
      //   setValue('pincode', pinStr);
      //   setValue('state', State);
      //   setValue('district', District);
      //   setError('');
      //   return PostOffice[0];
      // } else {
      //   setError('No location found for the provided pincode.');
      //   return null;
      // }

    } catch (error) {
      console.error("❌ Error fetching location:", error);
      setError('Something went wrong while fetching location.');
      return null;
    }
  };


    return (
        <>

           {user?.user?.role==="ADMIN"?
          <EditByAdmin service={service}/>
            :
            <Sidenav >
            <Toaster />
            <div className=" ">
                <div  >
                    <h2 className=" text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Edit Complaint
                    </h2>

                    <form className="mt-3 grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-3" onSubmit={handleSubmit(onSubmit)}>
                        {/* <div>
                            <label htmlFor="productName" className="block text-sm font-medium leading-6 text-gray-900">
                                Product Name
                            </label>
                            <select
                                id="productName"
                                name="productName"
                                // value={products.find(product => product.productName === service?.productName)?.productId || ""}
                                onChange={handleProductChange}
                                className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productName ? 'border-red-500' : ''}`}
                            >
                                <option value="">{service?.productName}</option>
                                {products.map(product => (
                                    <option key={product.productId} value={product.productId}>
                                        {product.productName}
                                    </option>
                                ))}
                            </select>
                            {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                                Product Category
                            </label>
                            <input
                                id="categoryName"
                                name="categoryName"
                                type="text"
                                autoComplete="off"
                                readOnly
                                {...register('categoryName', { required: 'Category is required' })}
                                className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.categoryName ? 'border-red-500' : ''}`}
                            />
                            {errors.categoryName && <p className="text-red-500 text-sm mt-1">{errors.categoryName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="productBrand" className="block text-sm font-medium leading-6 text-gray-900">
                                Brand
                            </label>
                            <input
                                id="productBrand"
                                name="productBrand"
                                type="text"
                                autoComplete="off"
                                readOnly
                                {...register('productBrand', { required: 'Product Brand is required' })}
                                className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
                            />
                            {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
                        </div> */}

                        {/* <div className=''>
            <label htmlFor="productDescription" className="block text-sm font-medium leading-6 text-gray-900">
              Product Description
            </label>
            <div className="mt-2">
              <input
                id="productDescription"
                name="productDescription"
                type="text"
                autoComplete="off"
                required
                {...register('productDescription', { required: 'Product Description is required', minLength: { value: 3, message: 'Product Description must be at least 3 characters long' } })}
                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productDescription ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.productDescription && <p className="text-red-500 text-sm mt-1">{errors.productDescription.message}</p>}
          </div> */}



                        {/* <div className=' '>
                            <label htmlFor="serialNo" className="block text-sm font-medium leading-6 text-gray-900">
                                Serial No
                            </label>
                            <div className="mt-2">
                                <input
                                    id="serialNo"
                                    name="serialNo"
                                    type="text"
                                    autoComplete="off"
                                    {...register('serialNo')}
                                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.serialNo ? 'border-red-500' : ''}`}
                                />
                            </div>
                        </div>
                        <div className=' '>
                            <label htmlFor="modelNo" className="block text-sm font-medium leading-6 text-gray-900">
                                Model No
                            </label>
                            <div className="mt-2">
                                <input
                                    id="modelNo"
                                    name="modelNo"
                                    type="text"
                                    autoComplete="off"
                                    {...register('modelNo')}
                                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.modelNo ? 'border-red-500' : ''}`}
                                />
                            </div>
                        </div>
                        <div className=' '>
                            <label htmlFor="selectedYear" className="block text-sm font-medium leading-6 text-gray-900">
                                Select Year
                            </label>
                            <div className="mt-2">
                                <select
                                    id="selectedYear"
                                    name="selectedYear"
                                    // value={selectedYear}
                                    // onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                    className={` block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                >
                                    
                                    {Array.from({ length: 10 }, (_, index) => new Date().getFullYear() + index).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className=' '>
                            <label htmlFor="purchaseDate" className="block text-sm font-medium leading-6 text-gray-900">
                                Purchase Date
                            </label>
                            <div className="mt-2">
                                <input
                                    id="purchaseDate"
                                    name="purchaseDate"
                                    type="date"
                                    {...register('purchaseDate')}
                                    className={`block p-3 w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.purchaseDate ? 'border-red-500' : ''}`}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="issueType" className="block text-sm font-medium leading-6 text-gray-900">
                                Issue Type
                            </label>
                            <select
                                id="issueType"
                                name="issueType"
                                autoComplete="issueType"
                                required
                                {...register('issueType', { required: 'Issue Type is required' })}
                                className={` block mt-2 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.issueType ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select an issue type</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Software">Software</option>
                                <option value="Performance">Performance</option>
                                <option value="Physical Damage">Physical Damage</option>
                            </select>
                            {errors.issueType && <p className="text-red-500 text-sm mt-1">{errors.issueType.message}</p>}
                        </div>

                        <div className=' flex md:col-span-3 gap-4'>
                            <div className=' w-full'>
                                <label htmlFor="detailedDescription" className="block text-sm font-medium leading-6 text-gray-900">
                                    Detailed Description
                                </label>
                                <textarea
                                    id="detailedDescription"
                                    name="detailedDescription"
                                    autoComplete="detailedDescription"
                                    required
                                    {...register('detailedDescription', { required: 'Detailed Description is required' })}
                                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none ${errors.detailedDescription ? 'border-red-500' : ''}`}
                                />
                                {errors.detailedDescription && <p className="text-red-500 text-sm mt-1">{errors.detailedDescription.message}</p>}
                            </div>

                            <div className='w-full '>
                                <label htmlFor="errorMessages" className="block text-sm font-medium leading-6 text-gray-900">
                                    Error Messages
                                </label>
                                <textarea
                                    id="errorMessages"
                                    name="errorMessages"
                                    autoComplete="errorMessages"
                                    {...register('errorMessages')}
                                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 resize-none ${errors.errorMessages ? 'border-red-500' : ''}`}
                                />
                                {errors.errorMessages && <p className="text-red-500 text-sm mt-1">{errors.errorMessages.message}</p>}
                            </div>
                        </div> */}

                        <div>
                            <label htmlFor="preferredServiceDate" className="block text-sm font-medium leading-6 text-gray-900">
                                Preferred Service Date
                            </label>
                            <input
                                id="preferredServiceDate"
                                name="preferredServiceDate"
                                type="date"
                                autoComplete="preferredServiceDate"
                                required
                                {...register('preferredServiceDate', { required: 'Preferred Service Date is required' })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.preferredServiceDate ? 'border-red-500' : ''}`}
                            />
                            {errors.preferredServiceDate && <p className="text-red-500 text-sm mt-1">{errors.preferredServiceDate.message}</p>}
                        </div>
                        {/* <div>
                            <label htmlFor="preferredServiceTime" className="block text-sm font-medium leading-6 text-gray-900">
                                Preferred Service Time
                            </label>
                            <input
                                id="preferredServiceTime"
                                name="preferredServiceTime"
                                type="time"
                                autoComplete="preferredServiceTime"
                                required
                                {...register('preferredServiceTime', { required: 'Preferred Service Time is required' })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.preferredServiceTime ? 'border-red-500' : ''}`}
                            />
                            {errors.preferredServiceTime && <p className="text-red-500 text-sm mt-1">{errors.preferredServiceTime.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="serviceLocation" className="block text-sm font-medium leading-6 text-gray-900">
                                Service Location
                            </label>
                            <input
                                id="serviceLocation"
                                name="serviceLocation"
                                type="text"
                                autoComplete="serviceLocation"
                                required
                                {...register('serviceLocation', { required: 'Service Location is required' })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.serviceLocation ? 'border-red-500' : ''}`}
                            />
                            {errors.serviceLocation && <p className="text-red-500 text-sm mt-1">{errors.serviceLocation.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="alternateContactInfo" className="block text-sm font-medium leading-6 text-gray-900">
                                Alternate Contact Info
                            </label>
                            <input
                                id="alternateContactInfo"
                                name="alternateContactInfo"
                                type="text"
                                autoComplete="alternateContactInfo"
                                required
                                {...register('alternateContactInfo', { required: 'Alternate Contact Info is required' })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.alternateContactInfo ? 'border-red-500' : ''}`}
                            />
                            {errors.alternateContactInfo && <p className="text-red-500 text-sm mt-1">{errors.alternateContactInfo.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                autoComplete="fullName"
                                required
                                {...register('fullName', { required: 'Full Name is required' })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.fullName ? 'border-red-500' : ''}`}
                            />
                            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                autoComplete="phoneNumber"
                                required
                                {...register('phoneNumber', {
                                    required: 'Phone Number is required',
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: 'Please enter a valid 10-digit phone number',
                                    },
                                })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.phoneNumber ? 'border-red-500' : ''}`}
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="emailAddress" className="block text-sm font-medium leading-6 text-gray-900">
                                Email Address
                            </label>
                            <input
                                id="emailAddress"
                                name="emailAddress"
                                type="email"
                                autoComplete="emailAddress"
                                required
                                {...register('emailAddress', {
                                    required: 'Email Address is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Please enter a valid email address',
                                    },
                                })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.emailAddress ? 'border-red-500' : ''}`}
                            />
                            {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress.message}</p>}
                        </div>
                        <div className='md:col-span-2'>
                            <label htmlFor="serviceAddress" className="block text-sm font-medium leading-6 text-gray-900">
                                Service Address
                            </label>
                            <textarea
                                id="serviceAddress"
                                name="serviceAddress"
                                autoComplete="serviceAddress"
                                required
                                {...register('serviceAddress', { required: 'Service Address is required' })}
                                className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.serviceAddress ? 'border-red-500' : ''}`}
                            />
                            {errors.serviceAddress && <p className="text-red-500 text-sm mt-1">{errors.serviceAddress.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">
                                Upload Images/Videos
                            </label>
                            <input
                                id="images"
                                name="images"
                                type="file"
                                onChange={(e) => handleFileChange(e)}
                                multiple
                                accept="image/*, video/*"
                                // {...register('issueImages', { required: 'Images/Videos are required' })}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.images ? 'border-red-500' : ''}`}
                            />
                            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}

                            <div className='mt-5  '>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={changeImage}
                                    className="flex   justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Update Image
                                </button>
                            </div>
                        </div>
                        <div>
                            {
                                uploadedImage === "" ?

                                    <img

                                        src={service?.issueImages}
                                        height="200px"
                                        width="200px"
                                        className='m-2'
                                        alt='image'
                                    />

                                    :
                                    <img
                                        src={URL.createObjectURL(uploadedImage)}
                                        height="200px"
                                        width="200px"
                                        className='m-2'
                                        alt=''
                                    />

                            }
                        </div> */}
                        
                  <div>
                    <label htmlFor="serviceLocation" className="block text-sm font-medium leading-6 text-gray-900">
                      Service Pincode
                    </label>

                    <input
                      name="pincode"
                      type="number"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter pincode"
                      className="border p-2 mb-4 w-full"
                    />
                    {error && <p className="text-red-500 mt-1">{error}</p>}
                  </div>
                  <div className=' '>
                    <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">
                    District
                    </label>
                    <div className="mt-2">
                      <input
                        id="district"
                        name="district"
                        type="text"
                        autoComplete="off"
                        {...register('district')}
                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                      />
                    </div>
                  </div>
                  <div className=' '>
                    <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                    State
                    </label>
                    <div className="mt-2">
                      <input
                        id="state"
                        name="state"
                        type="text"
                        autoComplete="off"
                        {...register('state')}
                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  `}
                      />
                    </div>
                  </div>
                    </form>

                    <div className='mt-5  '>
                        <button
                            type="button"
                            disabled={loading}
                            onClick={handleSubmit(onSubmit)}
                            className="flex   justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>


        </Sidenav>
           }
        </>

    )
}

export default Editservice





