import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const AddNature = ({ existingNature, RefreshData, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const AddProductCategory = async (data) => {
        try {
            setLoading(true);
            const endpoint = existingNature?._id ? `/editComplaintNature/${existingNature._id}` : '/addComplaintNature';
            const response = existingNature?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, data);
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
        if (existingNature) {
            setValue('productName', existingNature.productName);
            setValue('nature', existingNature.nature);
        }
    }, [existingNature, setValue]);

    return (
        <div>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-[400px]'>
                    <label htmlFor="categoryName" className="block text-sm font-medium leading-6 text-gray-900">
                      Product  Name
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
                <div className=' '>
                    <label htmlFor="nature" className="block text-sm font-medium leading-6 text-gray-900">
                       Complaint Nature
                    </label>
                    <div className="mt-2">
                        <input
                            id="nature"
                            name="nature"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('nature', { required: 'nature is required', minLength: { value: 3, message: 'nature must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.nature ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.nature && <p className="text-red-500 text-sm mt-1">{errors.nature.message}</p>}
                </div>
                <div className='flex justify-between mt-8'>
                    <Button variant="outlined" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                        Cancel
                    </Button>
                    {existingNature?._id ? (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Update
                        </Button>
                    ) : (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Add Nature
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddNature;
