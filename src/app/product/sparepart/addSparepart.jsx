import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const AddSparepart = ({ existingSparepart, RefreshData, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const AddSparepartData  = async (data) => {
        try {
            setLoading(true);
            const endpoint = existingSparepart?._id ? `/editSparepart/${existingSparepart._id}` : '/AddSparepart';
            const response = existingSparepart?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, data);
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

    const onSubmit = (data,e) => {
        e.preventDefault()
        AddSparepartData(data);
    };

    
    React.useEffect(() => {
        if (existingSparepart) {
            setValue('sparepartName', existingSparepart.sparepartName);
            setValue('sparepartDescription', existingSparepart.sparepartDescription);
        }
    }, [existingSparepart, setValue]);

    return (
        <div>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-[400px]'>
                    <label htmlFor="sparepartName" className="block text-sm font-medium leading-6 text-gray-900">
                    Sparepart  Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="sparepartName"
                            name="sparepartName"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('sparepartName', { required: 'Sparepart Name is required', minLength: { value: 3, message: 'Sparepart Name must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.sparepartName ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.sparepartName && <p className="text-red-500 text-sm mt-1">{errors.sparepartName.message}</p>}
                </div>
                <div className=' '>
                    <label htmlFor="sparepartDescription" className="block text-sm font-medium leading-6 text-gray-900">
                        Description
                    </label>
                    <div className="mt-2">
                        <input
                            id="sparepartDescription"
                            name="sparepartDescription"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('sparepartDescription', { required: 'Product Description is required', minLength: { value: 3, message: 'Product  Description must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.sparepartDescription ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.sparepartDescription && <p className="text-red-500 text-sm mt-1">{errors.sparepartDescription.message}</p>}
                </div>
                <div className=' '>
                    <label htmlFor="sku" className="block text-sm font-medium leading-6 text-gray-900">
                        SKU
                    </label>
                    <div className="mt-2">
                        <input
                            id="sku"
                            name="sku"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('sku', { required: 'sku is required', minLength: { value: 3, message: 'sku must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.sku ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
                </div>
                <div className='flex justify-between mt-8'>
                    <Button variant="outlined" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                        Cancel
                    </Button>
                    {existingSparepart?._id ? (
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

export default AddSparepart;
