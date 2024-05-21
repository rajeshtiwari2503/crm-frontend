import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const AddProduct = ({ existingProduct, RefreshData, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const AddProductData  = async (data) => {
        try {
            setLoading(true);
            const endpoint = existingProduct?._id ? `/editProduct/${existingProduct._id}` : '/addProduct';
            const response = existingProduct?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, data);
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

    
    React.useEffect(() => {
        if (existingProduct) {
            setValue('productName', existingProduct.productName);
            setValue('productDescription', existingProduct.productDescription);
        }
    }, [existingProduct, setValue]);

    return (
        <div>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-[400px]'>
                    <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                    Product  Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="categoryName"
                            name="categoryName"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('productName', { required: 'Product Name is required', minLength: { value: 3, message: 'Product Name must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productName ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                </div>
                <div className=' '>
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
                            {...register('productDescription', { required: 'Product Description is required', minLength: { value: 3, message: 'Product  Description must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productDescription ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.productDescription && <p className="text-red-500 text-sm mt-1">{errors.productDescription.message}</p>}
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
                            Add Category
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
