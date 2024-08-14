import { ToastMessage } from '@/app/components/common/Toastify';
import React, { useState } from 'react';
import http_request from '../../../../http-request'
import { useForm } from 'react-hook-form';

const ProductWarrantyForm = ({ product, existingProduct, RefreshData, onClose }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loadind, setLoading]=useState(false)

    const AddProductWarranty = async (data) => {
        try {
            setLoading(true);
            const endpoint = existingProduct?._id ? `/editProductWarranty/${existingProduct._id}` : '/addProductWarranty';
            const response = existingProduct?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, data);
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            RefreshData(responseData);
            onClose(true);
        } catch (err) {
            setLoading(false);
            ToastMessage(err?._message);
            // onClose(true);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        AddProductWarranty(data)
        console.log(data);
        

    };

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = product?.find(prod => prod._id === selectedProductId);

        if (selectedProduct) {
            setValue('productId', selectedProduct._id);
            setValue('productName', selectedProduct.productName);
            setValue('brandName', selectedProduct.userName);
            setValue('brandId', selectedProduct.userId);
            setValue('categoryId', selectedProduct.categoryId);
            setValue('categoryName', selectedProduct.categoryName);
            setValue('year', new Date());
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <select
                            id="productName"
                            name="productName"
                            onChange={handleProductChange}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.productName ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select a product</option>
                            {product?.map((prod) => (
                                <option key={prod._id} value={prod._id}>
                                    {prod.productName}
                                </option>
                            ))}
                        </select>
                        {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Product ID</label>
                        <input
                            id="productId"
                            type="text"
                            {...register('productId')}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.productId ? 'border-red-500' : ''}`}
                        />
                        {errors.productId && <p className="text-red-500 text-sm">{errors.productId.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category Code</label>
                        <input
                            id="categoryId"
                            type="text"
                            {...register('categoryId')}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.categoryId ? 'border-red-500' : ''}`}
                        />
                        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="brandCode" className="block text-sm font-medium text-gray-700">Brand Code</label>
                        <input
                            id="brandCode"
                            type="text"
                            {...register('brandId')}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.brandId ? 'border-red-500' : ''}`}
                        />
                        {errors.brandId && <p className="text-red-500 text-sm">{errors.brandId.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="batchNo" className="block text-sm font-medium text-gray-700">Batch Number</label>
                        <input
                            id="batchNo"
                            type="text"
                            {...register('batchNo', { required: 'Batch number is required' })}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.batchNo ? 'border-red-500' : ''}`}
                        />
                        {errors.batchNo && <p className="text-red-500 text-sm">{errors.batchNo.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="numberOfGenerate" className="block text-sm font-medium text-gray-700">Number Of Generate</label>
                        <input
                            id="numberOfGenerate"
                            type="number"
                            {...register('numberOfGenerate', {
                                required: 'Number Of Generate is required',
                                valueAsNumber: true,
                                min: { value: 1, message: 'Number Of Generate must be greater than 0' }
                            })}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.numberOfGenerate ? 'border-red-500' : ''}`}
                        />
                        {errors.numberOfGenerate && <p className="text-red-500 text-sm">{errors.numberOfGenerate.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="warrantyInDays" className="block text-sm font-medium text-gray-700">Warranty In Days</label>
                        <input
                            id="warrantyInDays"
                            type="number"
                            {...register('warrantyInDays', {
                                required: 'Warranty In Days is required',
                                valueAsNumber: true,
                                min: { value: 10, message: 'Warranty In Days must be greater than 0' }
                            })}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.warrantyInDays ? 'border-red-500' : ''}`}
                        />
                        {errors.warrantyInDays && <p className="text-red-500 text-sm">{errors.warrantyInDays.message}</p>}
                    </div>
                    {/* <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                        <input
                            id="year"
                            type="date"
                            {...register('year', {
                                valueAsNumber: true,
                                required: 'Year is required',
                                min: { value: 1900, message: 'Year must be greater than or equal to 1900' },
                                max: { value: new Date().getFullYear(), message: `Year cannot be greater than ${new Date().getFullYear()}` }
                            })}
                            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.year ? 'border-red-500' : ''}`}
                        />
                        {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
                    </div> */}
                </div>

                <div className="mt-4">
                    <button type="submit" disabled={loadind}className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductWarrantyForm;
