import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const AddProduct = ({ existingProduct, RefreshData, onClose, userData, categories }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const AddProductData = async (data) => {
        try {
            setLoading(true);

            const selectedCategory = categories.find(category => category._id === data.categoryId);
            const reqData = {
                ...data,
                categoryName: selectedCategory?.categoryName,
                categoryId: selectedCategory?._id,
                userId: userData?.user?._id,
                userName: userData?.user?.name
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
            setValue('warrantyStatus', existingProduct.warrantyStatus);
            setValue('serialNo', existingProduct.serialNo);
            setValue('modelNo', existingProduct.modelNo);
            setValue('purchaseDate', existingProduct.purchaseDate);
            setValue('productBrand', existingProduct.productBrand);
        }
    }, [existingProduct, setValue]);

    return (
        <div>
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
                            {...register('categoryId', { required: 'Category is required' })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.categoryId ? 'border-red-500' : ''}`}
                        >
                            {categories?.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
                </div>
                <div className=''>
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
                <div className='flex items-center'>
                    <label htmlFor="warrantyStatus" className="block text-sm font-medium leading-6 text-gray-900">
                        Warranty Status
                    </label>
                    <input
                        id="warrantyStatus"
                        name="warrantyStatus"
                        type="checkbox"
                        {...register('warrantyStatus')}
                        className="ml-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                </div>
                <div className='w-[400px]'>
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
                <div className='flex justify-between mt-8'>
                    <Button variant="outlined" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                        Cancel
                    </Button>
                    {existingProduct?._id ? (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Update
                        </Button>
                    ) : (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Add Product
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
