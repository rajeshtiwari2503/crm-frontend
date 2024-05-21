import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const AddCategory = ({ existingCategory, RefreshData, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const AddProductCategory = async (data) => {
        try {
            setLoading(true);
            const endpoint = existingCategory?._id ? `/editProductCategory/${existingCategory._id}` : '/addProductCategory';
            const response = existingCategory?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, data);
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
        AddProductCategory(data);
    };

    
    React.useEffect(() => {
        if (existingCategory) {
            setValue('categoryName', existingCategory.categoryName);
        }
    }, [existingCategory, setValue]);

    return (
        <div>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-[400px]'>
                    <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                        Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="categoryName"
                            name="categoryName"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('categoryName', { required: 'Category Name is required', minLength: { value: 3, message: 'Category Name must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.categoryName ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.categoryName && <p className="text-red-500 text-sm mt-1">{errors.categoryName.message}</p>}
                </div>

                <div className='flex justify-between mt-8'>
                    <Button variant="outlined" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                        Cancel
                    </Button>
                    {existingCategory?._id ? (
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

export default AddCategory;
