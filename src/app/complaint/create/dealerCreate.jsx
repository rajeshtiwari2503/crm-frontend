
"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ReactLoader } from '@/app/components/common/Loading';


const AddDealerComplaint = ({ nature, subCategory }) => {

    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [productName, setProductName] = useState("")
    const [image, setImage] = useState("")
    const [imageWaranty, setWarantyImage] = useState("")
    const [isWaranty, setIsWaranty] = useState(false)
    const [subCat, setSubCat] = useState([])
    const [compNature, setComplaintNature] = useState([])
    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm();
    const [products, setProducts] = useState([])
    const [value, setLocalValue] = useState('');

    const [pincode, setPincode] = useState('');
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');

    const getAllProducts = async () => {
        let response = await http_request.get("/getAllProduct")
        let { data } = response;

        setProducts(data)
    }
    const RegiterComplaint = async (reqdata) => {

        try {
            if (location) {
                setLoading(true)
                const formData = new FormData();

                for (const key in reqdata) {
                    if (reqdata.hasOwnProperty(key)) {
                        formData.append(key, reqdata[key]);
                    }
                }
                const issueImages = image;
                // console.log("dhhh",issueImages);
                // if (issueImages) {
                //     formData.append('issueImages', issueImages);
                // }
                if (imageWaranty) {
                    formData.append('issueImages', imageWaranty);
                }
                if (isWaranty == true && imageWaranty === "") {
                    alert("Please Select Issue  Image")
                    setLoading(false)
                } else {
                    let response = await http_request.post('/createComplaint', formData)
                    const { data } = response
                    ToastMessage(data)
                    setLoading(false)
                    router.push("/complaint/allComplaint")
                }
            }
            else {
                // setError('Please enter a valid pincode.');
                return;

            }

        }
        catch (err) {
            setLoading(false)
            ToastMessage(err.response.data)

            console.log(err);
        }

    }

    const onSubmit = async (data) => {
        try {

            if (pincode) {
                const locationResponse = await fetchLocation();

                if (!locationResponse) {
                    setError('Failed to fetch location details.');
                    return;
                }


                await RegiterComplaint(data);

            } else {
                setError('Please enter a pincode.');
            }
        } catch (error) {
            // Handle unexpected errors
            setError('An error occurred while submitting the complaint. Please try again.');
            console.error(error);
        }
    };


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

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        setProductName(selectedProductId)
        const selectedProduct = products.find(product => product._id === selectedProductId);

        if (selectedProduct) {
            const selectednature = nature?.filter(nature => nature?.productId === selectedProduct?._id);
            setComplaintNature(selectednature);
            const selectesubCat = subCategory?.filter(cat => cat?.categoryId === selectedProduct?.categoryId);
            setSubCat(selectesubCat);
            setValue('productName', selectedProduct.productName);
            setValue('categoryName', selectedProduct.categoryName);
            setValue('productBrand', selectedProduct.productBrand);
            setValue('productId', selectedProduct._id);
            setValue('categoryId', selectedProduct.categoryId);
            setValue('brandId', selectedProduct.brandId);
            setValue('modelNo', selectedProduct.modelNo);
            setValue('serialNo', selectedProduct.serialNo);
            // setValue('purchaseDate', selectedProduct.purchaseDate);
            setValue('warrantyStatus', selectedProduct.warrantyStatus);
            setValue('warrantyYears', selectedProduct.warrantyYears);
            setValue('subCategoryName', selectedProduct?.subCategory);



        }
    };

    const handleSubCatChange = (e) => {
        const selectedSubCatId = e.target.value;

        const selectedSub = subCat.find(cat => cat._id === selectedSubCatId);

        if (selectedSub) {
            setValue('subCategoryName', selectedSub?.subCategoryName);
        }
    };

    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setLocalValue(JSON.parse(storedValue));
            const userData = JSON.parse(storedValue)
            // console.log(userData);

            setValue("warrantyStatus", "Out of Warranty")
            if (userData?.user?.role === "USER") {
                setValue('userName', userData?.user?.name)
                setValue('userId', userData?.user?._id);
                setValue('emailAddress', userData?.user?.email);
                setValue('phoneNumber', userData?.user?.contact);
                setValue('serviceAddress', userData?.user?.address);
                setValue('fullName', userData?.user?.name);
            }
            else {
                setValue('dealerName', userData?.user?.name)
                setValue('dealerId', userData?.user?._id);
            }
        }

        getAllProducts()

    }, [productName])
    const handleFileChange = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])

            setImage(e.target.files[0]);


            // console.log("dhhh",e.target.files[0]);
            if (value?.user?.role === "DEALER") {
                setValue('dealerName', value?.user?.name)
                setValue('dealerId', value?.user?._id);
            } else if (value?.user?.role === "BRAND") {
                setValue('brandId', value?.user?._id);
            }

        }
    }
    const handleFileChangeWarranty = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0])
            setWarantyImage(e.target.files[0]);


            // console.log("dhhh",e.target.files[0]);
            if (value?.user?.role === "DEALER") {
                setValue('dealerName', value?.user?.name)
                setValue('dealerId', value?.user?._id);
            } else if (value?.user?.role === "BRAND") {
                setValue('brandId', value?.user?._id);
            }

        }
    }
    const handleWaranty = (e) => {
        const selectedProductId = e.target.value;

        if (selectedProductId === "true") {
            setValue('dealerName', value?.user?.name)
            setValue('dealerId', value?.user?._id);
            setValue("warrantyStatus", selectedProductId)
            setWarantyImage("")
            setIsWaranty(true)
        }
        else {
            setValue("warrantyStatus", false)
            setIsWaranty(true)
            setWarantyImage("warrantyStatus false")
        }

    }
