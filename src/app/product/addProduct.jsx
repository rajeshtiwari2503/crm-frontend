import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';
import { ReactLoader } from '../components/common/Loading';

const AddProduct = ({ existingProduct, RefreshData, subCategories, onClose, userData, categories, brands }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [selectedYear, setSelectedYear] = useState("Life Time");
    const [subCat, setSubCat] = useState(null);

    const calculateWarrantyStatus = (purchaseDate, selectedYear) => {
        if (!purchaseDate) return false;
        const currentDate = new Date();
        const purchaseDateObj = new Date(purchaseDate);

        if (selectedYear === "Life Time") {
            // Warranty is always valid for "Life Time"
            return true;
        }

        const warrantyPeriod = parseInt(selectedYear, 10) * 365;
        const warrantyEndDate = new Date(purchaseDateObj.getTime() + warrantyPeriod * 24 * 60 * 60 * 1000);
        return currentDate <= warrantyEndDate;
    };



    const AddProductData = async (data) => {
        try {
            setLoading(true);

            const selectedCategory = categories.find(category => category._id === data.categoryId);

            const reqData = {
                ...data,
                categoryName: selectedCategory?.categoryName,
                categoryId: selectedCategory?._id,

                userId: userData?.user?.role==="BRAND EMPLOYEE"?userData?.user?.brandId:userData?.user?._id,
                userName: userData?.user?.role==="BRAND EMPLOYEE"?userData?.user?.brandName:userData?.user?.name,
                warrantyYears: selectedYear,
                // warrantyStatus:calculateWarrantyStatus(data.purchaseDate, selectedYear)
            };

            const endpoint = existingProduct?._id ? `/editProduct/${existingProduct._id}` : '/addProduct';
            const response = existingProduct?._id ? await http_request.patch(endpoint, reqData) : await http_request.post(endpoint, reqData);
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            RefreshData(responseData);
            onClose(true);
        } catch (err) {
            setLoading(false);
            ToastMessage(err?._message);
            onClose(true);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        AddProductData(data);
    };

    useEffect(() => {
        if (existingProduct) {
            setValue('productName', existingProduct.productName);
            setValue('productDescription', existingProduct.productDescription);
            setValue('categoryId', existingProduct.categoryId);
            setValue('serialNo', existingProduct.serialNo);
            setValue('modelNo', existingProduct.modelNo);
            setValue('purchaseDate', existingProduct.purchaseDate);
            setValue('warrantyYears', existingProduct.warrantyYears);
            setValue('warrantyInDays', existingProduct.warrantyInDays);
            setValue('productBrand', existingProduct.productBrand);
            setValue('subCategory', existingProduct.subCategory);
            setValue('subCategoryId', existingProduct.subCategoryId);
            setValue('categoryName', existingProduct.categoryName);
            setValue('categoryId', existingProduct.categoryId);
            setValue('brandId', existingProduct.brandId);
            setSelectedYear(existingProduct.warrantyYears)
        }
    }, [existingProduct, setValue]);

    const handleChangeBrand = (id) => {
        const selectedBrand = brands.find(brand => brand._id === id);
        // console.log(selectedBrand);
        if (selectedBrand) {
            setValue('productBrand', selectedBrand?.brandName);
            setValue('brandId', selectedBrand?._id);
        }

    }

    const warrantyYears = ["Life Time", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    // const [selectedYear, setSelectedYear] = useState("Life Time");  

    const handleYearChange = (e) => {
        const value = e.target.value;
        setSelectedYear(value === "Life Time" ? value : parseInt(value, 10));
    };

    const handleCatChange = (e) => {
        const selectedCatId = e.target.value;
        // console.log(selectedCatId);

        const selectedCat = categories.find(cat => cat._id === selectedCatId);
        // console.log(userData);

        if (selectedCat) {
            setValue('categoryName', selectedCat?.categoryName);
            setValue('categoryId', selectedCat?._id);
            setValue('productBrand', userData?.user?.role==="BRAND EMPLOYEE"?userData?.user?.brandName:userData?.user?.brandName);
            setValue('brandId', userData?.user?.role==="BRAND EMPLOYEE"?userData?.user?.brandId:userData?.user?._id);
            const filterSabCat = subCategories?.filter((f) => f?.categoryId === selectedCat?._id)
            //   console.log(filterSabCat);

            setSubCat(filterSabCat)
        }
    };
    const handleSubCatChange = (e) => {
        const selectedSubCatId = e.target.value;
        // console.log(selectedSubCatId);

        const selectedSub = subCat.find(cat => cat._id === selectedSubCatId);
        // console.log(selectedSub);

        if (selectedSub) {
            setValue('subCategory', selectedSub?.subCategoryName);
            setValue('subCategoryId', selectedSub?._id);
        }
    };


    return (
        <div>
            {loading === true ?
                <div className='w-[300px] h-[300px]'>

                    <ReactLoader />
                </div>
                :
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='w-[400px]'>
                        <label htmlFor="productName" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Name
                        </label>
                        <div className="mt-2">
                            <input
                                id="productName"
                                name="productName"
                                type="text"
                                autoComplete="off"
                                required
                                {...register('productName', { required: 'Product Name is required', minLength: { value: 3, message: 'Product Name must be at least 3 characters long' } })}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productName ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                    </div>
                    <div className=''>
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
                    </div>
                    <div className='w-[400px]'>
                        <label htmlFor="categoryId" className="block text-sm font-medium leading-6 text-gray-900">
                            Category
                        </label>
                        <div className="mt-2">
                            <select
                                id="categoryId"
                                name="categoryId"
                                required
                                // {...register('categoryId', { required: 'Category is required' })}

                                onChange={handleCatChange}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.categoryId ? 'border-red-500' : ''}`}
                            >

                                {existingProduct?.categoryId ? <option value={existingProduct?.categoryId}>{existingProduct?.categoryName}</option>
                                    : <option value="">Select a Category</option>
                                }
                                {categories?.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.categoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                    </div>
                    <div className='w-[400px]'>
                        <label htmlFor="subCategoryId" className="block text-sm font-medium leading-6 text-gray-900">
                            Sub Category
                        </label>
                        <div className="mt-2">
                            <select
                                id="subCategoryId"
                                name="subCategoryId"
                                required
                                // {...register('subCategoryId', { required: 'Sub Category is required' })}

                                onChange={handleSubCatChange}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  }`}
                            >

                                {existingProduct?.subCategoryId ? <option value={existingProduct?.subCategoryId}>{existingProduct?.subCategory}</option>
                                    : <option value="">Select a Sub Category</option>
                                }
                                {subCat?.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.subCategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.subCategoryId && <p className="text-red-500 text-sm mt-1">{errors.subCategoryId.message}</p>}
                    </div>

                    {/* <div className=''>

                    <label htmlFor="productBrand" className="block text-sm font-medium leading-6 text-gray-900">
                        Brand
                    </label>
                    <div className="mt-2">
                        <input
                            id="productBrand"
                            name="productBrand"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('productBrand', { required: 'Product Brand is required', minLength: { value: 3, message: 'Product Brand must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
                </div>
                <div className=''>
                    OR
                </div>
                <div className='w-[400px] mt-[-13px]'>
                    <label htmlFor="brandId" className="block text-sm font-medium leading-6 text-gray-900">
                        Brand
                    </label>
                    <div className="mt-2">
                        <select
                            id="brandId"
                            name="productBrand"

                            onChange={(e) => handleChangeBrand(e.target.value)}

                            
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select a Brand</option>
                            {brands?.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
                </div> */}
                    <div className='w-[400px]'>
                        <label htmlFor="serialNo" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Identification No.
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
                    <div className='w-[400px]'>
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
                    {(userData?.user?.role === "USER" && existingProduct) ?
                        <>
                            <div className='w-[400px]'>
                                <label htmlFor="selectedYear" className="block text-sm font-medium leading-6 text-gray-900">
                                    Select Year
                                </label>
                                <div className="mt-2">
                                    <select
                                        id="selectedYear"
                                        name="selectedYear"
                                        value={selectedYear}
                                        onChange={handleYearChange}
                                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                    >

                                        {warrantyYears.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='w-[400px]'>
                                <label htmlFor="purchaseDate" className="block text-sm font-medium leading-6 text-gray-900">
                                    Purchase Date
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="purchaseDate"
                                        name="purchaseDate"
                                        type="date"
                                        {...register('purchaseDate')}
                                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.purchaseDate ? 'border-red-500' : ''}`}
                                    />
                                </div>
                            </div>
                        </>
                        : <div>
                            <label htmlFor="warrantyInDays" className="block text-sm font-medium text-gray-700">Warranty In Days</label>
                            <input
                                id="warrantyInDays"
                                type="number"
                                {...register('warrantyInDays'
                                //     , {
                                //     required: 'Warranty In Days is required',
                                //     valueAsNumber: true,
                                //     min: { value: 10, message: 'Warranty In Days must be greater than 0' }
                                // }
                            )}
                                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.warrantyInDays ? 'border-red-500' : ''}`}
                            />
                            {/* {errors.warrantyInDays && <p className="text-red-500 text-sm">{errors.warrantyInDays.message}</p>} */}
                        </div>}
                    <div className='flex justify-between mt-8'>
                        <Button variant="contained" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                            Cancel
                        </Button>
                        {existingProduct?._id ? (
                            <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                Update
                            </Button>
                        ) : (
                            <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                Add Product
                            </Button>
                        )}
                    </div>
                </form>
            }
        </div>
    );
};

export default AddProduct;
