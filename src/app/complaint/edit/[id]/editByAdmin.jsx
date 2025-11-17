
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
 
import axios from 'axios';
import dayjs from 'dayjs';
import Select from 'react-select';
import { ReactLoader } from '@/app/components/common/Loading';
import { useUser } from '@/app/components/UserContext';


const EditByAdmin = ( {service}) => {

    const {user}=useUser()

  const router = useRouter()

  const [loading, setLoading] = useState(false)
  

  const { register, handleSubmit, formState: { errors }, getValues,reset, watch, setValue } = useForm();
  const [products, setProducts] = useState([])
  const [brand, setBrands] = useState([])
  const [subCategory, setSubCategory] = useState([])
 
  const [compNature, setComplaintNature] = useState([])
  const [nature, setNature] = useState([])

 
  const [selectedBrand, setSelectedBrand] = useState('');

  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
 
 
  

   
 
 

  useEffect(() => {
  
    getAllBrands()
    getAllProducts()
    getAllSubCategory()
    getAllCompNature()
}, [ ]);

useEffect(() => {
    if (service) {
      
 

        // Set form values only after service is fetched
        setValue('fullName', service.fullName || '');
        setValue('phoneNumber', service.phoneNumber || '');
        setValue('emailAddress', service.emailAddress || '');
        setValue('serviceAddress', service.serviceAddress || '');
        setValue('errorMessages', service.errorMessages || '');
        // setValue('issueType', service.issueType || '');
        setValue('modelNo', service.modelNo || '');
        setValue('productName', service.productName || '');
        setValue('productBrand', service.productBrand || '');
        setValue('categoryName', service.categoryName || '');
        setValue('serialNo', service.serialNo || '');
        setValue('serviceLocation', service.serviceLocation || '');
        setValue('detailedDescription', service.detailedDescription || '');
        setValue('alternateContactInfo', service.alternateContactInfo || '');
        setValue('warrantyYears', service.warrantyInDays);
        setPincode(  service?.pincode || '');

        if (service.preferredServiceDate) {
            setValue('preferredServiceDate', new Date(service.preferredServiceDate).toISOString().split('T')[0]);
        }
        if (service.preferredServiceTime) {
            setValue('preferredServiceTime', service.preferredServiceTime);
        }
        if (service.purchaseDate) {
            setValue('purchaseDate', new Date(service.purchaseDate).toISOString().split('T')[0]);
        }
    }
}, [service]);

 

  const getAllProducts = async () => {
    try {
      let response = await http_request.get("/getAllProduct")
      let { data } = response;

      setProducts(data)
    }
    catch (err) {
      console.log(err);

    }
  }
  const getAllBrands = async () => {
    try {
      let response = await http_request.get("/getAllBrand")
      let { data } = response;

      setBrands(data)
    }
    catch (err) {
      console.log(err);

    }
  }
  const getAllSubCategory = async () => {
    try {
      let response = await http_request.get(`/getAllSubCategory`)
      let { data } = response;

      setSubCategory(data)
    }
    catch (err) {
      console.log(err);

    }
  }
  const getAllCompNature = async () => {
    try {
      let response = await http_request.get(`/getAllComplaintNature`)
      let { data } = response;

      setNature(data)
    }
    catch (err) {
      console.log(err);

    }
  }
 

  // console.log(nature);
  const Updateservice = async (reqD) => {
        try {
            const reqdata={...reqD,empName:user?.user?.name,empId:user?.user?._id }
            // console.log("reqdata",reqdata);
            
            setLoading(true)
            let response = await http_request.patch(`/editComplaint/${service?._id}`, reqdata)
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
  const onSubmit = async (data) => {
    try {

       


        await Updateservice(data);

     
    } catch (error) {
      // Handle unexpected errors
      setError('An error occurred while submitting the complaint. Please try again.');
      console.error(error);
    }
  };


  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    // setProductName(selectedProductId)
    const selectedProduct = products.find(product => product._id === selectedProductId);


    if (selectedProduct) {
      const selectednature = nature?.filter(nat =>
        nat.products?.some(product => product.productId === selectedProduct?._id))
      setComplaintNature(selectednature);
      const selectesubCat = subCategory?.filter(cat => cat?.categoryId === selectedProduct?.categoryId);
    //   setSubCat(selectesubCat);
      setValue('productName', selectedProduct.productName);
      setValue('categoryName', selectedProduct.categoryName);
      setValue('productBrand', selectedProduct.productBrand);
      setValue('productId', selectedProduct._id);
      setValue('categoryId', selectedProduct.categoryId);
      setValue('brandId', selectedProduct.brandId);
      setValue('modelNo', selectedProduct.modelNo);
      setValue('serialNo', selectedProduct.serialNo);
    //   setValue('purchaseDate', selectedProduct.purchaseDate);
      setValue('subCategoryName', selectedProduct?.subCategory);
      setValue('subCategoryId', selectedProduct?.subCategoryId);

    //   setWarrantyInDays(selectedProduct.warrantyInDays)
      setValue('warrantyYears', selectedProduct.warrantyInDays);

    }
  };
 
  useEffect(() => {
    if (pincode?.length === 6) { // Ensure the pincode is valid (assuming 6 digits)
      fetchLocation();
       setValue('pincode', pincode)
    }
  }, [pincode]);
  const fetchLocation = async () => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data && response.data[0].Status === 'Success') {

        const [details] = response.data;

        const { District, State } = details.PostOffice[0];

        setLocation({ District, State });
        setValue('pincode', pincode);
        setValue('state', State);
        setValue('district', District);
        setError('')
        return response.data[0].PostOffice[0]; // Return the location details
      } else {
        setError('No location found for the provided pincode.');
        return null;
      }
    } catch (error) {
      setError('Error fetching location details.');
      console.error(error);
      return null;
    }
  };

 
  




   
  const handleIssueChange = (selectedOptions) => {

    // console.log( selectedOptions.map(option => option.label));

    setValue('issueType', selectedOptions.map(option => option.label));
  };
  // console.log(products);

  const filterProducts = user?.user?.role === "ADMIN" || user?.user?.role === "EMPLOYEE" ? products?.filter((f) => f?.userId === selectedBrand) :user?.user?.role === "BRAND EMPLOYEE"?products?.filter((f) => f?.userId === value?.user?.brandId): products?.filter((f) => f?.userId === value?.user?._id)
  return (
    <>

      <Sidenav >
        
       <div className=" ">


            {loading === true ? <ReactLoader />
              : <div  >
                <h2 className=" text-2xl font-bold leading-9 tracking-tight text-gray-900">
                  Edit complaint
                </h2>

                <form className="mt-3 grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-3" onSubmit={handleSubmit(onSubmit)}>
                  
                  {user?.user?.role === "ADMIN" || value?.user?.role === "EMPLOYEE" ?
                    <div>
                      <label htmlFor="productBrand" className="block text-sm font-medium leading-6 text-gray-900">
                        Brand
                      </label>
                      <select
                        id="productBrand"
                        name="productBrand"
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
                      >
                        <option value="">Select a Brand</option>
                        {brand?.map(product => (
                          <option key={product.productId} value={product._id}>
                            {product.brandName}
                          </option>
                        ))}
                      </select>
                      {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
                    </div>
                    : ""}
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium leading-6 text-gray-900">
                      Product Name
                    </label>
                    <select
                      id="productName"
                      name="productName"
                      onChange={handleProductChange}
                      // {...register('productName', { required: 'Product is required' })}
                      className={`block mt-1 p-3 w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productName ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a product</option>
                      {filterProducts?.map(product => (
                        <option key={product.productId} value={product._id}>
                          {product.productName}
                        </option>
                      ))}
                    </select>
                    {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium leading-6 text-gray-900">
                      Product Name
                    </label>
                    <input
                      id="productName"
                      name="productName"
                      type="text"
                      autoComplete="off"
                      // readOnly
                      {...register('productName', { required: 'Product is required' })}
                      className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.categoryName ? 'border-red-500' : ''}`}
                    />
                    {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                      Product  Category
                    </label>
                    <input
                      id="categoryName"
                      name="categoryName"
                      type="text"
                      autoComplete="off"
                      // readOnly
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
                      // readOnly
                      {...register('productBrand', { required: 'Product Brand is required' })}
                      className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
                    />
                    {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
                  </div>
 



                  <div className=' '>
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
                    <label htmlFor="purchaseDate" className="block text-sm font-medium leading-6 text-gray-900">
                      Warranty on Product
                    </label>
                    <div className="mt-2">
                      <input
                        id="purchaseDate"
                        name="warrantyYears"
                        type="text"
                        {...register('warrantyYears')}
                        className={`block p-3 w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.purchaseDate ? 'border-red-500' : ''}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="purchaseDate" className="block text-sm font-medium leading-6 text-gray-900">
                      Purchase Date
                    </label>
                    <div className="mt-2">
                      <input
                        id="purchaseDate"
                        name="purchaseDate"
                        type="date"
                        {...register('purchaseDate', { required: 'Purchase date is required' })}
                        className={`block p-3 w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.purchaseDate ? 'border-red-500' : ''}`}
                      />
                      {errors.purchaseDate && <p className="text-red-500">{errors.purchaseDate.message}</p>}
                      {/* {warrantyStatus && (warrantyStatus === "Under Warranty" ? <p className="text-green-500">Remaining Days {warrantyInDaysRem},{warrantyStatus}</p> : <p className="text-red-500">"Remaining Days {warrantyInDaysRem},{warrantyStatus}</p>)} */}
                    </div>
                  </div>
                  
                  <div >
                    <label className="text-sm">    Issue Type</label>
                    <Select
                      isMulti
                      // options={compNature}
                      options={compNature.map((nat) => ({
                        value: nat._id,
                        label: nat.nature
                      }))}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleIssueChange}

                    />

                    {errors.issueType && <p className="text-red-500">{errors.issueType.message}</p>}
                  </div>
                  
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
                  <div>
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
                  <div className=' flex md:col-span-3 gap-4'>
                    <div className=' w-full'>
                      <label htmlFor="detailedDescription" className="block text-sm font-medium leading-6 text-gray-900">
                        Details Problem Description
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
                  </div>

                 
                 
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
                      {...register('alternateContactInfo' )}
                      className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.alternateContactInfo ? 'border-red-500' : ''}`}
                    />
                    
                  </div>
                  <div className=' '>
                    <label htmlFor="orderId" className="block text-sm font-medium leading-6 text-gray-900">
                    Order Id
                    </label>
                    <div className="mt-2">
                      <input
                        id="orderId"
                        name="orderId"
                        type="text"
                        autoComplete="off"
                        {...register('orderId')}
                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.serialNo ? 'border-red-500' : ''}`}
                      />
                    </div>
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
                      {...register('emailAddress'
                      //   , {
                      //   required: 'Email Address is required',
                      //   pattern: {
                      //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      //     message: 'Please enter a valid email address',
                      //   },
                      // }
                    )}
                      className={`block p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.emailAddress ? 'border-red-500' : ''}`}
                    />
                    {/* {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress.message}</p>} */}
                  </div>
                  <div className=' '>
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
                </form>
                <div className='mt-5  '>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit(onSubmit)}
                    className="flex   justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {loading ?"Submitting....":"Submit"}
                  </button>
                </div>
              </div>
            }
          </div>
 
      </Sidenav>
    </>

  )
}

export default EditByAdmin