const filterProducts=products?.filter((f)=>f?.userId===value?.user?._id)
    return (
        <>

            <div className=" ">
                {loading === true ? <ReactLoader />
               : <div  >
                        <h2 className=" text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Create a  new complaint
                        </h2>

                        <form className="mt-3 grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-3" onSubmit={handleSubmit(onSubmit)}>
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
                            {value?.user?.role === "USER" ?
                                <div>
                                    <label htmlFor="productName" className="block text-sm font-medium leading-6 text-gray-900">
                                        Product Name
                                    </label>
                                    <select
                                        id="productName"
                                        name="productName"
                                        onChange={handleProductChange}
                                        // {...register('productName', { required: 'Product is required' })}
                                        className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productName ? 'border-red-500' : ''}`}
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
                                : ""
                            }
                            <div>
                                <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Product Category
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
                                <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                                    Product Sub Category
                                </label>
                                <input
                                    id="subCategoryName"
                                    name="subCategoryName"
                                    type="text"
                                    autoComplete="off"
                                    // readOnly
                                    {...register('subCategoryName', { required: 'Sub Category is required' })}
                                    className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.subCategoryName ? 'border-red-500' : ''}`}
                                />
                                {errors.subCategoryName && <p className="text-red-500 text-sm mt-1">{errors.subCategoryName.message}</p>}
                            </div>
                            {/* {value?.user?.role === "USER" ?
                                <div>
                                    <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                                        Product Sub Category
                                    </label>
                                    <select
                                        id="subCategoryName"
                                        name="subCategoryName"
                                        onChange={handleSubCatChange}
                                        className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.categoryName ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Select a product</option>
                                        {subCat?.map(sub => (
                                            <option key={sub._id} value={sub._id}>
                                                {sub.subCategoryName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.subCategoryName && <p className="text-red-500 text-sm mt-1">{errors.subCategoryName.message}</p>}
                                </div>
                                : ""
                            } */}
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
                            {/* {value?.user?.role === "USER" ?
                                <div>
                                    <label htmlFor="productBrand" className="block text-sm font-medium leading-6 text-gray-900">
                                        Brand
                                    </label>
                                    <select
                                        id="productBrand"
                                        name="productBrand"
                                        // onChange={handleProductChange}
                                        className={`block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Select a Brand</option>
                                        {products.map(product => (
                                            <option key={product.productId} value={product.productId}>
                                                {product.productName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
                                </div>
                                : ""
                            } */}
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
                            {/* <div className=' '>
                <label htmlFor="selectedYear" className="block text-sm font-medium leading-6 text-gray-900">
                  Select Year
                </label>
                <div className="mt-2">
                  <select
                    id="selectedYear"
                    name="selectedYear" 
                    aria-readonly
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className={` block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  >
                    
                    {Array.from({ length: 10 }, (_, index) => new Date().getFullYear() + index).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}
                            {/* <div className=' '>
                            <label htmlFor="purchaseDate" className="block text-sm font-medium leading-6 text-gray-900">
                                Warranty Years
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
                        </div> */}

                            {/* <div>
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
                                {compNature?.map((item, i) => (
                                    <option key={i} value={item.nature}>
                                        {item?.nature}
                                    </option>

                                ))}
                            </select>
                            {errors.issueType && <p className="text-red-500 text-sm mt-1">{errors.issueType.message}</p>}
                        </div> */}
                            <div className=' '>
                                <label htmlFor="modelNo" className="block text-sm font-medium leading-6 text-gray-900">
                                    Issue Type
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="issueType"
                                        name="issueType"
                                        type="text"
                                        autoComplete="off"
                                        {...register('issueType', { required: 'Issue Type is required' })}
                                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.issueType ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.issueType && <p className="text-red-500 text-sm mt-1">{errors.issueType.message}</p>}

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
                                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.issueImages ? 'border-red-500' : ''}`}
                                />
                                {image === "" ? <p className="text-red-500 text-sm mt-1">{"Uploade Image"}</p> : ""}
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
                            {/* <div>
                            <label htmlFor="issueType" className="block text-sm font-medium leading-6 text-gray-900">
                                Warranty Status
                            </label>
                            <select
                                id="warrantyStatus"
                                name="warrantyStatus"
                                autoComplete="warrantyStatus"
                                required
                                onChange={handleWaranty}
                                // {...register('warrantyStatus', { required: 'warrantyStatus is required' })}
                                className={` block mt-2 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.warrantyStatus ? 'border-red-500' : ''}`}
                            >
                                <option value=" ">Select Warranty Status</option>
                                <option value="true" >Warranty</option>
                                <option value="false" >Out of Warranty</option>

                            </select>
                            {isWaranty === false && <p className="text-red-500 text-sm mt-1">{'Warranty Status is required'}</p>}
                        </div> */}
                            {/* <div>
                            <label htmlFor="images" className="block text-sm font-medium leading-6 text-gray-900">
                                Upload Images/Videos
                            </label>
                            <input
                                id="images"
                                name="issueImages"
                                type="file"
                                onChange={(e) => handleFileChangeWarranty(e)}
                                multiple
                                accept="image/*, video/*"
                                // {...register('issueImages', { required: 'Images/Videos are required' })}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.issueImages ? 'border-red-500' : ''}`}
                            />
                            {imageWaranty === "" && <p className="text-red-500 text-sm mt-1">{"Uploade warranty Image"}</p>}
                        </div> */}
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
                        </form>
                        <div className='mt-5  '>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={handleSubmit(onSubmit)}
                                className="flex   justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                }
            </div>


        </>

    )
}

export default AddDealerComplaint





